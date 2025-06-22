import * as esbuild from "esbuild";

const watchMode = process.argv.includes("--watch");

const options: esbuild.BuildOptions = {
  entryPoints: ["src/cli.ts"],
  outfile: "bin/index.js",
  platform: "node",
  banner: {
    js: "#!/usr/bin/env node --enable-source-maps",
  },
  logLevel: "info",
  format: "cjs",
  bundle: true,
  sourcemap: "inline",
};

if (watchMode) {
  esbuild
    .context(options)
    .then((context) => context.watch())
    .catch(() => process.exit(1));
} else {
  esbuild.build(options).catch(() => process.exit(1));
}
