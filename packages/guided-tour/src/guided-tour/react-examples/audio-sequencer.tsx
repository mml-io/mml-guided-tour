import * as React from "react";
import { memo, useState } from "react";

// const audioSrcs = [
//   "/assets/guidedtour/Kick-808-12.wav",
//   "/assets/guidedtour/Krs-cymbol-4.wav",
//   "/assets/guidedtour/medasin-hi-hat.wav",
//   "/assets/guidedtour/Stretched-808-Snare.wav",
// ];

const bodyTextureURL = "/assets/guidedtour/texture_808.jpg";

const bars = 16;
const instruments = 4;

const buttonsGap = 0.12;
const buttonSize = 0.91;
const depthCheckSkin = 0.005;

const offSatLight = "20%, 40%";
const onSatLight = "100%, 80%";

// const minBPM = 60;
// const maxBPM = 360;
// const initialBPM = 120;
// const bpmStep = 5;
// const bpmToMS = (bpm: number) => 60000 / bpm;

type AudioSequencerProps = {
  x?: number;
  y?: number;
  z?: number;
  ry?: number;
  visibleTo?: string | number;
};

type BodyProps = {
  width: number;
  height: number;
  depth: number;
  color: string;
};
const Body = memo(({ width, height, depth, color }: BodyProps) => {
  return (
    <m-group>
      <m-cube width={width} height={height} depth={depth} color={color} y={height / 2}>
        <m-image
          src={bodyTextureURL}
          width={width}
          height={height}
          z={depth / 2 + depthCheckSkin}
          opacity={0.12}
        />
      </m-cube>
    </m-group>
  );
});
Body.displayName = "Body";

type Button = {
  id: number;
  on: boolean;
};

type Buttons = Map<string, Button>;

const Channel = memo(({ index, yPos }: { index: number; yPos: number }) => {
  const [controlButtons, setControlButtons] = useState<Buttons>(() => {
    const buttons: Buttons = new Map();
    for (let i = 0; i < bars; i++) {
      const id = `button-${index}-${i}`;
      buttons.set(id, { id: i, on: false });
    }
    return buttons;
  });
  const halfWidth = (bars * buttonSize) / 2 + ((bars - 1) * buttonsGap) / 2 - buttonSize / 2;

  const toggleButton = (id: string) => {
    setControlButtons((prevButtons) => {
      const newButtons = new Map(prevButtons);
      const button = newButtons.get(id);
      if (button) {
        button.on = !button.on;
        newButtons.set(id, button);
      }
      return newButtons;
    });
  };

  return (
    <m-group y={yPos}>
      {Array.from(controlButtons.entries()).map(([id, control], idx) => (
        <m-cube
          key={id}
          width={buttonSize}
          height={buttonSize}
          depth={0.1}
          z={0.16}
          x={idx * (buttonSize + buttonsGap) - halfWidth}
          color={
            control.on
              ? `hsl(${(360 / bars) * idx}, ${onSatLight})`
              : `hsl(${(360 / bars) * idx}, ${offSatLight})`
          }
          onClick={() => toggleButton(id)}
        ></m-cube>
      ))}
    </m-group>
  );
});
Channel.displayName = "Channel";

const Channels = memo(() => {
  return (
    <m-group>
      {[...Array(instruments).keys()].map((index) => (
        <Channel
          key={index}
          index={index}
          yPos={index * buttonSize + index * buttonsGap + buttonSize * 1.6}
        />
      ))}
    </m-group>
  );
});
Channels.displayName = "Channels";

export const AudioSequencer = memo(({ x, y, z, ry, visibleTo }: AudioSequencerProps) => {
  return (
    <m-group x={x} y={y} z={z} ry={ry} visible-to={visibleTo}>
      <Body width={18.725} height={6} depth={0.25} color="#212121" />
      <Channels />
    </m-group>
  );
});
AudioSequencer.displayName = "AudioSequencer";
