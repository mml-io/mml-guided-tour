import { resolve } from "path";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { UploadConfig } from "./types";
import { MSquaredUploader } from "./uploader";

function getConfig(): UploadConfig {
  const argv = yargs(hideBin(process.argv))
    .scriptName("mml-uploader")
    .usage(
      "🚀 MSquared Upload Tool\n\nUpload your MML project to the MSquared platform.\n\nUsage: $0 [options]",
    )
    .option("api-key", {
      type: "string",
      description: "API key for MSquared platform",
      demandOption: false,
    })
    .option("project-id", {
      type: "string",
      description: "Project ID to upload to",
      demandOption: false,
    })
    .option("world-id", {
      type: "string",
      description: "ID of the world to create/update",
      demandOption: false,
    })
    .option("bucket-id", {
      type: "string",
      description: "ID of the bucket to upload to",
      demandOption: false,
    })
    .option("build-dir", {
      type: "string",
      description: "Path to build directory",
    })
    .option("api-url", {
      type: "string",
      description: "MSquared API URL",
    })
    .option("dry-run", {
      type: "boolean",
      description: "Show what would be uploaded without making requests",
      default: false,
    })
    .epilogue(
      `Environment Variables:
  You can also set these environment variables instead of command line options:
  - MSQUARED_API_KEY
  - MSQUARED_PROJECT_ID  
  - MSQUARED_WORLD_ID
  - MSQUARED_BUCKET_ID
  - MSQUARED_BUILD_DIR
  - MSQUARED_API_URL
  - MSQUARED_DRY_RUN=true

Examples:
  # Upload using command line arguments
  mml-uploader \\
    --api-key your-api-key \\
    --project-id your-project-id \\
    --world-id "My World"

  # Dry run to see what would be uploaded  
  mml-uploader \\
    --api-key your-api-key \\
    --project-id your-project-id \\
    --world-id "My World" \\
    --dry-run

  # Upload using environment variables
  export MSQUARED_API_KEY=your-api-key
  export MSQUARED_PROJECT_ID=your-project-id  
  export MSQUARED_WORLD_ID="My World"
  mml-uploader`,
    )
    .help()
    .parseSync();

  const buildDir = argv.buildDir || process.env.MSQUARED_BUILD_DIR;
  if (!buildDir) {
    throw new Error("Build directory is required. Use --build-dir or MSQUARED_BUILD_DIR.");
  }

  const config: UploadConfig = {
    apiKey: argv.apiKey || process.env.MSQUARED_API_KEY || "",
    projectId: argv.projectId || process.env.MSQUARED_PROJECT_ID || "",
    worldId: argv.worldId || process.env.MSQUARED_WORLD_ID || "",
    bucketId: argv.bucketId || process.env.MSQUARED_BUCKET_ID || "",
    buildDir: resolve(buildDir),
    apiUrl: argv.apiUrl || process.env.MSQUARED_API_URL || "https://api.msquared.io",
    dryRun: argv.dryRun || process.env.MSQUARED_DRY_RUN === "true",
  };

  // Validate required fields
  const errors: string[] = [];

  if (!config.apiKey) {
    errors.push("API key is required (--api-key or MSQUARED_API_KEY)");
  }

  if (!config.projectId) {
    errors.push("Project ID is required (--project-id or MSQUARED_PROJECT_ID)");
  }

  if (!config.worldId) {
    errors.push("World ID is required (--world-id or MSQUARED_WORLD_ID)");
  }

  if (!config.bucketId) {
    errors.push("Bucket ID is required (--bucket-id or MSQUARED_BUCKET_ID)");
  }

  if (errors.length > 0) {
    console.error("❌ Configuration errors:");
    errors.forEach((error) => console.error(`   ${error}`));
    console.error("\nUse --help for usage information.");
    process.exit(1);
  }

  return config;
}

async function main(): Promise<void> {
  try {
    const config = getConfig();
    const uploader = new MSquaredUploader(config);
    await uploader.upload();
    process.exit(0);
  } catch (error) {
    console.error("💥 Upload failed with unhandled error:", error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Promise rejection:", reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
  process.exit(1);
});

// Run if this is the main module
if (require.main === module) {
  main();
}
