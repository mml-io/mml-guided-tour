import * as React from "react";
import { memo } from "react";

type StartProps = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: string;
};
const Start = memo(({ x, y, z, width, height, depth, color }: StartProps) => {
  return (
    <m-group x={x} y={y} z={z}>
      <m-cube
        width={width}
        height={height}
        depth={depth}
        x={0}
        y={-height / 2}
        z={0}
        color={color}
      ></m-cube>
    </m-group>
  );
});
Start.displayName = "Start";

type RailsProps = {
  x: number;
  z: number;
  steps: number;
  stepSizeX: number;
  stepSizeZ: number;
  stepGapZ: number;
};
const Rails = memo(({ x, z, steps, stepSizeX, stepSizeZ, stepGapZ }: RailsProps) => {
  const length = steps * stepSizeZ + (steps - 1) * stepGapZ + stepSizeZ;
  const zPos = z + length / 2;
  return (
    <m-group x={x} z={z}>
      {Array.from({ length: 4 }).map((_, i) => {
        const xPos = (i * stepSizeX) / 2;
        return <m-cube key={i} x={xPos} z={zPos} width={0.1} height={0.1} depth={length} />;
      })}
      ;
    </m-group>
  );
});
Rails.displayName = "Rails";

type GlassBridgeGameProps = {
  x?: number;
  y?: number;
  z?: number;
  ry?: number;
  visibleTo?: string;
};
export const GlassBridgeGame = memo(({ x, y, z, ry, visibleTo }: GlassBridgeGameProps) => {
  const bridgeSteps = 7;
  const stepSizeZ = 4.2;
  const stepSizeX = 3;
  const stepGapZ = 3.5;
  const baseColor = "#aaaaaa";
  return (
    <m-group x={x} y={y} z={z} ry={ry} visible-to={visibleTo}>
      <Start x={0} y={0} z={0} width={20} height={0.1} depth={20} color={baseColor} />
      <Rails
        x={0}
        z={0}
        steps={bridgeSteps}
        stepSizeX={stepSizeX}
        stepSizeZ={stepSizeZ}
        stepGapZ={stepGapZ}
      />
    </m-group>
  );
});
GlassBridgeGame.displayName = "GlassBridgeGame";
