import * as React from "react";

import { defaultRoomModel, posters } from "../assets";
import { RoomPoster } from "../components/room-poster";

export function Room4() {
  return (
    <m-group>
      <m-model src={defaultRoomModel}></m-model>
      <RoomPoster src={posters.externalApi} />
    </m-group>
  );
}
