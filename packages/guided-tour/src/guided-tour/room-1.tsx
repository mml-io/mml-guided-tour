import * as React from "react";

import { firstInteraction, gliders } from "../examples";

export function Room1({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <m-group x={x} y={y} z={z}>
      <m-frame src={firstInteraction}></m-frame>
      <m-frame src={gliders} x={-17.65} y={2.05} sy={2.63} sz={3.14}></m-frame>
    </m-group>
  );
}
