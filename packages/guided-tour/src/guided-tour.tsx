/*eslint import/no-unresolved: [2, { ignore: ['^mml:'] }]*/
// import duck from "mml:../duck/index.tsx";
import * as React from "react";

import { roomModels } from "./assets";
import { ExternalArea } from "./components/external-area";
import { Hallway } from "./components/hallway";
import { renderAsMML } from "./helpers/render-as-mml";
import { Room, roomDepth, rooms } from "./rooms";
import { ServiceCorridor } from "./rooms/service-corridor";

function App() {
  const guidedTourYPos = 0;

  const spaceBetweenRooms = 8;

  const sections = [];

  for (let z = 0; z < rooms.length; z++) {
    const roomZPos = 14 + roomDepth * z + (spaceBetweenRooms + 0.55) * z;
    const roomModel = z === 0 ? roomModels.first : undefined;
    // HACK: room 5 needs to remain loaded as it contains teleporters to outside it's bounds
    const persist = z === 4;
    sections.push(
      <Room
        x={0}
        y={guidedTourYPos}
        z={roomZPos}
        src={rooms[z]}
        model={roomModel}
        persist={persist}
      />,
    );

    if (z < rooms.length - 1) {
      sections.push(<Hallway x={0} y={guidedTourYPos} z={roomZPos + roomDepth / 2 + 4.2} />);
    }
  }

  return (
    <>
      <ExternalArea x={21} />
      {sections}
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

renderAsMML(<App />);
