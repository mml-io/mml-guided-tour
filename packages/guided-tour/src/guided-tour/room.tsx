// eslint-disable-next-line import/default
import React from "react";

type RoomType = {
  src: string;
  x: number;
  y: number;
  z: number;
  index: number;
};

export function Room({ src, x, y, z, index }: RoomType) {
  switch (index) {
    case 0: {
      break;
    }
    default:
      break;
  }
  return (
    <m-group>
      <m-model src={src} x={x} y={y} z={z}></m-model>
    </m-group>
  );
}
