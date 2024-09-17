import * as React from "react";

import { Room1 } from "./room-1";
import { Room2 } from "./room-2";
import { Room3 } from "./room-3";
import { Room4 } from "./room-4";
import { Room5 } from "./room-5";
import { Room6 } from "./room-6";

type RoomType = {
  x: number;
  y: number;
  z: number;
  index: number;
};

export function RoomsRoot({ x, y, z, index }: RoomType) {
  const idx = index + 1;
  return (
    <m-group x={x} y={y} z={z}>
      {idx === 1 && <Room1 />}
      {idx === 2 && <Room2 />}
      {idx === 3 && <Room3 />}
      {idx === 4 && <Room4 />}
      {idx === 5 && <Room5 />}
      {idx === 6 && <Room6 />}
    </m-group>
  );
}
