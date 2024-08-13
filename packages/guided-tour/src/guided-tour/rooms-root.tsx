// eslint-disable-next-line import/default
import React from "react";

import { Room1 } from "./room-1";
import { Room2 } from "./room-2";

type RoomType = {
  src: string;
  x: number;
  y: number;
  z: number;
  index: number;
};

export function RoomsRoot({ src, x, y, z, index }: RoomType) {
  const idx = index + 1;
  return (
    <m-group>
      <m-model src={src} x={x} y={y} z={z}></m-model>
      {idx === 1 && <Room1 x={x} y={y} z={z} />}
      {idx === 2 && <Room2 x={x} y={y} z={z} />}
    </m-group>
  );
}
