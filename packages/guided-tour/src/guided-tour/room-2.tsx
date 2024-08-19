import * as React from "react";

import { RaceCars } from "./react-examples/race-cars";
import { RotatingCarPlinth } from "./react-examples/rotating-car-plinth";

export function Room2() {
  return (
    <m-group>
      <RotatingCarPlinth x={11} />
      <RaceCars x={-12.5} z={-4} ry={-90} />
    </m-group>
  );
}
