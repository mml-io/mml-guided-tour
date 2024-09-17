import * as React from "react";

import { PositionProbeLoaded } from "../helpers/use-visibility-probe";
import { AudioSequencer } from "../react-examples/audio-sequencer";
import { GamingVideo } from "../react-examples/gaming-video";

export function Room3() {
  return (
    <PositionProbeLoaded range={32} interval={500}>
      <GamingVideo x={10} z={10} />
      <AudioSequencer x={-17.49} y={2} ry={90} />
    </PositionProbeLoaded>
  );
}
