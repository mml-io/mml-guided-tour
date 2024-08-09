// eslint-disable-next-line import/default
import React from "react";

import { Room1 } from "./room-1";

type RoomType = {
  src: string;
  x: number;
  y: number;
  z: number;
  index: number;
};

export function Room({ src, x, y, z, index }: RoomType) {
  const idx = index + 1;
  return (
    <m-group>
      <m-model src={src} x={x} y={y} z={z}></m-model>
      {idx === 1 && <Room1 />}
    </m-group>
  );
}
