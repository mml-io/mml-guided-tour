import * as React from "react";

import { posters } from "../../assets";
import { RoomPoster } from "../../components/room-poster";
import { AudioSequencer } from "../../react-examples/audio-sequencer";
import { GamingVideo } from "../../react-examples/gaming-video";

export function AudioVideoContents() {
  return (
    <>
      <GamingVideo x={10} z={10} />
      <AudioSequencer x={-17.49} y={2} ry={90} />
      <RoomPoster src={posters.audioVideo} />
    </>
  );
}
