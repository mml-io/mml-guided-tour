import { Networked3dWebExperienceClient } from "@mml-io/3d-web-experience-client";

import hdrJpgUrl from "../../assets/hdr/puresky_2k.jpg";
import airAnimationFileUrl from "../../assets/models/anim_air.glb";
import doubleJumpAnimationFileUrl from "../../assets/models/anim_double_jump.glb";
import idleAnimationFileUrl from "../../assets/models/anim_idle.glb";
import jogAnimationFileUrl from "../../assets/models/anim_jog.glb";
import sprintAnimationFileUrl from "../../assets/models/anim_run.glb";
import botModelFileUrl from "../../assets/models/bot.glb";
import cartoonBoyModelFileUrl from "../../assets/models/cartoon_boy.glb";
import hatModelFileUrl from "../../assets/models/hat.glb";
import ninjaModelFileUrl from "../../assets/models/ninja.glb";
import botThumbnailFileUrl from "../../assets/models/thumbs/bot.jpg";
import cartoonBoyThumbnailFileUrl from "../../assets/models/thumbs/cartoon_boy.jpg";
import hatBotThumbnailFileUrl from "../../assets/models/thumbs/hat_bot.jpg";
import ninjaThumbnailFileUrl from "../../assets/models/thumbs/ninja.jpg";

const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const host = window.location.host;
const userNetworkAddress = `${protocol}//${host}/network`;
const chatNetworkAddress = `${protocol}//${host}/chat-network`;

const worldConfig = (window as any).WORLD_CONFIG;

const holder = Networked3dWebExperienceClient.createFullscreenHolder();
const app = new Networked3dWebExperienceClient(holder, {
  sessionToken: (window as any).SESSION_TOKEN,
  userNetworkAddress,
  chatNetworkAddress,
  animationConfig: {
    airAnimationFileUrl,
    idleAnimationFileUrl,
    jogAnimationFileUrl,
    sprintAnimationFileUrl,
    doubleJumpAnimationFileUrl,
  },
  mmlDocuments: worldConfig.mmlDocumentsConfiguration.mmlDocuments,
  onServerBroadcast: (broadcast: { broadcastType: string; payload: any; }) => {
    console.log("Server broadcast received", broadcast);
    if (broadcast.broadcastType === "worldConfig") {
      const { mmlDocuments } = JSON.parse(broadcast.payload);
      console.log("Updating MML documents", mmlDocuments);
      app.updateConfig({
        mmlDocuments,
      });
    }
  },
  environmentConfiguration: {
    groundPlane: false,
    skybox: {
      hdrJpgUrl,
      azimuthalAngle: 97,
      intensity: 1,
    },
    sun: {
      intensity: 5.5,
      azimuthalAngle: 325 * (Math.PI / 180),
      polarAngle: 60 * (Math.PI / 180),
    },
    envMap: {
      intensity: 0.21,
    },
  },
  avatarConfiguration: {
    availableAvatars: [
      {
        name: "Bot",
        meshFileUrl: botModelFileUrl,
        thumbnailUrl: botThumbnailFileUrl,
      },
      {
        name: "Hat Bot",
        mmlCharacterString: `
            <m-character src="${botModelFileUrl}">
              <m-model rz="-90" sx="1.01" sy="1.01" sz="1.01" x="0.025" z="-0.01" socket="head" src="${hatModelFileUrl}"></m-model>
            </m-character>
          `,
        thumbnailUrl: hatBotThumbnailFileUrl,
      },
      {
        name: "Ninja",
        meshFileUrl: ninjaModelFileUrl,
        thumbnailUrl: ninjaThumbnailFileUrl,
      },
      {
        name: "Toon Boy",
        meshFileUrl: cartoonBoyModelFileUrl,
        thumbnailUrl: cartoonBoyThumbnailFileUrl,
      },
    ],
  },
});
app.update();
