import * as React from "react";

import { Teleporter } from "./components/teleporter";

export function Room5() {
  return (
    <m-group>
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
  );
}
