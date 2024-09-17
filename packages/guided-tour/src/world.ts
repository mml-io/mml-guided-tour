import type { MMLWorldConfig } from "@mml-io/esbuild-plugin-mml";
import tour from "mml:./guided-tour";

export default {
  mmlDocuments: {
    tour: {
      url: tour,
    },
  },
} satisfies MMLWorldConfig;
