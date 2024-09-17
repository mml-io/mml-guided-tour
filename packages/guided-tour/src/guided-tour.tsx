/*eslint import/no-unresolved: [2, { ignore: ['^mml:'] }]*/
// import duck from "mml:../duck/index.tsx";
import * as React from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

import { ExternalArea } from "./components/external-area";
import { Hallway } from "./components/hallway";
import { RoomPoster } from "./components/room-poster";
import { RoomsRoot } from "./rooms/rooms-root";
import { ServiceCorridor } from "./rooms/service-corridor";

function App() {
  const guidedTourYPos = 0;

  const numberOfRooms = 6;
  const roomsDepth = 45;
  const spaceBetweenRooms = 8;

  const rooms = [];

  const roomPosters: Record<number, string | null> = {
    0: null,
    1: "/assets/guidedtour/poster_animations.jpeg",
    2: "/assets/guidedtour/poster_audio_video.jpeg",
    3: "/assets/guidedtour/poster_external_api.jpeg",
    4: "/assets/guidedtour/poster_games.jpeg",
    5: "/assets/guidedtour/poster_whats_next.jpeg",
  };

  for (let z = 0; z < numberOfRooms; z++) {
    const roomAsset = z === 0 ? "/assets/guidedtour/room_1.glb" : "/assets/guidedtour/room.glb";
    const roomZPos = 14 + roomsDepth * z + (spaceBetweenRooms + 0.55) * z;
    rooms.push(<RoomsRoot src={roomAsset} x={0} y={guidedTourYPos} z={roomZPos} index={z} />);

    if (z < numberOfRooms - 1) {
      rooms.push(<Hallway x={0} y={guidedTourYPos} z={roomZPos + roomsDepth / 2 + 4.2} />);
    }

    if (roomPosters[z] !== null) {
      rooms.push(
        <RoomPoster x={0} y={guidedTourYPos} z={roomZPos} posterURL={roomPosters[z] as string} />,
      );
    }
  }

  return (
    <>
      <ExternalArea x={21} />
      {rooms}
      <ServiceCorridor
        x={-10.5}
        y={0}
        z={148}
        width={30}
        height={22.5}
        depth={314}
        wallColor="#aaaaaa"
        glassColor="black"
        glassOpacity={0.9}
      />
    </>
  );
}

const container =
  document.getElementById("root") ?? document.body.appendChild(document.createElement("div"));
const root = createRoot(container);
flushSync(() => {
  root.render(<App />);
});
