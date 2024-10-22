import { Networked3dWebExperienceClient } from "@mml-io/3d-web-experience-client";
import { MMLWorldConfig } from "@mml-io/esbuild-plugin-mml";

const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const host = window.location.host;
const userNetworkAddress = `${protocol}//${host}/network`;
const chatNetworkAddress = `${protocol}//${host}/chat-network`;

fetch("/web-client/world.json")
  .then((response) => response.json())
  .then((worldConfig: MMLWorldConfig) => {
    const holder = Networked3dWebExperienceClient.createFullscreenHolder();
    const app = new Networked3dWebExperienceClient(holder, {
      sessionToken: (window as any).SESSION_TOKEN,
      userNetworkAddress,
      chatNetworkAddress,
      animationConfig: {
        airAnimationFileUrl: "./assets/models/anim_air.glb",
        idleAnimationFileUrl: "./assets/models/anim_idle.glb",
        jogAnimationFileUrl: "./assets/models/anim_jog.glb",
        sprintAnimationFileUrl: "./assets/models/anim_run.glb",
        doubleJumpAnimationFileUrl: "./assets/models/anim_double_jump.glb",
      },
      mmlDocuments: worldConfig.mmlDocuments,
      environmentConfiguration: {
        groundPlane: false,
        skybox: {
          hdrJpgUrl: "./assets/hdr/sunset_2k.jpg",
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
            meshFileUrl: "/assets/models/bot.glb",
            thumbnailUrl: "/assets/models/thumbs/bot.jpg",
          },
          {
            name: "Hat Bot",
            mmlCharacterString: `
            <m-character src="/assets/models/bot.glb">
              <m-model rz="-90" sx="1.01" sy="1.01" sz="1.01" x="0.025" z="-0.01" socket="head" src="/assets/models/hat.glb"></m-model>
            </m-character>
          `,
            thumbnailUrl: "/assets/models/thumbs/hat_bot.jpg",
          },
          {
            name: "Ninja",
            meshFileUrl: "/assets/models/ninja.glb",
            thumbnailUrl: "/assets/models/thumbs/ninja.jpg",
          },
          {
            name: "Toon Boy",
            meshFileUrl: "/assets/models/cartoon_boy.glb",
            thumbnailUrl: "/assets/models/thumbs/cartoon_boy.jpg",
          },
        ],
      },
    });
    app.update();
  });
