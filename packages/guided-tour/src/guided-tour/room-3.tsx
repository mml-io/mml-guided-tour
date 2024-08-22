import { MGroupElement, MPositionProbeElement } from "@mml-io/mml-react-types";
import * as React from "react";
import { useRef } from "react";

import { useVisibilityProbe } from "./helpers/use-visibility-probe";
import { GamingVideo } from "./react-examples/gaming-video";

export function Room3() {
  const probeRef = useRef<MPositionProbeElement | null>(null);
  const groupRef = useRef<MGroupElement | null>(null);

  useVisibilityProbe(probeRef, groupRef, 32, 500);

  return (
    <m-group>
      <m-position-probe ref={probeRef} />
      <m-group ref={groupRef}>
        <GamingVideo x={10} z={10} />
      </m-group>
    </m-group>
  );
}
