import * as React from "react";

import botAnimURL from "../../assets/models/bot_anim_idle.glb";
import botMeshURL from "../../assets/models/bot_mesh.glb";
import teleporterBaseURL from "../../assets/models/teleporter_base_plinth.glb";
import ConwayCubes from "../../react-examples/conway";
import FirstInteraction from "../../react-examples/first-interaction";

type FloatingAvatarsProps = {
  x: number;
  y: number;
  z: number;
  ry: number;
};
const FloatingAvatars = React.memo(({ x, y, z, ry }: FloatingAvatarsProps) => {
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

export function Contents() {
  return (
    <>
      <FirstInteraction></FirstInteraction>
      <ConwayCubes x={-17.8} y={2.05} z={-0.05} sy={2.63} sz={3.14}></ConwayCubes>
      <FloatingAvatars x={14} y={0} z={0} ry={0}></FloatingAvatars>
    </>
  );
}
