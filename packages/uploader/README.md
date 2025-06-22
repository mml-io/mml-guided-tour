# MSquared Uploader

A standalone CLI tool and library for uploading MML projects to the MSquared platform. This tool reads a generated `manifest.json` file from your build directory and uploads all assets and documents to create or update a world on the MSquared platform.

## Features

- 📦 **Asset Upload**: Uploads all assets (models, textures, sounds, videos) to MSquared Storage
- 📄 **Document Upload**: Uploads MML documents to MSquared MML Hosting
- 🔧 **World Configuration**: Configures an MSquared Web World with uploaded documents

## Prerequisites

1. **MSquared API Key**: You need a valid API key for the MSquared platform
2. **Project ID**: The ID of the MSquared project where you want to upload
4. **Bucket ID**: The ID of the MSquared Storage bucket to upload assets to
3. **World ID**: The ID of the world you want to create/update
5. **Built Project**: Run your project's build command first to generate the `manifest.json`, documents, and assets

## Usage

### Command Line Interface

```bash
npx mml-uploader --api-key YOUR_API_KEY --project-id YOUR_PROJECT_ID --world-id YOUR_WORLD_ID --bucket-id YOUR_BUCKET_ID --build-dir ./build
```

### Environment Variables

You can set environment variables instead of passing command line arguments:

```bash
export MSQUARED_API_KEY="your-api-key"
export MSQUARED_PROJECT_ID="your-project-id"
export MSQUARED_WORLD_ID="my-world-id"
export MSQUARED_BUCKET_ID="your-bucket-id"
export MSQUARED_BUILD_DIR=./build
npx mml-uploader
```

### Options

| Option        | Environment Variable     | Description                                     | Required                                  |
|---------------|--------------------------|-------------------------------------------------|-------------------------------------------|
| `--api-key`   | `MSQUARED_API_KEY`       | API key for MSquared platform                   | ✅                                        |
| `--project-id`| `MSQUARED_PROJECT_ID`    | Project ID to upload to                         | ✅                                        |
| `--world-id`  | `MSQUARED_WORLD_ID`      | ID of the world to create/update                | ✅                                        |
| `--bucket-id` | `MSQUARED_BUCKET_ID`     | ID of the storage bucket to upload assets to    | ✅                                        |
| `--build-dir` | `MSQUARED_BUILD_DIR`     | Path to build directory                         | ✅                                        |
| `--api-url`   | `MSQUARED_API_URL`       | MSquared API URL                                | ❌ (default: `https://api.msquared.io`)   |
| `--dry-run`   | `MSQUARED_DRY_RUN=true`  | Preview uploads without making requests         | ❌                                        |
| `--help`      | -                        | Show help message                               | ❌                                        |

## How It Works

1. **Load Manifest**: Reads `manifest.json` from the build directory
2. **Find/Create World**: Searches for existing world by id, creates new one if not found
3. **Upload Assets**: Uploads all files from `assetNameToPath` to MSquared file storage
4. **Upload Documents**: Uploads all HTML files from `documentNameToPath` as MML documents
5. **Update Configuration**: Configures the world to reference all uploaded documents

## Example Workflows

### Basic Upload

```bash
# 1. Build your project
npm run build

# 2. Preview what would be uploaded (dry run)
mml-uploader \
  --api-key "your-api-key-here" \
  --project-id "proj-123abc" \
  --world-id "guided-tour" \
  --bucket-id "bucket-456def" \
  --build-dir ./build \
  --dry-run

# 3. Upload to MSquared
mml-uploader \
  --api-key "your-api-key-here" \
  --project-id "proj-123abc" \
  --world-id "guided-tour" \
  --bucket-id "bucket-456def" \
  --build-dir ./build
```