import type { MMLWorldConfig } from "@mml-io/esbuild-plugin-mml";
/*eslint import/no-unresolved: [2, { ignore: ['^mml:'] }]*/
import tour from "mml:./guided-tour";

export default {
  mmlDocuments: {
    tour: {
      url: tour,
    },
  },
} satisfies MMLWorldConfig;
