import * as React from "react";

import { MMLLogo } from "./react-examples/mml-logo";

type ExternalAreaProps = {
  x?: number;
  y?: number;
  z?: number;
};
export function ExternalArea({ x, y, z }: ExternalAreaProps) {
  return (
    <m-group x={x} y={y} z={z}>
      <MMLLogo y={-2.5} z={13.5} sx={0.65} sy={0.65} sz={0.65} />
    </m-group>
  );
}
