import * as React from "react";

import { Teleporter } from "./components/teleporter";
import { GlassBridgeGame } from "./react-examples/glass-bridge";
import { PlatformerGame } from "./react-examples/platformer-game";

export function Room5() {
  const platformerGamePosX = 1000;
  const platformerGamePosY = 10000;

  const glassBrigdeGamePosX = -1000;
  const glassBrigdeGamePosY = 15000;

  return (
    <m-group>
      <m-group id="platformer-game-wrapper">
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
      </m-group>
      <m-group id="glass-bridge-game-wrapper">
        <Teleporter
          startX={-15}
          startY={0}
          startZ={2.25}
          startRY={180}
          endX={glassBrigdeGamePosX}
          endY={glassBrigdeGamePosY}
          endZ={-5}
          endRY={90}
        />
        <GlassBridgeGame x={glassBrigdeGamePosX} y={glassBrigdeGamePosY} />
      </m-group>
    </m-group>
  );
}
