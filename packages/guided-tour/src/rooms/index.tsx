import room1 from "mml:./room-1";
import room2 from "mml:./room-2";
import room3 from "mml:./room-3";
import room4 from "mml:./room-4";
import room5 from "mml:./room-5";
import room6 from "mml:./room-6";
import * as React from "react";

import { roomModels } from "../assets";
import { PositionProbeLoaded } from "../helpers/use-visibility-probe";

export const rooms = [room1, room2, room3, room4, room5, room6] as const;

export const roomDepth = 45;

export function Room({
  src,
  x,
  y,
  z,
  model = roomModels.default,
  persist,
}: {
  src: (typeof rooms)[number];
  x?: number;
  y?: number;
  z?: number;
  model?: (typeof roomModels)[keyof typeof roomModels];
  persist?: boolean;
}) {
  return (
    <m-group x={x} y={y} z={z}>
      {/* basic room model is loaded immediately, rather than in the m-frame so we get collision as soon as the level is loaded */}
      <m-model src={model}></m-model>
      <PositionProbeLoaded range={32} interval={500} persist={persist}>
        <m-frame src={src}></m-frame>
      </PositionProbeLoaded>
    </m-group>
  );
}
