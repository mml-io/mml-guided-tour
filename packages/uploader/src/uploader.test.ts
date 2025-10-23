// Jest integration tests for MSquaredUploader with MSW-based API mocking

import { existsSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { UploadConfig } from "./types";
import { MSquaredUploader } from "./uploader";

// Create MSW server with mock handlers
const server = setupServer(
  // Mock GET world - return 404 (world not found)
  http.get("*/v1/worlds/:projectId/web-world-instances/:worldId", ({ params }) => {
    console.log(`[MSW] GET world: ${params.worldId}`);
    return HttpResponse.json({ message: "World not found" }, { status: 404 });
  }),

  // Mock POST world creation
  http.post("*/v1/worlds/:projectId/web-world-instances", async ({ request, params }) => {
    const body = (await request.json()) as any;
    console.log(`[MSW] POST create world: ${body.id}`);

    return HttpResponse.json({
      id: body.id,
      name: body.name || "Test World",
      url: `https://mock.example.com/worlds/${body.id}`,
      createdAt: new Date().toISOString(),
      createdBy: "test@test.com",
      authConfiguration: {
        allowAnonymous: true,
        authProviders: {},
      },
      mmlDocumentsConfiguration: {
        mmlDocuments: {},
      },
      chatConfiguration: {
        enabled: false,
      },
      environmentConfiguration: {},
      displayNameConfiguration: {
        allowCustomDisplayNames: false,
      },
      avatarConfiguration: {
        allowCustomAvatars: false,
      },
      loadingConfiguration: {
        enableCustomLoadingScreen: false,
      },
      ...body,
    });
  }),

  // Mock POST world update
  http.post("*/v1/worlds/:projectId/web-world-instances/:worldId", async ({ request, params }) => {
    const body = (await request.json()) as any;
    console.log(`[MSW] POST update world: ${params.worldId}`);

    return HttpResponse.json({
      id: params.worldId,
      ...body,
    });
  }),

  // Mock GET document - return 404 (document not found)
  http.get("*/v1/mml-objects/:projectId/object-instances/:instanceId", ({ params }) => {
    console.log(`[MSW] GET document: ${params.instanceId}`);
    return HttpResponse.json({ message: "Document not found" }, { status: 404 });
  }),

  // Mock POST document creation
  http.post("*/v1/mml-objects/:projectId/object-instances", async ({ request, params }) => {
    const body = (await request.json()) as any;
    console.log(`[MSW] POST create document: ${body.id}`);

    return HttpResponse.json({
      id: body.id,
      name: body.name,
      source: body.source,
      enabled: body.enabled,
      url: `https://mock.example.com/documents/${body.id}`,
      createdAt: new Date().toISOString(),
      createdBy: "test@test.com",
    });
  }),

  // Mock POST document update
  http.post(
    "*/v1/mml-objects/:projectId/object-instances/:instanceId",
    async ({ request, params }) => {
      const body = (await request.json()) as any;
      console.log(`[MSW] POST update document: ${params.instanceId}`);

      return HttpResponse.json({
        id: params.instanceId,
        name: body.name,
        source: body.source,
        enabled: body.enabled,
        url: `https://mock.example.com/documents/${params.instanceId}`,
        createdAt: new Date().toISOString(),
        createdBy: "test@test.com",
      });
    },
  ),

  // Storage Service Handlers

  // Mock GET bucket - return 404 (bucket not found) to trigger creation
  http.get("*/v1/storage/:projectId/public-buckets/:bucketId", ({ params }) => {
    console.log(`[MSW] GET bucket: ${params.bucketId}`);
    return HttpResponse.json({ message: "Bucket not found" }, { status: 404 });
  }),

  // Mock POST bucket creation
  http.post("*/v1/storage/:projectId/public-buckets", async ({ request, params }) => {
    const body = (await request.json()) as any;
    console.log(`[MSW] POST create bucket: ${body.id}`);

    return HttpResponse.json({
      id: body.id,
      name: body.name,
      description: body.description || "Assets bucket",
      createdAt: new Date().toISOString(),
      createdBy: "test@test.com",
      projectId: params.projectId,
      isPublic: true,
    });
  }),

  // Mock GET file metadata - return 404 (file not found) to trigger upload
  http.get("*/v1/storage/:projectId/public-buckets/:bucketId/file-metadata", ({ params, request }) => {
    const url = new URL(request.url);
    const fullPath = url.searchParams.get('fullPath');
    console.log(`[MSW] GET file metadata: ${params.bucketId}, file: ${fullPath}`);
    return HttpResponse.json({ message: "File not found" }, { status: 404 });
  }),

  // Mock POST file upload
  http.post("*/v1/storage/:projectId/public-buckets/:bucketId/upload-file", async ({ request, params }) => {
    console.log(`[MSW] POST upload file to bucket: ${params.bucketId}`);

    // Since this is FormData, we can't easily get the file name, but that's OK for testing
    return HttpResponse.json({
      id: "test-file-id",
      name: "test-asset.png",
      size: 1024,
      contentType: "image/png",
      eTag: "test-etag",
      url: `https://mock.example.com/storage/${params.bucketId}/test-asset.png`,
      createdAt: new Date().toISOString(),
      createdBy: "test@test.com",
    });
  }),
);

describe("MSquaredUploader Integration Tests", () => {
  const tempDir = join(process.cwd(), "tmp/test-upload");

  beforeAll(() => {
    // Start MSW server
    server.listen({ onUnhandledRequest: "warn" });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    // Setup test files
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true });
    }
    mkdirSync(tempDir, { recursive: true });

    // Create test manifest
    const manifest = {
      documentNameToPath: {
        "test-doc": "documents/test-doc.mml",
      },
      assetNameToPath: {
        "test-asset.png": "assets/test-asset.png",
      },
      worlds: ["world.json"],
    };
    writeFileSync(join(tempDir, "manifest.json"), JSON.stringify(manifest, null, 2));

    // Create test document
    mkdirSync(join(tempDir, "documents"), { recursive: true });
    writeFileSync(join(tempDir, "documents/test-doc.mml"), "<m-cube></m-cube>");

    // Create test asset
    mkdirSync(join(tempDir, "assets"), { recursive: true });
    writeFileSync(join(tempDir, "assets/test-asset.png"), "fake-png-data");

    // Create test world
    const world = {
      name: "Test World",
      description: "A test world",
      authConfiguration: {
        allowAnonymous: true,
        authProviders: {},
      },
      mmlDocumentsConfiguration: {
        mmlDocuments: {},
      },
      chatConfiguration: {
        enabled: false,
      },
      environmentConfiguration: {},
      displayNameConfiguration: {
        allowCustomDisplayNames: false,
      },
      avatarConfiguration: {
        allowCustomAvatars: false,
      },
      loadingConfiguration: {
        enableCustomLoadingScreen: false,
      },
    };
    writeFileSync(join(tempDir, "world.json"), JSON.stringify(world, null, 2));
  });

  afterEach(() => {
    // Cleanup
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true });
    }
  });

  it("should successfully upload with mocked API responses", async () => {
    const config: UploadConfig = {
      apiKey: "test-api-key",
      apiUrl: "https://api.msquared.io", // MSW will intercept this
      projectId: "test-project",
      bucketId: "test-bucket",
      worldId: "test-world",
      buildDir: tempDir,
      dryRun: false, // Use real upload mode to test the full flow
    };

    const uploader = new MSquaredUploader(config);

    // Capture console output
    const consoleLogs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      const message = args.join(" ");
      if (!message.includes("[MSW]")) {
        // Don't capture MSW debug logs
        consoleLogs.push(message);
      }
      originalLog(...args);
    };

    try {
      await uploader.upload();

      // Verify expected log messages
      const hasStartMessage = consoleLogs.some((log) =>
        log.includes("Starting MSquared upload process"),
      );
      const hasWorldNotFound = consoleLogs.some((log) => log.includes("World not found"));
      const hasWorldCreated = consoleLogs.some((log) => log.includes("World created"));
      const hasDocumentCreated = consoleLogs.some((log) => log.includes("Document created"));
      const hasUploadComplete = consoleLogs.some(
        (log) => log.includes("Upload") && log.includes("completed successfully"),
      );

      expect(hasStartMessage).toBe(true);
      expect(hasWorldNotFound).toBe(true);
      expect(hasWorldCreated).toBe(true);
      expect(hasDocumentCreated).toBe(true);
      expect(hasUploadComplete).toBe(true);
    } finally {
      console.log = originalLog;
    }
  });

  it("should handle dry run mode correctly", async () => {
    const config: UploadConfig = {
      apiKey: "test-api-key",
      apiUrl: "https://api.msquared.io",
      projectId: "test-project",
      bucketId: "test-bucket",
      worldId: "test-world",
      buildDir: tempDir,
      dryRun: true,
    };

    const uploader = new MSquaredUploader(config);

    // Capture console output
    const consoleLogs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      const message = args.join(" ");
      if (!message.includes("[MSW]")) {
        consoleLogs.push(message);
      }
      originalLog(...args);
    };

    try {
      await uploader.upload();

      const hasDryRunMode = consoleLogs.some((log) => log.includes("DRY RUN MODE"));
      const hasWouldCreate = consoleLogs.some((log) => log.includes("would create"));
      const hasSimulationComplete = consoleLogs.some((log) => log.includes("simulation"));

      expect(hasDryRunMode).toBe(true);
      expect(hasWouldCreate).toBe(true);
      expect(hasSimulationComplete).toBe(true);
    } finally {
      console.log = originalLog;
    }
  });
});
