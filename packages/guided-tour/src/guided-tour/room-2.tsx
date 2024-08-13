// eslint-disable-next-line import/default
import React from "react";

import { RotatingCarPlinth } from "./react-examples/rotating-car-plinth";

export function Room2({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <m-group x={x} y={y} z={z}>
      <RotatingCarPlinth x={11} y={0} z={0} />
    </m-group>
  );
}
