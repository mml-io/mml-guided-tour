import * as React from "react";

import { posters } from "../../assets";
import { RoomPoster } from "../../components/room-poster";
import { Weather } from "../../react-examples/weather";

export function ExternalApisContents() {
  return (
    <>
      <Weather z={22.4} y={2} ry={180} />
      <RoomPoster src={posters.externalApi} />
    </>
  );
}
