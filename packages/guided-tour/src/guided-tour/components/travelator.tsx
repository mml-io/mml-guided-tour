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
};
export const Travelator = memo(
  ({ x, y, z, ry, width, depth, steps, travelTime, reverse }: TravelatorProps) => {
    const height = 0.1;
    const startEndOverlap = depth / steps / 10;
    return (
      <m-group x={x} y={y} z={z + depth / 2} ry={ry}>
        <m-cube
          width={width}
          height={height}
          depth={depth / steps + startEndOverlap}
          y={-height / 2}
          z={-depth / 2 + startEndOverlap / 2}
        ></m-cube>
        <m-cube
          width={width}
          height={height}
          depth={depth / steps + startEndOverlap}
          y={-height / 2}
          z={depth / 2 - startEndOverlap / 2}
        ></m-cube>
        {Array.from({ length: steps }).map((_, i) => {
          return (
            <m-cube
              key={i}
              width={width}
              height={height}
              depth={depth / (steps - 1)}
              y={-height}
              color={`hsl(${(360 / steps) * i}, 80%, 50%)`}
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
