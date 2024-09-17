import * as React from "react";

import { defaultRoomModel, posters } from "../assets";
import { RoomPoster } from "../components/room-poster";
import { PositionProbeLoaded } from "../helpers/use-visibility-probe";
import { MemoryGame } from "../react-examples/memory-game";
import { RaceCars } from "../react-examples/race-cars";
import { RotatingCarPlinth } from "../react-examples/rotating-car-plinth";

export function Room2() {
  return (
    <>
      <m-model src={defaultRoomModel}></m-model>
      <PositionProbeLoaded range={32} interval={500}>
        <RotatingCarPlinth x={11} />
        <RaceCars x={-12.5} z={-4} ry={-90} />
        <MemoryGame x={5.5} z={21.7} ry={180} />
        <RoomPoster src={posters.animations} />
      </PositionProbeLoaded>
    </>
  );
}
