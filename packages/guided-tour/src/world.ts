import type { MMLWorldConfig } from "@mml-io/esbuild-plugin-mml";
/*eslint import/no-unresolved: [2, { ignore: ['^mml:'] }]*/
import tour from "mml:./guided-tour";

import botModel from "./assets/models/bot.glb";
import botThumbnail from "./assets/models/thumbs/bot.jpg";

export default {
  mmlDocuments: {
    tour: {
      url: tour,
    },
  },
  avatars: [
    {
      name: "Bot",
      meshFileUrl: botModel,
      thumbnailUrl: botThumbnail,
    },
  ],
} satisfies MMLWorldConfig;
