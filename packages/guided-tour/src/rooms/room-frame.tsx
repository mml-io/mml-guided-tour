import * as React from "react";

import { RoomModel, roomModels } from "../assets";

export function RoomFrame({
  displayName,
  src,
  model = roomModels.default,
  persist = false,
}: {
  src: string;
  displayName?: string;
  model?: RoomModel;
  persist?: boolean;
}) {
  function Room({ x, y, z }: { x?: number; y?: number; z?: number }) {
    return (
      <m-group x={x} y={y} z={z}>
        <m-model src={model}></m-model>
        {persist ? <m-frame src={src}></m-frame> : <m-frame load-range={32} src={src}></m-frame>}
      </m-group>
    );
  }

  if (displayName) Room.displayName = displayName;

  return Room;
}
