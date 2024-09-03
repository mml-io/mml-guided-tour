import { MGroupElement, MPositionProbeElement } from "@mml-io/mml-react-types";
import * as React from "react";
import { useRef } from "react";

import { Teleporter } from "./components/teleporter";
import { useVisibilityProbe } from "./helpers/use-visibility-probe";
import { PlatformerGame } from "./react-examples/platformer-game";

export function Room5() {
  const probeRef = useRef<MPositionProbeElement | null>(null);
  const groupRef = useRef<MGroupElement | null>(null);

  useVisibilityProbe(probeRef, groupRef, 32, 500);

  const platformerGamePosX = 1000;
  const platformerGamePosY = 1000;

  return (
    <m-group>
      <Teleporter
        startX={-15}
        startY={0}
        startZ={-10.75}
        startRY={180}
        endX={platformerGamePosX}
        endY={platformerGamePosY}
        endZ={-5}
        endRY={90}
      />
      <PlatformerGame x={platformerGamePosX} y={platformerGamePosY} />
      <m-position-probe ref={probeRef} />
      <m-group ref={groupRef}></m-group>
    </m-group>
  );
}
