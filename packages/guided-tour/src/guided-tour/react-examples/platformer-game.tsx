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
const platformerSpinnerURL = "/assets/guidedtour/platformer_spinner.glb";
const hammersBaseURL = "/assets/guidedtour/platformer_hammers_base.glb";
const hammersEdgeURL = "/assets/guidedtour/platformer_hammers_edge.glb";
const hammerURL = "/assets/guidedtour/platformer_hammer.glb";

type StartProps = {
  x: number;
  y: number;
  z: number;
};
const Start = memo(({ x, y, z }: StartProps) => {
  return (
    <m-group x={x} y={y} z={z}>
      <m-model src={platformerStartURL}></m-model>
    </m-group>
  );
});
Start.displayName = "Start";

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

export const PlatformerGame = memo(({ x, y, z, ry, visibleTo }: PlatformerGameProps) => {
  const yPos = 0;
  const active = true;
  return (
    <m-group x={x} y={y} z={z} ry={ry} visible-to={visibleTo}>
      <Start x={0} y={yPos} z={0} />
      <Spinners x={7.35} y={yPos} z={39.55} width={23} depth={35} active={active} />
      <Hammers x={0} y={yPos} z={75.6} ry={0} difficulty={1} active={active} />
    </m-group>
  );
});
PlatformerGame.displayName = "PlatformerGame";
