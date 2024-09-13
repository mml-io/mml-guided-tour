import { memo } from "react";
import * as React from "react";

type WeatherProps = {
  x: number;
  y: number;
  z: number;
  ry: number;
};
export const Weather = memo(({ x, y, z, ry }: WeatherProps) => {
  return (
    <m-group x={x} y={y} z={z} ry={ry}>
      <m-cube></m-cube>
    </m-group>
  );
});
Weather.displayName = "Weather";
