import { createHash } from "crypto";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

import { createOpenAPIClient, OpenAPIClient } from "@marcuslongmuir/openapi-typescript-helpers";

import { apiSchema } from "./api-schema";
import {
  ApiError,
  Manifest,
  MMLObjectInstance,
  PublicBucketFile,
  UploadConfig,
  World,
} from "./types";

export class MSquaredUploader {
  private readonly client: OpenAPIClient<typeof apiSchema>;
  private config: UploadConfig;

  constructor(config: UploadConfig) {
    this.config = {
      apiUrl: "https://api.msquared.io",
      dryRun: false,
      ...config,
    };
    this.client = createOpenAPIClient(apiSchema, {
      baseUrl: this.config.apiUrl || "https://api.msquared.io",
      fetchOverride: async (request: Request) => {
        const headers = new Headers(request.headers);
        headers.set("Authorization", `Bearer ${this.config.apiKey}`);
        try {
          const response = await fetch(request, { headers });

          // If response is not ok and has a text body (like "Unauthorized"),
          // we should handle it gracefully instead of trying to parse as JSON
          if (!response.ok && response.status === 401) {
            // Create a proper error response that won't cause JSON parsing issues
            const errorText = await response.text();
            if (errorText === "Unauthorized" || errorText.includes("Unauthorized")) {
              throw new Error("Unauthorized access - check your API key and permissions");
            }
          }

          return response;
        } catch (error) {
          // Re-throw with better error message for auth issues
          if (error instanceof Error && error.message.includes("Unauthorized")) {
            throw new Error("Unauthorized access - check your API key and permissions");
          }
          throw error;
        }
      },
    });
  }

  async upload(): Promise<void> {
    try {
      console.log("🚀 Starting MSquared upload process...");
      if (this.config.dryRun) {
        console.log(
          "🔍 DRY RUN MODE - No actual uploads will be performed, but real API calls will be made to check current state",
        );
      }
      console.log(`📁 Build directory: ${this.config.buildDir}`);
      console.log(`🌍 World ID: ${this.config.worldId}`);
      console.log(`📋 Project ID: ${this.config.projectId}`);

      // Load and validate manifest
      const manifest = this.loadManifest();
      console.log(
        `📄 Loaded manifest with ${Object.keys(manifest.documentNameToPath).length} documents and ${Object.keys(manifest.assetNameToPath).length} assets`,
      );

      // TODO - expose the world index as a parameter
      const worldPathFromManifest = manifest.worlds[0];
      if (!worldPathFromManifest) {
        throw new Error("No world found in manifest");
      }
      const worldJSONFromManifest = readFileSync(
        join(this.config.buildDir, worldPathFromManifest),
        "utf-8",
      );
      const worldFromManifest = JSON.parse(worldJSONFromManifest) as World;

      // Upload assets
      await this.uploadAssets(manifest);

      // Upload documents
      await this.uploadDocuments(manifest);

      // Get world
      let worldFromAPI = await this.getWorld();
      if (!worldFromAPI) {
        console.log(
          `🔍 World not found: ${this.config.worldId} - ${this.config.dryRun ? "would create" : "creating"}...`,
        );
        if (!this.config.dryRun) {
          worldFromAPI = await this.createWorld(this.config.worldId, worldFromManifest);
        } else {
          console.log(
            `🔍 [DRY RUN] Would create world with config:`,
            JSON.stringify(worldFromManifest, null, 2),
          );
          // Mock world for dry run completion
          worldFromAPI = {
            ...worldFromManifest,
            id: this.config.worldId,
            url: `https://dryrun.example.com/worlds/${this.config.worldId}`,
            createdAt: new Date().toISOString(),
            createdBy: "dry-run-user",
          } as World;
        }
      } else {
        console.log(
          `🔍 World found: ${this.config.worldId} - ${this.config.dryRun ? "would update" : "updating"}...`,
        );
        if (!this.config.dryRun) {
          worldFromAPI = await this.updateWorld(this.config.worldId, worldFromManifest);
        } else {
          console.log(
            `🔍 [DRY RUN] Would update world with config:`,
            JSON.stringify(worldFromManifest, null, 2),
          );
          console.log(`🔍 [DRY RUN] Current world config:`, JSON.stringify(worldFromAPI, null, 2));
        }
      }

      console.log(`✅ Upload ${this.config.dryRun ? "simulation" : ""} completed successfully!`);
      console.log(`🔗 World URL: ${worldFromAPI.url}`);
    } catch (error) {
      this.handleError("Upload failed", error);
      throw error;
    }
  }

  private loadManifest(): Manifest {
    const manifestPath = join(this.config.buildDir, "manifest.json");

    if (!existsSync(manifestPath)) {
      throw new Error(`Manifest file not found at: ${manifestPath}`);
    }

    try {
      const manifestContent = readFileSync(manifestPath, "utf-8");
      return JSON.parse(manifestContent) as Manifest;
    } catch (error) {
      throw new Error(
        `Failed to parse manifest file: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async getWorld(): Promise<World | null> {
    try {
      console.log(`🔍 Getting world: ${this.config.worldId}`);
      const worldResponse = await this.client.v1_worlds_getWorld({
        parameters: {
          worldId: this.config.worldId,
          projectId: this.config.projectId,
        },
        body: null,
      });
      if (worldResponse.code === 200) {
        const worldBody = worldResponse.body as unknown as World;
        console.log(`✅ Retrieved world: ${worldBody.name} (${worldBody.id})`);
        return worldBody;
      }
      if (worldResponse.code === 404) {
        console.log(`🔍 World not found: ${this.config.worldId}`);
        return null;
      }
      throw new Error(
        `Failed to get world: ${worldResponse.code} ${JSON.stringify(worldResponse.body)}`,
      );
    } catch (error) {
      // Handle unauthorized errors first
      const unauthorizedError = this.handleUnauthorizedError(error);
      if (unauthorizedError) {
        throw unauthorizedError;
      }
      this.handleError("Failed to get world", error);
      throw error;
    }
  }

  private async uploadAssets(manifest: Manifest): Promise<void> {
    const assetEntries = Object.entries(manifest.assetNameToPath);

    if (assetEntries.length === 0) {
      console.log("📦 No assets to upload");
      return;
    }

    console.log(
      `📦 ${this.config.dryRun ? "Would upload" : "Uploading"} ${assetEntries.length} assets...`,
    );

    // Check if the bucket exists and create it if it doesn't
    const bucketResponse = await this.client.v1_storageService_getPublicBucket({
      parameters: {
        projectId: this.config.projectId,
        publicBucketId: this.config.bucketId,
      },
      body: null,
    });
    if (bucketResponse.code === 200) {
      console.log(`✅ Bucket found: ${this.config.bucketId}`);
    } else {
      console.log(`🔍 Bucket not found: ${this.config.bucketId} - creating...`);
      const createResponse = await this.client.v1_storageService_createPublicBucket({
        parameters: {
          projectId: this.config.projectId,
        },
        body: {
          id: this.config.bucketId,
          name: this.config.bucketId,
          description: "Assets bucket",
        },
      });
      if (createResponse.code === 200) {
        console.log(`✅ Bucket created: ${this.config.bucketId}`);
      } else {
        throw new Error(`Failed to create bucket: ${this.formatError(createResponse.body)}`);
      }
    }

    // Process all assets in parallel
    const uploadPromises = assetEntries.map(([assetName, assetPath]) =>
      this.uploadSingleAsset(assetName, assetPath),
    );

    // Wait for all assets to complete and collect results
    const results = await Promise.allSettled(uploadPromises);

    // Print grouped logs for each asset
    results.forEach((result, index) => {
      const [assetName] = assetEntries[index];
      if (result.status === "fulfilled") {
        // Print successful logs
        result.value.forEach((log) => console.log(log));
      } else {
        // Print error logs
        console.error(
          `❌ Failed to process asset ${assetName}: ${this.formatError(result.reason)}`,
        );
      }
    });

    // Check if any assets failed
    const failedResults = results.filter((result) => result.status === "rejected");
    if (failedResults.length > 0) {
      const firstError = (failedResults[0] as PromiseRejectedResult).reason;
      const newError = new Error(
        `Failed to process ${failedResults.length} asset(s): ${this.formatError(firstError)}`,
      );
      (newError as any).cause = firstError;
      throw newError;
    }

    console.log(`📦 Assets upload ${this.config.dryRun ? "simulation" : ""} complete`);
  }

  private async uploadSingleAsset(assetName: string, assetPath: string): Promise<string[]> {
    const logs: string[] = [];

    const fullPath = join(this.config.buildDir, assetPath);
    if (!existsSync(fullPath)) {
      const error = new Error(`Asset file not found: ${fullPath}`);
      (error as any).cause = new Error(`Missing file: ${fullPath}`);
      throw error;
    }

    // Make the call to get the file metadata
    const fileMetadataResponse = await this.client.v1_storageService_getPublicBucketFileMetadata({
      parameters: {
        projectId: this.config.projectId,
        publicBucketId: this.config.bucketId,
        fullPath: assetName,
      },
      body: null,
    });
    if (fileMetadataResponse.code === 200) {
      const fileMetadata: PublicBucketFile = fileMetadataResponse.body;
      // The file exists - we can check the md5 checksum of the file on disk and compare it to the checksum in the file metadata
      const fileChecksum = createHash("md5").update(readFileSync(fullPath)).digest("hex");
      if (fileChecksum === fileMetadata.eTag) {
        logs.push(`  ✅ File already exists with the same checksum: ${assetName} - ${assetPath}`);
        return logs;
      } else {
        logs.push(
          `  📄 File checksum mismatch: ${fileChecksum} !== ${fileMetadata.eTag} (${assetName} - ${assetPath})`,
        );
        if (this.config.dryRun) {
          logs.push(`  📄 [DRY RUN] Would upload: ${assetName} - ${assetPath}`);
          return logs;
        } else {
          logs.push(`  📄 Uploading: ${assetName} - ${assetPath}`);
          await this.uploadAsset(assetName, fullPath);
          logs.push(`  ✅ Asset uploaded: ${assetName} - ${assetPath}`);
          return logs;
        }
      }
    } else if (fileMetadataResponse.code === 404) {
      logs.push(`  📄 File does not exist: ${assetName} - ${assetPath}`);
      if (this.config.dryRun) {
        logs.push(`  📄 [DRY RUN] Would upload: ${assetName} - ${assetPath}`);
        return logs;
      } else {
        logs.push(`  📄 Uploading: ${assetName} - ${assetPath}`);
        await this.uploadAsset(assetName, fullPath);
        logs.push(`  ✅ Asset uploaded: ${assetName} - ${assetPath}`);
        return logs;
      }
    } else {
      throw new Error(
        `Failed to get file metadata: ${this.formatError(fileMetadataResponse.body)}`,
      );
    }
  }

  private async uploadAsset(assetName: string, fullPath: string): Promise<void> {
    const formData = new FormData();
    formData.append("file", new Blob([readFileSync(fullPath)]), assetName);

    const response = await fetch(
      `${this.config.apiUrl}/v1/storage/${this.config.projectId}/public-buckets/${this.config.bucketId}/upload-file`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: formData,
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to upload asset ${assetName}: ${response.statusText}`);
    }
  }

  private async getDocument(documentId: string): Promise<MMLObjectInstance | null> {
    try {
      const documentResponse = await this.client.v1_mmlObjects_getMMLObjectInstance({
        parameters: {
          projectId: this.config.projectId,
          instanceId: documentId,
        },
        body: null,
      });
      if (documentResponse.code === 200) {
        return documentResponse.body as unknown as MMLObjectInstance;
      }
      if (documentResponse.code === 404) {
        return null;
      }
      throw new Error(
        `Failed to get document: ${documentResponse.code} ${JSON.stringify(documentResponse.body)}`,
      );
    } catch (error) {
      // Handle unauthorized errors first
      const unauthorizedError = this.handleUnauthorizedError(error);
      if (unauthorizedError) {
        throw unauthorizedError;
      }
      // Don't log error for 404s during dry run - it's expected
      if (this.config.dryRun && error instanceof Error && error.message.includes("404")) {
        return null;
      }
      throw error;
    }
  }

  private async uploadDocuments(manifest: Manifest): Promise<void> {
    const documentEntries = Object.entries(manifest.documentNameToPath);

    if (documentEntries.length === 0) {
      console.log("📄 No documents to upload");
      return;
    }

    console.log(
      `📄 ${this.config.dryRun ? "Would upload" : "Uploading"} ${documentEntries.length} documents...`,
    );

    // Process all documents in parallel
    const uploadPromises = documentEntries.map(([documentId, documentPath]) =>
      this.uploadSingleDocument(documentId, documentPath),
    );

    // Wait for all documents to complete and collect results
    const results = await Promise.allSettled(uploadPromises);

    // Print grouped logs for each document
    results.forEach((result, index) => {
      const [documentId] = documentEntries[index];
      if (result.status === "fulfilled") {
        // Print successful logs
        result.value.forEach((log) => console.log(log));
      } else {
        // Print error logs
        console.error(
          `❌ Failed to process document ${documentId}: ${this.formatError(result.reason)}`,
        );
      }
    });

    // Check if any documents failed
    const failedResults = results.filter((result) => result.status === "rejected");
    if (failedResults.length > 0) {
      const firstError = (failedResults[0] as PromiseRejectedResult).reason;
      const newError = new Error(
        `Failed to process ${failedResults.length} document(s): ${this.formatError(firstError)}`,
      );
      (newError as any).cause = firstError;
      throw newError;
    }

    console.log(`📄 Documents upload ${this.config.dryRun ? "simulation" : ""} complete`);
  }

  private async uploadSingleDocument(documentId: string, documentPath: string): Promise<string[]> {
    const logs: string[] = [];
    const fullPath = join(this.config.buildDir, documentPath);

    if (!existsSync(fullPath)) {
      const error = new Error(`Document file not found: ${fullPath}`);
      (error as any).cause = new Error(`Missing file: ${fullPath}`);
      throw error;
    }

    const content = readFileSync(fullPath, "utf-8");

    try {
      const document = await this.getDocument(documentId);
      if (document) {
        logs.push(`  📝 Document already exists: ${documentId}`);
        if (document.source?.source === content) {
          logs.push(`  📝 Document source is the same as the content`);
        } else {
          logs.push(`  📝 Document source is different from the content`);
          if (this.config.dryRun) {
            logs.push(`  📝 [DRY RUN] Would update document: ${documentId}`);
            logs.push(
              `  📝 [DRY RUN] Current content length: ${document.source?.toString().length || 0} characters`,
            );
            logs.push(`  📝 [DRY RUN] New content length: ${content.length} characters`);
          } else {
            const updateResponse = await this.client.v1_mmlObjects_updateMMLObjectInstance({
              parameters: {
                projectId: this.config.projectId,
                instanceId: document.id,
              },
              body: {
                name: documentId,
                source: {
                  type: "source",
                  source: content,
                },
                enabled: true,
              },
            });
            if (updateResponse.code === 200) {
              logs.push(`  ✅ Document updated: ${documentId}`);
            } else {
              const error = new Error(
                `Failed to update document ${documentId}: ${this.formatError(updateResponse.body)}`,
              );
              (error as any).cause = updateResponse.body;
              throw error;
            }
          }
        }
      } else {
        if (this.config.dryRun) {
          logs.push(`  📝 [DRY RUN] Would create document: ${documentId}`);
          logs.push(`  📝 [DRY RUN] Content length: ${content.length} characters`);
        } else {
          const createResponse = await this.client.v1_mmlObjects_createObjectInstance({
            parameters: {
              projectId: this.config.projectId,
            },
            body: {
              name: documentId,
              id: documentId,
              source: {
                type: "source",
                source: content,
              },
              enabled: true,
            },
          });
          if (createResponse.code === 200) {
            logs.push(`  ✅ Document created: ${documentId}`);
          } else {
            const error = new Error(
              `Failed to create document ${documentId}: ${this.formatError(createResponse.body)}`,
            );
            (error as any).cause = createResponse.body;
            throw error;
          }
        }
      }
    } catch (error) {
      const newError = new Error(
        `Failed to process document ${documentId}: ${this.formatError(error)}`,
      );
      (newError as any).cause = error;
      throw newError;
    }

    return logs;
  }

  private async createWorld(worldId: string, worldFromManifest: World): Promise<World> {
    try {
      const createResponse = await this.client.v1_worlds_createWorld({
        parameters: {
          projectId: this.config.projectId,
        },
        body: {
          ...worldFromManifest,
          id: worldId,
        }, // Type assertion to work around strict typing
      });
      if (createResponse.code === 200) {
        console.log(`  ✅ World created: ${worldId}`);
        return createResponse.body as unknown as World;
      } else {
        console.error(
          `❌ Failed to create world ${worldId}:`,
          this.formatError(createResponse.body),
        );
        throw new Error(
          `Failed to create world ${worldId}: ${this.formatError(createResponse.body)}`,
        );
      }
    } catch (error) {
      // Handle unauthorized errors first
      const unauthorizedError = this.handleUnauthorizedError(error);
      if (unauthorizedError) {
        throw unauthorizedError;
      }
      throw error;
    }
  }

  private async updateWorld(worldId: string, worldFromManifest: World): Promise<World> {
    try {
      const updateResponse = await this.client.v1_worlds_updateWorld({
        parameters: {
          projectId: this.config.projectId,
          worldId,
        },
        body: worldFromManifest, // Type assertion to work around strict typing
      });
      if (updateResponse.code === 200) {
        console.log(`  ✅ World updated: ${worldId}`);
        return updateResponse.body as unknown as World;
      } else {
        console.error(
          `❌ Failed to update world ${worldId}:`,
          this.formatError(updateResponse.body),
        );
        throw new Error(
          `Failed to update world ${worldId}: ${this.formatError(updateResponse.body)}`,
        );
      }
    } catch (error) {
      // Handle unauthorized errors first
      const unauthorizedError = this.handleUnauthorizedError(error);
      if (unauthorizedError) {
        throw unauthorizedError;
      }
      throw error;
    }
  }

  private handleUnauthorizedError(error: any): Error | null {
    if (error instanceof Error) {
      // Handle JSON parsing errors for unauthorized responses
      if (error.message.includes(`Unexpected token 'U', "Unauthorized"`)) {
        return new Error("Unauthorized access - check your API key and permissions");
      }
      // Handle plain text unauthorized responses
      if (error.message.includes("Unauthorized")) {
        return new Error("Unauthorized access - check your API key and permissions");
      }
    }
    const errorString = String(error);
    if (errorString.includes("Unauthorized")) {
      return new Error("Unauthorized access - check your API key and permissions");
    }
    return null;
  }

  private formatError(error: any): string {
    const unauthorizedError = this.handleUnauthorizedError(error);
    if (unauthorizedError) {
      return unauthorizedError.message;
    }

    if (typeof error === "object" && error !== null) {
      // Handle errors with validation details
      if ("errors" in error && Array.isArray(error.errors)) {
        const errorDetails = error.errors
          .map((err: any) => {
            if (typeof err === "object" && err !== null) {
              if ("message" in err) {
                return err.message;
              }
              if ("path" in err && "message" in err) {
                return `${err.path}: ${err.message}`;
              }
              return JSON.stringify(err, null, 2);
            }
            return String(err);
          })
          .join(", ");
        return `Validation errors: ${errorDetails}`;
      }

      // Handle API response errors
      if ("message" in error) {
        return error.message;
      }
      if ("status" in error) {
        return `HTTP ${error.status}`;
      }

      // For complex objects, show JSON representation
      try {
        return JSON.stringify(error, null, 2);
      } catch {
        // Fallback if JSON.stringify fails
        return `Error object: ${Object.keys(error).join(", ")}`;
      }
    }
    return String(error);
  }

  private handleError(context: string, error: any): void {
    const errorMessage = this.formatError(error);
    console.error(`❌ ${context}: ${errorMessage}`);

    if (typeof error === "object" && error !== null && "status" in error) {
      const apiError = error as ApiError;
      if (apiError.status === 401) {
        console.error("💡 Check your API key is valid and has the correct permissions");
      } else if (apiError.status === 403) {
        console.error("💡 Check you have access to the specified project");
      } else if (apiError.status === 404) {
        console.error("💡 Check the project ID is correct");
      }
    }
  }
}
