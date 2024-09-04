import { MGroupElement, MPositionProbeElement } from "@mml-io/mml-react-types";
import * as React from "react";
import { useRef } from "react";

import { useVisibilityProbe } from "./helpers/use-visibility-probe";
import { firstInteraction, gliders } from "../examples";

export function Room1() {
  const probeRef = useRef<MPositionProbeElement | null>(null);
  const groupRef = useRef<MGroupElement | null>(null);

  useVisibilityProbe(probeRef, groupRef, 32, 500);

  return (
    <m-group>
      <m-position-probe ref={probeRef} />
      <m-group ref={groupRef}>
        <m-frame src={firstInteraction}></m-frame>
        <m-frame src={gliders} x={-17.65} y={2.05} sy={2.63} sz={3.14}></m-frame>
      </m-group>
    </m-group>
  );
}
