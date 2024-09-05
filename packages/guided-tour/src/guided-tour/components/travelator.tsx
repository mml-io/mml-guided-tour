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
  }: TravelatorProps) => {
    const height = 0.2;
    const startEndOverlap = (depth / steps) * 0.25;
    return (
      <m-group x={x} y={y} z={z + depth / 2} ry={ry}>
        <m-cube
          width={width + 0.03}
          height={height}
          depth={depth / steps + startEndOverlap}
          y={-height + 0.03}
          z={-depth / 2 + startEndOverlap / 2 - 0.5}
        ></m-cube>
        <m-cube
          width={width + 0.03}
          height={height}
          depth={depth / steps + startEndOverlap}
          y={-height + 0.03}
          z={depth / 2 - startEndOverlap / 2 + 0.5}
        ></m-cube>
        {Array.from({ length: steps - 1 }).map((_, i) => {
          return (
            <m-cube
              key={i}
              width={width}
              height={height}
              depth={depth / (steps - 1)}
              y={-height}
              color={`hsl(${(360 / (steps - 1)) * i}, ${saturation ? `${saturation}%` : "80%"}, ${lightness ? `${lightness}%` : "50%"})`}
            >
              <m-attr-anim
                attr="z"
                start={reverse ? -depth / 2 : depth / 2}
                end={reverse ? depth / 2 : -depth / 2}
                duration={travelTime}
                start-time={
                  (document.timeline.currentTime as number) - (travelTime * 1000 * i) / (steps - 1)
                }
              ></m-attr-anim>
            </m-cube>
          );
        })}
      </m-group>
    );
  },
);
Travelator.displayName = "Travelator";
