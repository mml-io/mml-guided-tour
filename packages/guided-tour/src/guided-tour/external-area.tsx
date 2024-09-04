import * as React from "react";

import { MMLLogo } from "./react-examples/mml-logo";
import { TrackingDuck } from "./react-examples/tracking-duck";

type ExternalAreaProps = {
  x?: number;
  y?: number;
  z?: number;
};
export function ExternalArea({ x, y, z }: ExternalAreaProps) {
  return (
    <m-group x={x} y={y} z={z}>
      <MMLLogo x={-30} y={-2.5} z={13.5} sx={0.65} sy={0.65} sz={0.65} />
      <TrackingDuck x={-25} y={5} z={67.5} />
    </m-group>
  );
}
