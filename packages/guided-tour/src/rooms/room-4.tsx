import * as React from "react";

import { posters } from "../assets";
import { RoomPoster } from "../components/room-poster";
import { renderAsMML } from "../helpers/render-as-mml";

export function Room4Contents() {
  return (
    <>
      <RoomPoster src={posters.externalApi} />
    </>
  );
}

renderAsMML(<Room4Contents />);
