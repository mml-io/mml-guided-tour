import * as React from "react";

import { posters } from "../../assets";
import { RoomPoster } from "../../components/room-poster";

export function ExternalApisContents() {
  return (
    <>
      {/* TODO - add back in if/when the API is live */}
      {/* <Weather z={22.4} y={2} ry={180} /> */}
      <RoomPoster src={posters.externalApi} />
    </>
  );
}
