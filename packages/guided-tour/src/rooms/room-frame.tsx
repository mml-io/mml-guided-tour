import * as React from "react";

import { RoomModel, roomModels } from "../assets";
import { PositionProbeLoaded } from "../helpers/use-visibility-probe";

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
        {persist ? (
          <m-frame src={src}></m-frame>
        ) : (
          <PositionProbeLoaded range={32} interval={500} persist={persist}>
            <m-frame src={src}></m-frame>
          </PositionProbeLoaded>
        )}
      </m-group>
    );
  }

  if (displayName) Room.displayName = displayName;

  return Room;
}
