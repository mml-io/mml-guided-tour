import path from "node:path";
import url from "node:url";

import { mml, MMLPluginOptions } from "@mml-io/esbuild-plugin-mml";
import * as esbuild from "esbuild";

const buildModeFlag = "--build";
const watchModeFlag = "--watch";
const localFlag = "--local";
const distFlag = "--dist";

const args = process.argv.splice(2);

const helpString = `Mode must be provided as one of ${buildModeFlag} or ${watchModeFlag}`;

if (args.length === 0) {
  console.error(helpString);
  process.exit(1);
}

const buildMode = args.includes(buildModeFlag);
const watchMode = args.includes(watchModeFlag);
if (buildMode && watchMode) {
  console.error("Cannot use both build and watch mode at the same time");
  process.exit(1);
}

const localMode = args.includes(localFlag);
const distMode = args.includes(distFlag);
if (localMode && distMode) {
  console.error("Cannot use both local and dist mode at the same time");
  process.exit(1);
}

enum Mode {
  Build = "build",
  Watch = "watch",
}
const mode = buildMode ? Mode.Build : watchMode ? Mode.Watch : Mode.Build;

enum BuildType {
  Local = "local",
  Dist = "dist",
}
const buildType = localMode ? BuildType.Local : distMode ? BuildType.Dist : BuildType.Local;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outdir = path.join(__dirname, buildType === BuildType.Local ? "build" : "dist");


let mmlPluginOptions: MMLPluginOptions;
if (buildType === BuildType.Dist) {
  const {
    MSQUARED_PROJECT_ID,
    MSQUARED_BUCKET_ID,
    MSQUARED_MML_HOST = "mmlhosting.com",
    MSQUARED_STORAGE_HOST = ".msquaredhosting.com",
  } = process.env;

  if (!MSQUARED_PROJECT_ID) {
    console.error("MSQUARED_PROJECT_ID must be provided in the environment for non-local builds.");
    process.exit(1);
  }

  if (!MSQUARED_BUCKET_ID) {
    console.error("MSQUARED_BUCKET_ID must be provided in the environment for non-local builds.");
    process.exit(1);
  }

  const documentPrefix = `wss://${MSQUARED_MML_HOST}/v1/${MSQUARED_PROJECT_ID}_`;
  const assetPrefix = `https://${MSQUARED_BUCKET_ID}--${MSQUARED_PROJECT_ID}${MSQUARED_STORAGE_HOST}/`;
  console.log("Document prefix (where MML documents are expected to be publicly accessible):");
  console.log(` - "${documentPrefix}"`);
  console.log(` - e.g. "${documentPrefix}my-document.mml"`);
  console.log("Asset prefix (where assets are expected to be publicly accessible):");
  console.log(` - "${assetPrefix}"`);
  console.log(` - e.g. "${assetPrefix}my-asset.glb"`);

  mmlPluginOptions = {
    documentPrefix,
    assetPrefix,
    assetDir: "assets",
    stripHtmlExtension: true,
  };
} else {
  mmlPluginOptions = {
    assetPrefix: "/assets/",
    assetDir: "assets",
  };
}

const buildOptions: esbuild.BuildOptions = {
  entryPoints: ["./src/world.ts"],
  outdir,
  bundle: true,
  sourceRoot: "./src",
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "info",
  format: "esm",
  loader: {
    ".svg": "file",
    ".png": "file",
    ".jpg": "file",
    ".jpeg": "file",
    ".glb": "file",
    ".hdr": "file",
    ".mp3": "file",
    ".mp4": "file",
    ".wav": "file",
  },
  plugins: [
    mml({
      verbose: true,
      ...mmlPluginOptions,
    }),
  ],
};

switch (mode) {
  case Mode.Build:
    esbuild.build(buildOptions).catch(() => process.exit(1));
    break;
  case Mode.Watch:
    esbuild
      .context({ ...buildOptions })
      .then((context) => context.watch())
      .catch(() => process.exit(1));
    break;
  default:
    console.error(helpString);
}
