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
  x?: number;
  y?: number;
  z?: number;
  steps: number;
  stepSizeX: number;
  stepSizeZ: number;
  stepGapX: number;
  stepGapZ: number;
  thickness: number;
  color?: string;
};
const Rails = memo(
  ({ x, y, z, steps, stepSizeX, stepSizeZ, stepGapX, stepGapZ, thickness, color }: RailsProps) => {
    const length = steps * stepSizeZ + (steps - 1) * stepGapZ + stepSizeZ;
    const zPos = z ? z + length / 2 : length / 2;
    return (
      <m-group x={x} z={z}>
        {Array.from({ length: 4 }).map((_, i) => {
          const xPos = i % 2 === 0 ? -stepGapX / 2 : stepGapX / 2;
          return (
            <m-group key={i}>
              <m-cube
                x={xPos - stepSizeX / 2 - thickness / 2}
                y={y ? y - thickness / 2 : -thickness / 2}
                z={zPos}
                width={thickness}
                height={thickness}
                depth={length}
                color={color ? color : "#aaaaaa"}
                collide={false}
              />
              <m-cube
                x={xPos + stepSizeX / 2 + thickness / 2}
                y={y ? y - thickness / 2 : -thickness / 2}
                z={zPos}
                width={thickness}
                height={thickness}
                depth={length}
                color={color ? color : "#aaaaaa"}
                collide={false}
              />
            </m-group>
          );
        })}
        ;
      </m-group>
    );
  },
);
Rails.displayName = "Rails";

type StepsProps = {
  y?: number;
  z?: number;
  totalSteps: number;
  stepSizeX: number;
  stepSizeZ: number;
  stepGapX: number;
  stepGapZ: number;
  thickness: number;
};
const Steps = memo(
  ({ y, z, totalSteps, stepSizeX, stepSizeZ, stepGapX, stepGapZ, thickness }: StepsProps) => {
    return (
      <m-group>
        {Array.from({ length: totalSteps }).map((_, i) => {
          return (
            <m-group key={i}>
              <m-cube
                x={i % 2 === 0 ? -stepGapX / 2 : stepGapX / 2}
                y={y ? y - thickness / 2 : -thickness / 2}
                z={z ? z + (i * stepSizeZ + i * stepGapZ) : i * stepSizeZ + i * stepGapZ}
                width={stepSizeX}
                height={thickness}
                depth={stepSizeZ}
                color={"#000000"}
                opacity={0.9}
              ></m-cube>
              <m-cube
                x={i % 2 !== 0 ? -stepGapX / 2 : stepGapX / 2}
                y={y ? y - thickness / 2 : -thickness / 2}
                z={z ? z + (i * stepSizeZ + i * stepGapZ) : i * stepSizeZ + i * stepGapZ}
                width={stepSizeX}
                height={thickness}
                depth={stepSizeZ}
                color={"#000000"}
                opacity={0.9}
              ></m-cube>
            </m-group>
          );
        })}
      </m-group>
    );
  },
);
Steps.displayName = "Steps";

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
  const stepGapX = 7;
  const stepGapZ = 6;
  const stepThickness = 0.1;
  const baseColor = "#aaaaaa";
  return (
    <m-group x={x} y={y} z={z} ry={ry} visible-to={visibleTo}>
      <Start x={0} y={0} z={0} width={20} height={0.1} depth={20} color={baseColor} />
      <Rails
        x={0}
        z={5}
        steps={bridgeSteps}
        stepSizeX={stepSizeX}
        stepSizeZ={stepSizeZ}
        stepGapX={stepGapX}
        stepGapZ={stepGapZ}
        thickness={stepThickness}
      />
      <Steps
        totalSteps={bridgeSteps}
        z={15}
        stepSizeX={stepSizeX}
        stepSizeZ={stepSizeZ}
        stepGapX={stepGapX}
        stepGapZ={stepGapZ}
        thickness={stepThickness}
      />
    </m-group>
  );
});
GlassBridgeGame.displayName = "GlassBridgeGame";
