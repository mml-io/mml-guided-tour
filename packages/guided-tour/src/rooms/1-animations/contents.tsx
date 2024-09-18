import * as React from "react";

import { posters } from "../../assets";
import { RoomPoster } from "../../components/room-poster";
import { MemoryGame } from "../../react-examples/memory-game";
import { RaceCars } from "../../react-examples/race-cars";
import { RotatingCarPlinth } from "../../react-examples/rotating-car-plinth";

export function AnimationRoomContents() {
  return (
    <>
      <RotatingCarPlinth x={11} />
      <RaceCars x={-12.5} z={-4} ry={-90} />
      <MemoryGame x={5.5} z={21.7} ry={180} />
      <RoomPoster src={posters.animations} />
    </>
  );
}
