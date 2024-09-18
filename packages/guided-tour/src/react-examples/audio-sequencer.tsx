import * as React from "react";

import { sequencer, SequencerSrc } from "../assets";

const audioSrcs: Array<SequencerSrc> = [
  sequencer.kick,
  sequencer.cymbol,
  sequencer.hihat,
  sequencer.snare,
];
const bodyTextureURL: SequencerSrc = sequencer.bodyTexture;

const bars = 16;
const instruments = 4;

const bodyDepth = 1;

const buttonsGap = 0.12;
const buttonSize = 0.91;
const buttonDepth = 0.1;
const depthCheckSkin = 0.005;

const offSatLight = "20%, 40%";
const onSatLight = "70%, 70%";

const red = "#ddaaaa";
const green = "#aaddaa";

const minBPM = 60;
const maxBPM = 360;
const initialBPM = 160;
const bpmStep = 5;
const bpmToMS = (bpm: number) => 60000 / bpm;

const defaultPreset = [[0, 5, 8, 13], [0], [0, 1, 3, 4, 7, 9, 11, 12, 15], [2, 6, 10, 14]];

type ButtonProps = {
  x: number;
  y: number;
  width: number;
  color: string;
  text: string;
  cb: () => void;
};
const Button = React.memo(({ x, y, width, color, text, cb }: ButtonProps) => {
  return (
    <m-group x={x} y={y} z={bodyDepth / 2 + buttonDepth} onClick={cb}>
      <m-cube
        z={-buttonDepth / 2 - depthCheckSkin}
        width={width}
        depth={0.1}
        height={0.5}
        color="#888888"
      />
      <m-label
        content={text}
        width={width}
        font-color={color}
        height={0.5}
        font-size={38}
        padding={0}
        alignment="center"
        color="#212121"
        emissive={3}
      ></m-label>
    </m-group>
  );
});
Button.displayName = "Button";

type BodyProps = {
  width: number;
  height: number;
  depth: number;
  color: string;
};
const Body = React.memo(({ width, height, depth, color }: BodyProps) => {
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

type ButtonState = {
  id: number;
  on: boolean;
};
type ButtonsState = Map<string, ButtonState>;

const Channel = React.memo(
  ({
    index,
    yPos,
    controlButtons,
    toggleButton,
    bpm,
    muted,
  }: {
    index: number;
    yPos: number;
    controlButtons: ButtonsState;
    toggleButton: (id: string) => void;
    bpm: number;
    muted: boolean;
  }) => {
    const halfWidth = (bars * buttonSize) / 2 + ((bars - 1) * buttonsGap) / 2 - buttonSize / 2;
    const beatDuration = bpmToMS(bpm * 2);
    const loopDuration = beatDuration * bars;

    return (
      <m-group id={`channel-${index}`}>
        {Array.from(controlButtons.entries()).map(([id, control], idx) => (
          <m-group key={id}>
            <m-group>
              {control.on && (
                <m-audio
                  debug={false}
                  y={15}
                  z={2}
                  rx={90}
                  cone-angle={80}
                  cone-falloff-angle={100}
                  src={audioSrcs[index]}
                  enabled="true"
                  start-time={idx * beatDuration - loopDuration / 2}
                  loop-duration={loopDuration}
                  volume={muted === true ? 0 : 2}
                />
              )}
            </m-group>
            <m-group key={id} y={yPos} x={idx * (buttonSize + buttonsGap) - halfWidth}>
              <m-cube
                width={buttonSize}
                height={buttonSize}
                depth={buttonDepth}
                z={bodyDepth / 2 + buttonDepth}
                color={
                  control.on
                    ? `hsl(${(360 / bars) * idx}, ${onSatLight})`
                    : `hsl(${(360 / bars) * idx}, ${offSatLight})`
                }
                onClick={() => toggleButton(id)}
              />
            </m-group>
          </m-group>
        ))}
      </m-group>
    );
  },
);
Channel.displayName = "Channel";

type CursorProps = {
  cursorXStart: number;
  cursorXEnd: number;
  beatDuration: number;
};
const Cursor = React.memo(({ cursorXStart, cursorXEnd, beatDuration }: CursorProps) => {
  return (
    <m-group>
      <m-cube
        width={buttonSize}
        height={buttonsGap}
        depth={buttonDepth}
        y={buttonSize * instruments - buttonsGap - 0.05}
        z={bodyDepth / 2 + buttonDepth}
        color="#ffffff"
      >
        <m-attr-anim
          attr="x"
          start={cursorXStart}
          end={cursorXEnd}
          duration={beatDuration * bars}
          start-time={-(beatDuration * bars) / 2}
          loop="true"
          ping-pong="false"
        />
      </m-cube>
    </m-group>
  );
});
Cursor.displayName = "Cursor";

const Channels = React.memo(
  ({
    bpm,
    controlButtons,
    setControlButtons,
    muted,
  }: {
    bpm: number;
    controlButtons: ButtonsState[];
    setControlButtons: React.Dispatch<React.SetStateAction<ButtonsState[]>>;
    muted: boolean;
  }) => {
    const beatDuration = bpmToMS(bpm * 2);
    const cursorXStart = -((bars * buttonSize + (bars - 1) * buttonsGap) / 2 - buttonSize / 2);
    const cursorXEnd = cursorXStart + buttonSize * (bars - 1) + buttonsGap * (bars - 1);

    const toggleButton = (channelIndex: number, id: string) => {
      setControlButtons((prevChannels) => {
        const newChannels = [...prevChannels];
        const newButtons = new Map(newChannels[channelIndex]);
        const button = newButtons.get(id);
        if (button) {
          button.on = !button.on;
          newChannels[channelIndex] = newButtons;
        }
        return newChannels;
      });
    };

    return (
      <m-group>
        {[...Array(instruments).keys()].map((index) => (
          <m-group key={index}>
            <Channel
              index={index}
              yPos={index * buttonSize + index * buttonsGap + buttonSize * 1.6}
              controlButtons={controlButtons[index]}
              toggleButton={(id) => toggleButton(index, id)}
              bpm={bpm}
              muted={muted}
            />
            {index !== 0 && (
              <m-group y={(index - 1) * (buttonSize + buttonsGap) - 1.5}>
                <Cursor
                  cursorXStart={cursorXStart}
                  cursorXEnd={cursorXEnd}
                  beatDuration={beatDuration}
                />
              </m-group>
            )}
          </m-group>
        ))}
      </m-group>
    );
  },
);
Channels.displayName = "Channels";

type AudioSequencerProps = {
  x?: number;
  y?: number;
  z?: number;
  ry?: number;
  visibleTo?: string | number;
};
export const AudioSequencer = React.memo(({ x, y, z, ry, visibleTo }: AudioSequencerProps) => {
  const [bpm, setBPM] = React.useState<number>(initialBPM);
  const [muted, setMuted] = React.useState<boolean>(true);

  const increaseBPM = React.useCallback(() => {
    if (bpm < maxBPM) {
      const newValue = bpm + bpmStep;
      const remainder = newValue % bpmStep;
      const newBPM = remainder === 0 ? newValue : newValue - remainder;
      setBPM(newBPM);
    }
  }, [bpm]);

  const decreaseBPM = React.useCallback(() => {
    if (bpm > minBPM) {
      const newValue = bpm - bpmStep;
      const remainder = newValue % bpmStep;
      let newBPM = remainder === 0 ? newValue : newValue - remainder;
      if (bpm < newBPM) {
        newBPM += bpmStep;
      }
      setBPM(newBPM);
    }
  }, [bpm]);

  const [controlButtons, setControlButtons] = React.useState<ButtonsState[]>(() =>
    [...Array(instruments)].map((_, index) => {
      const buttons: ButtonsState = new Map();
      for (let i = 0; i < bars; i++) {
        const id = `button-${index}-${i}`;
        const isOn = defaultPreset[index]?.includes(i) ?? false;
        buttons.set(id, { id: i, on: isOn });
      }
      return buttons;
    }),
  );

  const clearAllButtons = () => {
    setControlButtons((prevChannels) =>
      prevChannels.map((channel) => {
        const newButtons = new Map(channel);
        newButtons.forEach((button) => (button.on = false));
        return newButtons;
      }),
    );
  };

  const applyPreset = () => {
    setControlButtons((prevChannels) =>
      prevChannels.map((channel, index) => {
        const newButtons = new Map(channel);
        newButtons.forEach(
          (button) => (button.on = defaultPreset[index]?.includes(button.id) ?? false),
        );
        return newButtons;
      }),
    );
  };

  return (
    <m-group x={x} y={y} z={z} ry={ry} visible-to={visibleTo}>
      <Body width={18.9} height={6} depth={bodyDepth} color="#212121" />
      <Button text="-" cb={() => decreaseBPM()} x={-7.7} y={0.5} width={1} color={red} />
      <Button text="+" cb={() => increaseBPM()} x={-6.6} y={0.5} width={1} color={green} />
      <Button text={`${bpm} BPM`} cb={() => {}} x={-5} y={0.5} width={2} color={green} />
      <Button
        text={`${muted ? "🔊 UNMUTE" : "🔈 MUTE"}`}
        cb={() => setMuted((prev) => !prev)}
        x={-2.5}
        y={0.5}
        width={2.5}
        color={green}
      />
      <Button text="PRESET" cb={applyPreset} x={5.05} y={0.5} width={2} color={green} />
      <Button text="CLEAR" cb={clearAllButtons} x={7.15} y={0.5} width={2} color={red} />
      <Channels
        controlButtons={controlButtons}
        setControlButtons={setControlButtons}
        bpm={bpm}
        muted={muted}
      />
    </m-group>
  );
});
AudioSequencer.displayName = "AudioSequencer";
