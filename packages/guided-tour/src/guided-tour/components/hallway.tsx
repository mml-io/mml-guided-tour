import * as React from "react";

import { Door } from "./door";

type HallwayProps = {
  x: number;
  y: number;
  z: number;
};

export function Hallway({ x, y, z }: HallwayProps) {
  const doorWidth = 5;
  const doorHeight = 6;
  const doorDepth = 0.1;
  const doorColor = "#707070";

  const doorAnimDuration = 1050;

  return (
    <m-group>
      <m-model src={"/assets/guidedtour/hallway.glb"} x={x} y={y} z={z}></m-model>
      <Door
        x={-12.5}
        y={y}
        z={z - 4.13}
        width={doorWidth}
        height={doorHeight}
        depth={doorDepth}
        wallThickness={0.65}
        color={doorColor}
        animDuration={doorAnimDuration}
      />
      <Door
        x={12.5}
        y={y}
        z={z + 3.85}
        width={doorWidth}
        height={doorHeight}
        depth={doorDepth}
        wallThickness={0.99}
        invertButton={true}
        color={doorColor}
        animDuration={doorAnimDuration}
      />
    </m-group>
  );
}
