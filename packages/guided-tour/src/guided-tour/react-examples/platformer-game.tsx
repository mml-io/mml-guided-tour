import * as React from "react";
import { memo } from "react";

type PlatformerGameProps = {
  x?: number;
  y?: number;
  z?: number;
  ry?: number;
  visibleTo?: string | number;
};

const platformerStartURL = "/assets/guidedtour/platformer_start.glb";
const platformerEndURL = "/assets/guidedtour/platformer_end.glb";
const platformerSpinnerURL = "/assets/guidedtour/platformer_spinner.glb";
const hammersBaseURL = "/assets/guidedtour/platformer_hammers_base.glb";
const hammersEdgeURL = "/assets/guidedtour/platformer_hammers_edge.glb";
const hammerURL = "/assets/guidedtour/platformer_hammer.glb";
const hexagonURL = "/assets/guidedtour/platformer_hexagon.glb";
const axesBaseURL = "/assets/guidedtour/platformer_axe_base.glb";
const axesRodURL = "/assets/guidedtour/platformer_axe_rod.glb";
const axesBladeURL = "/assets/guidedtour/platformer_axe_blade.glb";

type StartProps = {
  x: number;
  y: number;
  z: number;
  ry?: number;
};
const Start = memo(({ x, y, z, ry }: StartProps) => {
  return (
    <m-group x={x} y={y} z={z} ry={ry}>
      <m-model src={platformerStartURL}></m-model>
    </m-group>
  );
});
Start.displayName = "Start";

type EndProps = {
  x: number;
  y: number;
  z: number;
  ry?: number;
};
const End = memo(({ x, y, z, ry }: EndProps) => {
  return (
    <m-group x={x} y={y} z={z} ry={ry}>
      <m-model src={platformerEndURL}></m-model>
    </m-group>
  );
});
End.displayName = "End";

type SpinnersProps = {
  x: number;
  y: number;
  z: number;
  width: number;
  depth: number;
  active: boolean;
};
const Spinners = memo(({ x, y, z, width, depth, active }: SpinnersProps) => {
  const spinnerRadius = 3.4999;
  const spinnerDiameter = spinnerRadius * 2;
  const hexHeight = (spinnerDiameter * Math.sqrt(3)) / 2;
  const numSpinnersX = Math.floor(width / spinnerDiameter);
  const numSpinnersZ = Math.floor(depth / hexHeight);

  return (
    <m-group ry={180}>
      {Array.from({ length: numSpinnersX }).map((_, j) => {
        return Array.from({ length: numSpinnersZ }).map((_, i) => {
          const spinnerRadius = 3.4999;
          const spinnerDiameter = spinnerRadius * 2;
          const hexHeight = (spinnerDiameter * Math.sqrt(3)) / 2;
          const numSpinnersX = Math.floor(width / spinnerDiameter);
          const numSpinnersZ = Math.floor(depth / hexHeight);

          const totalWidth = numSpinnersX * spinnerDiameter + spinnerRadius;
          const totalDepth = numSpinnersZ * hexHeight;
          const halfTotalWidth = totalWidth / 2;
          const halfRadius = spinnerRadius / 2;

          const ccw = (i + j) % 2 === 0;
          const xOffset = (j % 2) * spinnerRadius;
          const xPos = j * hexHeight - totalDepth / 2 + halfRadius;
          const zPos = i * spinnerDiameter + xOffset - halfTotalWidth + halfRadius;
          return (
            <m-group
              key={`${j}-${i}`}
              x={xPos + x}
              y={y}
              z={zPos - z}
              rx={ccw ? 180 : 0}
              rz={ccw ? 180 : 0}
            >
              <m-model src={platformerSpinnerURL}>
                {active && (
                  <m-attr-anim
                    attr="ry"
                    start={ccw ? 0 : 360}
                    end={ccw ? 360 : 0}
                    start-time={document.timeline.currentTime as number}
                    duration={2900}
                    loop={true}
                  ></m-attr-anim>
                )}
              </m-model>
            </m-group>
          );
        });
      })}
    </m-group>
  );
});
Spinners.displayName = "Spinners";

type HammersProps = {
  x: number;
  y: number;
  z: number;
  ry: number;
  difficulty: 1 | 2;
  active: boolean;
};
const Hammers = memo(({ x, y, z, ry, difficulty, active }: HammersProps) => {
  const xOffset = 6;
  const zOffset = 18;
  const baseSpeed = 2100;
  return (
    <m-group x={x} y={y} z={z} ry={ry}>
      {Array.from({ length: 2 }).map((_, i) => {
        return (
          <m-model key={i} src={hammersBaseURL} x={i === 0 ? -xOffset : xOffset} y={-3.5}>
            {Array.from({ length: 2 }).map((_, j) => {
              return (
                <m-model
                  key={j}
                  src={hammersEdgeURL}
                  y={0.01}
                  z={j === 0 ? -zOffset : zOffset}
                ></m-model>
              );
            })}
            {Array.from({ length: difficulty < 2 ? 7 : 14 }).map((_, k) => {
              const z = k * 3.75 * (difficulty < 2 ? 1 : 0.5) - 11.1;
              const coinFlip = Math.random() < 0.5;
              const speedOffsetMult = Math.random() * 300 * (coinFlip ? -1 : 1);
              const duration = baseSpeed + speedOffsetMult;
              return (
                <m-model key={k} src={hammerURL} z={z} sz={1.5}>
                  {active && (
                    <m-attr-anim
                      attr="rz"
                      start={coinFlip ? 0 : 360}
                      end={coinFlip ? 360 : 0}
                      start-time={(document.timeline.currentTime as number) - k * 300}
                      duration={duration}
                      loop={true}
                    ></m-attr-anim>
                  )}
                </m-model>
              );
            })}
          </m-model>
        );
      })}
    </m-group>
  );
});
Hammers.displayName = "Hammer";

type SineHexPlatformsProps = {
  x: number;
  y: number;
  z: number;
  ry: number;
  difficulty: 1 | 2;
  active: boolean;
};
const SineHexPlatforms = memo(({ x, y, z, ry, difficulty, active }: SineHexPlatformsProps) => {
  const platforms = 10;
  const hexOffset = 12;
  const duration = difficulty < 2 ? 12000 : 8000;
  const yAnimDuration = duration * (2 / 3);
  return (
    <m-group x={x} y={y} z={z} ry={ry}>
      {Array.from({ length: platforms }).map((_, i) => {
        return (
          <m-model key={i} src={hexagonURL} z={i * hexOffset}>
            {active && i < platforms - 1 && (
              <>
                <m-attr-anim
                  attr="x"
                  start={-6}
                  end={6}
                  duration={duration}
                  loop={true}
                  ping-pong={true}
                  easing="easeInOutSine"
                  start-time={(document.timeline.currentTime as number) - i * 1000}
                ></m-attr-anim>
                <m-attr-anim
                  attr="y"
                  start={0}
                  end={-0.5}
                  duration={yAnimDuration}
                  start-time={(document.timeline.currentTime as number) - i * 1000}
                  ping-pong={true}
                  easing={"easeInOutSine"}
                ></m-attr-anim>
              </>
            )}
          </m-model>
        );
      })}
    </m-group>
  );
});
SineHexPlatforms.displayName = "SineHexPlatforms";

type AxesPlatformProps = {
  x: number;
  y: number;
  z: number;
  ry: number;
  difficulty: 1 | 2;
  active: boolean;
};
const AxesPlatform = memo(({ x, y, z, ry, difficulty, active }: AxesPlatformProps) => {
  const totalAxes = 8;
  const axesSwingTime = difficulty < 2 ? 5000 : 3500;
  const zOffset = -17;
  let space = 4.4;
  return (
    <m-group x={x} y={y} z={z} ry={ry}>
      <m-model src={axesBaseURL}></m-model>
      {Array.from({ length: totalAxes }).map((_, i) => {
        if (i === 3) {
          space += 0.5;
        }
        return (
          <m-group key={i} z={i * space + zOffset} y={20}>
            {active && (
              <m-attr-anim
                attr="rz"
                start={-45}
                end={45}
                duration={axesSwingTime}
                loop={true}
                ping-pong={true}
                ping-pong-delay={difficulty < 2 ? axesSwingTime * 0.035 : 0}
                start-time={
                  (document.timeline.currentTime as number) - i * (difficulty < 2 ? 200 : 350)
                }
                easing={difficulty < 2 ? "easeInOutQuad" : "easeInOutSine"}
              ></m-attr-anim>
            )}
            <m-model src={axesRodURL} x={0}>
              <m-model src={axesBladeURL} y={0} sz={1.5}></m-model>
            </m-model>
          </m-group>
        );
      })}
    </m-group>
  );
});
AxesPlatform.displayName = "AxesPlatform";

export const PlatformerGame = memo(({ x, y, z, ry, visibleTo }: PlatformerGameProps) => {
  const yPos = 0;
  const active = false;
  const difficulty = 1;
  return (
    <m-group x={x} y={y} z={z} ry={ry} visible-to={visibleTo}>
      <Start x={0} y={yPos} z={0} />
      <Spinners x={7.35} y={yPos} z={39.55} width={23} depth={35} active={active} />
      <Hammers x={0} y={yPos} z={75.6} ry={0} difficulty={difficulty} active={active} />
      <SineHexPlatforms x={0} y={yPos} z={100.15} ry={0} difficulty={difficulty} active={active} />
      <AxesPlatform x={0} y={yPos} z={233.2} ry={0} difficulty={difficulty} active={active} />
      <End x={0} y={yPos} z={270.9} ry={180} />
    </m-group>
  );
});
PlatformerGame.displayName = "PlatformerGame";
