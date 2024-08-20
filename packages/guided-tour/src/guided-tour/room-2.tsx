import * as React from "react";

import { MemoryGame } from "./react-examples/memory-game";
import { RaceCars } from "./react-examples/race-cars";
import { RotatingCarPlinth } from "./react-examples/rotating-car-plinth";

export function Room2() {
  return (
    <m-group>
      <RotatingCarPlinth x={11} />
      <RaceCars x={-12.5} z={-4} ry={-90} />
      <m-group x={5.5} y={1.79} z={21.7} ry={180} sx={1.25} sy={1.25} sz={1.25}>
        <MemoryGame />
      </m-group>
    </m-group>
  );
}
