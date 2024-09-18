import path from "node:path";
import url from "node:url";

import { mml } from "@mml-io/esbuild-plugin-mml";
import { mserveOutputProcessor } from "@mserve-io/mserve";
import * as esbuild from "esbuild";

const buildMode = "--build";
const watchMode = "--watch";
const verboseFlag = "--verbose";
const localFlag = "--local";

const args = process.argv.splice(2);

const helpString = `Mode must be provided as one of ${buildMode} or ${watchMode}`;

if (args.length === 0) {
  console.error(helpString);
  process.exit(1);
}

const [mode, verbose, local] = args.reduce<[string, boolean, boolean]>(
  (
    [mode, verbose, local]: [string, boolean, boolean],
    arg: string,
  ):
    | ["--build", boolean, boolean]
    | ["--watch", boolean, boolean]
    | [string, true, boolean]
    | [string, boolean, true] => {
    switch (arg) {
      case buildMode:
        return [arg, verbose, local];
      case watchMode:
        return [arg, verbose, local];
      case verboseFlag:
        return [mode, true, local];
      case localFlag:
        return [mode, verbose, true];
      default:
        console.error("Unknown flag:", arg);
        process.exit(1);
    }
  },
  [buildMode, false, false],
);

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outdir = path.join(__dirname, "build");

const { MSERVE_PROJECT, MMLHOSTING_PROTOCOL = "wss", MMLHOSTING_HOST } = process.env;

if (!local && (!MSERVE_PROJECT || !MMLHOSTING_HOST)) {
  console.error(
    "MSERVE_PROJECT and MMLHOSTING_HOST must be provided in the environment for non-local builds.",
  );
  process.exit(1);
}

const buildOptions: esbuild.BuildOptions = {
  entryPoints: ["src/world.ts"],
  outdir,
  bundle: true,
  minify: true,
  plugins: [
    mml({
      verbose,
      ...(!local
        ? {
            outputProcessor: mserveOutputProcessor(MSERVE_PROJECT!),
            documentPrefix: `${MMLHOSTING_PROTOCOL}://${MMLHOSTING_HOST}/v1/`,
            assetPrefix: "https://public.mml.io/",
            assetDir: "",
          }
        : {}),
    }),
  ],
};

switch (mode) {
  case buildMode:
    esbuild.build(buildOptions).catch(() => process.exit(1));
    break;
  case watchMode:
    esbuild
      .context({ ...buildOptions })
      .then((context) => context.watch())
      .catch(() => process.exit(1));
    break;
  default:
    console.error(helpString);
}
