// eslint-disable-next-line import/default
import React from "react";

import { firstInteraction, gliders } from "../examples";

export function Room1() {
  return (
    <m-group>
      <m-frame src={firstInteraction} z={14.05}></m-frame>
      <m-frame src={gliders} x={-17.65} y={2.05} z={14} sy={2.63} sz={3.14}></m-frame>
    </m-group>
  );
}
