import * as React from "react";

import { posters } from "../../assets";
import { RoomPoster } from "../../components/room-poster";

export function ExternalApisContents() {
  return (
    <>
      <RoomPoster src={posters.externalApi} />
    </>
  );
}
