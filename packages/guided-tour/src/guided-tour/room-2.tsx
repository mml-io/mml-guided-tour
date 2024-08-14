import * as React from "react";

import { RaceCars } from "./react-examples/race-cars";
import { RotatingCarPlinth } from "./react-examples/rotating-car-plinth";

export function Room2({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <m-group x={x} y={y} z={z}>
      <RotatingCarPlinth x={11} y={0} z={0} />
      <RaceCars x={-12.5} y={0} z={-2} ry={-90} />
    </m-group>
  );
}
