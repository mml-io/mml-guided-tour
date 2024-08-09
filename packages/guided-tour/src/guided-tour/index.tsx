/* eslint-disable import/default */
/*eslint import/no-unresolved: [2, { ignore: ['^mml:'] }]*/
// import duck from "mml:../duck/index.tsx";
import React from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

import { Hallway } from "./hallway";
import { Room } from "./room";

function App() {
  const guidedTourYPos = 0;

  const numberOfRooms = 6;
  const roomsDepth = 45;
  const spaceBetweenRooms = 8;

  const rooms = [];

  for (let z = 0; z < numberOfRooms; z++) {
    const roomAsset = z === 0 ? "/assets/guidedtour/room_1.glb" : "/assets/guidedtour/room.glb";
    const roomZPos = 14 + roomsDepth * z + (spaceBetweenRooms + 0.55) * z;
    rooms.push(<Room src={roomAsset} x={0} y={guidedTourYPos} z={roomZPos} index={z} />);

    if (z < numberOfRooms - 1) {
      rooms.push(<Hallway x={0} y={guidedTourYPos} z={roomZPos + roomsDepth / 2 + 4.2} />);
    }
  }

  return <>{rooms}</>;
}

const container =
  document.getElementById("root") ?? document.body.appendChild(document.createElement("div"));
const root = createRoot(container);
flushSync(() => {
  root.render(<App />);
});
