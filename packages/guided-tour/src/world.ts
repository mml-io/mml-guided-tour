import type { MMLWorldConfig } from "@mml-io/esbuild-plugin-mml";
import type { World } from "@private/uploader";
import tour from "mml:./guided-tour";

export default {
  name: "MML Guided Tour",
  mmlDocumentsConfiguration: {
    mmlDocuments: {
      tour: {
        url: tour,
      },
    },
  },
  environmentConfiguration: {
    groundPlane: false,
  },
} satisfies MMLWorldConfig & Partial<World>;
