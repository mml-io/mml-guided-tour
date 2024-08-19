import * as React from "react";

export function RoomPoster({
  x,
  y,
  z,
  posterURL,
}: {
  x: number;
  y: number;
  z: number;
  posterURL: string;
}) {
  return (
    <m-group x={x} y={y} z={z}>
      <m-image src={posterURL} width={19} height={16} y={10} x={-17.87} z={0} ry={90}></m-image>
    </m-group>
  );
}
