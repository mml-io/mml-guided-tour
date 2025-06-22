import type { MMLWorldConfig } from "@mml-io/esbuild-plugin-mml";
import type { World } from "@mml-guided-tour/uploader/src/types";
import tour from "mml:./guided-tour";

export default {
  name: "guided-tour",
  mmlDocumentsConfiguration: {
    mmlDocuments: {
      tour: {
        url: tour,
      },
    },
  },
  environmentConfiguration: {
    groundPlane: false,
  }

} satisfies MMLWorldConfig & World;
