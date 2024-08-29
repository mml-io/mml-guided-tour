import { MGroupElement, MPositionProbeElement } from "@mml-io/mml-react-types";
import * as React from "react";
import { useRef } from "react";

import { Teleporter } from "./components/teleporter";
import { useVisibilityProbe } from "./helpers/use-visibility-probe";

export function Room5() {
  const probeRef = useRef<MPositionProbeElement | null>(null);
  const groupRef = useRef<MGroupElement | null>(null);

  useVisibilityProbe(probeRef, groupRef, 32, 500);

  return (
    <m-group>
      <m-position-probe ref={probeRef} />
      <m-group ref={groupRef}>
        <Teleporter
          startX={-10}
          startY={0}
          startZ={-10}
          startRY={180}
          endX={10}
          endY={0}
          endZ={10}
          endRY={0}
        />
      </m-group>
    </m-group>
  );
}
