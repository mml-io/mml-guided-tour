import * as React from "react";
import { memo } from "react";

import { firstInteraction, gliders } from "../examples";
import { PositionProbeLoaded } from "../helpers/use-visibility-probe";

const teleporterBaseURL = "/assets/guidedtour/teleporter_base_plinth.glb";
const botMeshURL = "/assets/guidedtour/bot_mesh.glb";
const botAnimURL = "/assets/guidedtour/bot_anim_idle.glb";

type FloatingAvatarsProps = {
  x: number;
  y: number;
  z: number;
  ry: number;
};
const FloatingAvatars = memo(({ x, y, z, ry }: FloatingAvatarsProps) => {
  const now = document.timeline.currentTime as number;
  return (
    <m-group x={x} y={y} z={z} ry={ry}>
      <m-model src={teleporterBaseURL} sx={0.6} sy={0.6} sz={0.6} z={0}></m-model>
      <m-model
        src={botMeshURL}
        y={0.6}
        z={0}
        ry={-90}
        anim={botAnimURL}
        anim-start-time={now - 1000}
        collide={false}
      >
        <m-attr-anim
          attr="y"
          start={0.6}
          end={0.7}
          duration={12000}
          ping-pong={true}
          ping-pong-delay={1200}
          anim-start-time={now - 1000}
          easing="easeInOutQuad"
        ></m-attr-anim>
      </m-model>
      <m-model src={teleporterBaseURL} sx={0.6} sy={0.6} sz={0.6} z={3}></m-model>
      <m-model
        src={botMeshURL}
        y={0.6}
        z={3}
        ry={-90}
        anim={botAnimURL}
        anim-start-time={now - 3000}
        collide={false}
      >
        <m-attr-anim
          attr="y"
          start={0.6}
          end={0.7}
          duration={12000}
          ping-pong={true}
          ping-pong-delay={1200}
          anim-start-time={now - 3000}
          easing="easeInOutQuad"
        ></m-attr-anim>
      </m-model>
    </m-group>
  );
});
FloatingAvatars.displayName = "FloatingAvatars";

export function Room1() {
  return (
    <PositionProbeLoaded range={32} interval={500}>
      <m-frame src={firstInteraction}></m-frame>
      <m-frame src={gliders} x={-17.65} y={2.05} sy={2.63} sz={3.14}></m-frame>
      <FloatingAvatars x={14} y={0} z={0} ry={0}></FloatingAvatars>
    </PositionProbeLoaded>
  );
}
