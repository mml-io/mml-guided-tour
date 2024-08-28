import * as React from "react";
import { memo, useState } from "react";

const audioSrcs = [
  "/assets/guidedtour/sfx_808_kick.wav",
  "/assets/guidedtour/sfx_808_cymbol.wav",
  "/assets/guidedtour/sfx_808_hihat.wav",
  "/assets/guidedtour/sfx_808_snare.wav",
];

const bodyTextureURL = "/assets/guidedtour/texture_808.jpg";

const bars = 16;
const instruments = 4;

const buttonsGap = 0.12;
const buttonSize = 0.91;
const buttonDepth = 0.1;
const depthCheckSkin = 0.005;

const offSatLight = "20%, 40%";
const onSatLight = "100%, 80%";

const minBPM = 60;
const maxBPM = 360;
const initialBPM = 120;
const bpmStep = 5;
const bpmToMS = (bpm: number) => 60000 / bpm;

const defaultPreset = [[0, 5, 8, 13], [0], [0, 1, 3, 4, 7, 9, 11, 12, 15], [2, 6, 10, 14]];

type ButtonProps = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  color: string;
  fontColor: string;
  fontSize: number;
  content: string;
  onClickCallback: () => void;
};
const Button = memo(
  ({
    x,
    y,
    z,
    width,
    height,
    color,
    fontColor,
    fontSize,
    content,
    onClickCallback,
  }: ButtonProps) => {
    return (
      <m-group x={x} y={y} z={z} onClick={onClickCallback}>
        <m-cube
          width={width}
          height={height}
          depth={0.1}
          z={-buttonDepth / 2 - depthCheckSkin}
          color="#888888"
        />
        <m-label
          content={content}
          width={width}
          height={height}
          color={color}
          font-color={fontColor}
          font-size={fontSize}
          padding={0}
          alignment="center"
          emissive={3}
        ></m-label>
      </m-group>
    );
  },
);
Button.displayName = "Button";

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
      const isOn = defaultPreset[index]?.includes(i) ?? false;
      buttons.set(id, { id: i, on: isOn });
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
          depth={buttonDepth}
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

type AudioSequencerProps = {
  x?: number;
  y?: number;
  z?: number;
  ry?: number;
  visibleTo?: string | number;
};
export const AudioSequencer = memo(({ x, y, z, ry, visibleTo }: AudioSequencerProps) => {
  return (
    <m-group x={x} y={y} z={z} ry={ry} visible-to={visibleTo}>
      <Body width={18.725} height={6} depth={0.25} color="#212121" />
      <Button
        x={5.05}
        y={0.5}
        z={0.2}
        width={2}
        height={0.5}
        color="#303030"
        fontColor="#aaddaa"
        fontSize={38}
        content="PRESET"
        onClickCallback={() => {}}
      />
      <Button
        x={7.15}
        y={0.5}
        z={0.2}
        width={2}
        height={0.5}
        color="#303030"
        fontColor="#ddaaaa"
        fontSize={38}
        content="CLEAR"
        onClickCallback={() => {}}
      />
      <Channels />
    </m-group>
  );
});
AudioSequencer.displayName = "AudioSequencer";
