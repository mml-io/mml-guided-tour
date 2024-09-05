import * as React from "react";
import { memo } from "react";

type TravelatorProps = {
  x: number;
  y: number;
  z: number;
  ry: number;
  width: number;
  depth: number;
  steps: number;
  travelTime: number;
  reverse?: boolean;
  saturation?: number;
  lightness?: number;
  baseColor?: string;
};
export const Travelator = memo(
  ({
    x,
    y,
    z,
    ry,
    width,
    depth,
    steps,
    travelTime,
    reverse,
    saturation,
    lightness,
    baseColor,
  }: TravelatorProps) => {
    const height = 0.2;
    const stepDepth = depth / steps;
    const startEndOverlap = stepDepth * 0.1;
    return (
      <m-group x={x} y={y} z={z + depth / 2} ry={ry}>
        <m-cube
          width={width + 0.03}
          height={height}
          depth={stepDepth + startEndOverlap}
          y={-height + 0.004}
          z={-depth / 2 + startEndOverlap / 2}
          color={baseColor ? baseColor : "#aaaaaa"}
        ></m-cube>
        <m-cube
          width={width + 0.03}
          height={height}
          depth={stepDepth + startEndOverlap}
          y={-height + 0.004}
          z={depth / 2 - startEndOverlap / 2}
          color={baseColor ? baseColor : "#aaaaaa"}
        ></m-cube>
        {Array.from({ length: steps }).map((_, i) => {
          return (
            <m-cube
              key={i}
              width={width}
              height={height}
              depth={stepDepth}
              y={-height}
              color={`hsl(${(360 / steps) * i}, ${saturation ? `${saturation}%` : "80%"}, ${lightness ? `${lightness}%` : "50%"})`}
            >
              <m-attr-anim
                attr="z"
                start={reverse ? -depth / 2 : depth / 2}
                end={reverse ? depth / 2 : -depth / 2}
                duration={travelTime}
                start-time={(document.timeline.currentTime as number) - (travelTime * i) / steps}
              ></m-attr-anim>
            </m-cube>
          );
        })}
      </m-group>
    );
  },
);
Travelator.displayName = "Travelator";
