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
        z={-depth / 2}
        color={color}
      ></m-cube>
    </m-group>
  );
});
Start.displayName = "Start";

type EndProps = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: string;
};
const End = memo(({ x, y, z, width, height, depth, color }: EndProps) => {
  return (
    <m-group x={x} y={y} z={z}>
      <m-cube
        width={width}
        height={height}
        depth={depth}
        x={0}
        y={-height / 2}
        z={depth / 2}
        color={color}
      ></m-cube>
    </m-group>
  );
});
End.displayName = "End";

type RailsProps = {
  x?: number;
  y?: number;
  z?: number;
  steps: number;
  stepSizeX: number;
  stepSizeZ: number;
  stepGapX: number;
  stepGapZ: number;
  length: number;
  thickness: number;
  color?: string;
};
const Rails = memo(({ x, y, z, stepSizeX, stepGapX, length, thickness, color }: RailsProps) => {
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
});
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
          const zPos = stepSizeZ + i * stepSizeZ + i * stepGapZ;
          return (
            <m-group key={i}>
              <m-cube
                x={i % 2 === 0 ? -stepGapX / 2 : stepGapX / 2}
                y={y ? y - thickness / 2 : -thickness / 2}
                z={z ? z + zPos : zPos}
                width={stepSizeX}
                height={thickness}
                depth={stepSizeZ}
                color={"#000000"}
                opacity={0.9}
              ></m-cube>
              <m-cube
                x={i % 2 !== 0 ? -stepGapX / 2 : stepGapX / 2}
                y={y ? y - thickness / 2 : -thickness / 2}
                z={z ? z + zPos : zPos}
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
  const baseDepth = 20;

  const railsLength = bridgeSteps * stepSizeZ + (bridgeSteps - 1) * stepGapZ + stepSizeZ;
  return (
    <m-group x={x} y={y} z={z} ry={ry} visible-to={visibleTo}>
      <Start
        x={0}
        y={0}
        z={-0.05}
        width={baseDepth}
        height={0.1}
        depth={baseDepth}
        color={baseColor}
      />
      <Rails
        x={0}
        z={0}
        steps={bridgeSteps}
        stepSizeX={stepSizeX}
        stepSizeZ={stepSizeZ}
        stepGapX={stepGapX}
        stepGapZ={stepGapZ}
        length={railsLength}
        thickness={stepThickness}
      />
      <Steps
        totalSteps={bridgeSteps}
        z={0}
        stepSizeX={stepSizeX}
        stepSizeZ={stepSizeZ}
        stepGapX={stepGapX}
        stepGapZ={stepGapZ}
        thickness={stepThickness}
      />
      <End
        x={0}
        y={0}
        z={railsLength}
        width={baseDepth}
        height={0.1}
        depth={baseDepth}
        color={baseColor}
      />
    </m-group>
  );
});
GlassBridgeGame.displayName = "GlassBridgeGame";
