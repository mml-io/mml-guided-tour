import * as React from "react";

import { posters } from "../assets";
import { RoomPoster } from "../components/room-poster";
import { renderAsMML } from "../helpers/render-as-mml";
import { MemoryGame } from "../react-examples/memory-game";
import { RaceCars } from "../react-examples/race-cars";
import { RotatingCarPlinth } from "../react-examples/rotating-car-plinth";

function Room2Contents() {
  return (
    <>
      <RotatingCarPlinth x={11} />
      <RaceCars x={-12.5} z={-4} ry={-90} />
      <MemoryGame x={5.5} z={21.7} ry={180} />
      <RoomPoster src={posters.animations} />
    </>
  );
}

renderAsMML(<Room2Contents />);
