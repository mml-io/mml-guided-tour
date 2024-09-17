import { MGroupElement, MPositionProbeElement } from "@mml-io/mml-react-types";
import * as React from "react";
import { useRef } from "react";

import { useVisibilityProbe } from "../helpers/use-visibility-probe";
import { MemoryGame } from "../react-examples/memory-game";
import { RaceCars } from "../react-examples/race-cars";
import { RotatingCarPlinth } from "../react-examples/rotating-car-plinth";

export function Room2() {
  const probeRef = useRef<MPositionProbeElement | null>(null);
  const groupRef = useRef<MGroupElement | null>(null);

  useVisibilityProbe(probeRef, groupRef, 32, 500);

  return (
    <m-group>
      <m-position-probe ref={probeRef} />
      <m-group ref={groupRef}>
        <RotatingCarPlinth x={11} />
        <RaceCars x={-12.5} z={-4} ry={-90} />
        <m-group x={5.5} z={21.7} ry={180}>
          <MemoryGame />
        </m-group>
      </m-group>
    </m-group>
  );
}
