import { MAttrAnimElement } from "@mml-io/mml-react-types";
import * as React from "react";
import { memo, useRef, useState } from "react";

import { PlayButton } from "../components/play-button";
import { TagCodeCanvas } from "../components/tag-code-canvas";
import { randomArrayElement, randomInt } from "../helpers/js-helpers";
// import { useAttributes } from "../helpers/use-attributes";

type PossibleEasings = "easeInOutQuad" | "easeInOutCubic" | "easeInOutQuart";
type EasingsArray = Array<PossibleEasings>;

type AnimationProps = {
  winner?: boolean;
  startTime: number;
  endTime: number;
  duration: number;
  easing: PossibleEasings;
};

type AudioProps = {
  volume: number;
  startTime: number;
  pauseTime: number;
};

type RaceCarsProps = {
  x?: number;
  y?: number;
  z?: number;
  ry?: number;
};

const raceDuration = 3900;
const raceSoundDuration = 4000;

const trackLength = 30;
const carScale = 0.5;

const colorSaturation = "100%";
const colorLightness = "65%";
const carColors = [
  `hsl(72, ${colorSaturation}, ${colorLightness})`,
  `hsl(144, ${colorSaturation}, ${colorLightness})`,
  `hsl(216, ${colorSaturation}, ${colorLightness})`,
  `hsl(288, ${colorSaturation}, ${colorLightness})`,
  `hsl(380, ${colorSaturation}, ${colorLightness})`,
];

const easings: EasingsArray = ["easeInOutQuad", "easeInOutCubic", "easeInOutQuart"];
const availableCars = ["yellow", "green", "blue", "pink", "red"];
const availableCarsModels: Record<string, string> = {};
for (let i = 0; i < availableCars.length; i++) {
  availableCarsModels[availableCars[i]] = `/assets/guidedtour/f1_race_car_${availableCars[i]}.glb`;
}

const countDownAudioURL = "/assets/guidedtour/sfx_countdown.mp3";
const CountDownSound = memo(
  ({ startTime, pauseTime, volume }: { startTime: number; pauseTime: number; volume: number }) => (
    <m-audio
      src={countDownAudioURL}
      start-time={startTime}
      pause-time={pauseTime}
      loop={false}
      volume={volume}
    ></m-audio>
  ),
);
CountDownSound.displayName = "CountDownSound";

const CountDown = memo(({ countDown, show }: { countDown: string; show: boolean }) => (
  <m-group>
    <m-label
      content={countDown}
      font-size={210}
      width={5.5}
      height={3.0}
      y={2.2}
      x={-0.5}
      z={show ? -0.1 : 0.1}
      alignment="center"
      padding={0}
      color="#000000"
      font-color="#aaeeaa"
      emissive={7}
    ></m-label>
  </m-group>
));
CountDown.displayName = "CountDown";

const Cars = memo(
  ({
    animations,
    audio,
    animRef,
  }: {
    animations: AnimationProps[];
    audio: AudioProps[];
    animRef: React.MutableRefObject<MAttrAnimElement | null>;
  }) => {
    return (
      <m-group id="cars">
        {availableCars.map((car, index) => (
          <m-model
            key={`car-${index}`}
            id={car}
            src={availableCarsModels[car] as string}
            x={-trackLength / 2 + 1}
            y={0.3}
            z={index * carScale * 2 - carScale * 0.75}
            sx={carScale}
            sy={carScale}
            sz={carScale}
          >
            {animations.length === availableCars.length && (
              <m-attr-anim
                key={`anim-${index}`}
                ref={animations[index].winner ? animRef : null}
                attr="x"
                start={-trackLength / 2 + 1}
                end={trackLength / 2 - 1.5}
                start-time={animations[index].startTime}
                duration={animations[index].duration}
                loop={false}
                easing={animations[index].easing}
              ></m-attr-anim>
            )}
            {audio.length === availableCars.length && (
              <m-audio
                key={`audio-${index}`}
                src="/assets/guidedtour/sfx_racing.mp3"
                start-time={audio[index].startTime}
                pause-time={audio[index].pauseTime}
                loop={false}
                volume={audio[index].volume}
              ></m-audio>
            )}
          </m-model>
        ))}
      </m-group>
    );
  },
);
Cars.displayName = "Cars";

const RaceTrack = memo(() => (
  <m-group id="race-track">
    <m-cube
      color="#424242"
      width={trackLength}
      height={0.1}
      depth={carScale * 10}
      y={0.25}
      z={carScale * 3.1}
    >
      <m-image
        src="/assets/guidedtour/texture_checkered.jpg"
        width={carScale * 10}
        x={trackLength / 2 - 1.4}
        y={0.066}
        rx={-90}
        rz={90}
      ></m-image>
    </m-cube>
  </m-group>
));
RaceTrack.displayName = "RaceTrack";

const Winner = memo(
  ({ content, color, show }: { content: string; color: string; show: boolean }) => (
    <m-group>
      <m-cube color="#424242" width={6.75} depth={0.5} height={2.75} y={0.1} z={0.25} rx={-45}>
        <m-label
          content={show ? content : ""}
          font-size={40}
          width={6.75}
          height={1.0}
          y={0.3}
          x={0}
          z={0.253}
          alignment="center"
          padding={0}
          color="#000000"
          font-color={color}
          emissive={7}
        ></m-label>
      </m-cube>
    </m-group>
  ),
);
Winner.displayName = "Winner";

export function RaceCars({ x, y, z, ry }: RaceCarsProps): JSX.Element {
  const racing = useRef(false);

  const animRef = useRef<MAttrAnimElement | null>(null);
  // const animAttributes = useAttributes(animRef);

  const [animationProps, setAnimationProps] = useState<AnimationProps[]>([]);
  const [audioProps, setAudioProps] = useState<AudioProps[]>([]);

  const [attributes, setAttributes] = useState<Record<string, string>>({});
  const [winnerIndex, setWinnerIndex] = useState<number>(0);

  const [countDown, setCountDown] = useState<string>("");
  const [countDownStart, setCountDownStart] = useState<number>(0);
  const [countDownPause, setCountDownPause] = useState<number>(0);
  const [countDownVolume, setCountDownVolume] = useState<number>(0);

  const [winnerText, setWinnerText] = useState<string>("");

  const animateCars = () => {
    if (racing.current) return;
    racing.current = true;

    let smallestTime = Infinity;
    let winnerIndex = -1;

    const now = document.timeline.currentTime as number;

    const newAudioProps: AudioProps[] = [];

    const newAnimationProps = availableCars.map((_car, index) => {
      const time = randomInt(raceDuration - raceDuration * 0.15, raceDuration);
      const easing: PossibleEasings = randomArrayElement(easings);

      if (time < smallestTime) {
        smallestTime = time;
        winnerIndex = index;
      }

      const offset = easing === "easeInOutQuad" ? 50 : easing === "easeInOutCubic" ? 250 : 350;

      newAudioProps.push({
        volume: 1,
        startTime: now + offset,
        pauseTime: now + offset + raceSoundDuration,
      });

      return {
        winner: false,
        startTime: now,
        endTime: now + time,
        duration: time,
        easing,
      };
    });

    setAttributes({
      id: `${availableCars[winnerIndex]}`,
      attr: "x",
      start: `${-trackLength / 2 + 1}`,
      end: `${trackLength / 2 - 1.5}`,
      "start-time": `${now}`,
      duration: `${newAnimationProps[winnerIndex].duration}`,
      loop: `${false}`,
    });

    setWinnerIndex(winnerIndex);
    newAnimationProps[winnerIndex].winner = true;
    setWinnerText(`Winner: ${availableCars[winnerIndex]} (${(smallestTime / 1000).toFixed(3)}s)`);

    setAnimationProps(newAnimationProps);
    setAudioProps(newAudioProps);

    setTimeout(() => (racing.current = false), raceDuration + 100);
  };

  const startCountDown = () => {
    setAnimationProps([]);
    setAudioProps([]);
    setWinnerText("");

    setCountDownStart(document.timeline.currentTime as number);
    setCountDownPause((document.timeline.currentTime as number) + 4000);
    setCountDownVolume(1);

    setTimeout(() => setCountDown("3"), 400);
    setTimeout(() => setCountDown("2"), 1300);
    setTimeout(() => setCountDown("1"), 2300);
    setTimeout(() => setCountDown("GO"), 3250);

    setTimeout(() => animateCars(), 3250);

    setTimeout(() => setCountDown(""), 3250 + raceDuration);
  };

  return (
    <m-group x={x} y={y} z={z} ry={ry}>
      <PlayButton
        x={-7}
        z={-2}
        reEnableTime={raceDuration + 100}
        callback={() => {
          startCountDown();
        }}
      />
      <RaceTrack />
      <m-group x={-6.5} z={4.4} ry={180}>
        <Winner
          content={winnerText}
          color={carColors[winnerIndex]}
          show={countDown === "" && Object.keys(attributes).length !== 0}
        />
        <m-group y={0.9} z={-0.37}>
          <m-model
            src="/assets/guidedtour/code_display.glb"
            sx={0.6}
            sy={0.6}
            sz={0.5}
            ry={180}
          ></m-model>
          <m-group x={-0.3} y={2.03}>
            <TagCodeCanvas
              tagAttributes={attributes}
              fontSize={30}
              color={carColors[winnerIndex]}
              emissive={12}
              tag="m-attr-anim"
            />
          </m-group>
          <CountDown
            countDown={countDown}
            show={countDown === "" && Object.keys(attributes).length !== 0}
          />
          <CountDownSound
            startTime={countDownStart}
            pauseTime={countDownPause}
            volume={countDownVolume}
          />
        </m-group>
      </m-group>
      <Cars animations={animationProps} audio={audioProps} animRef={animRef} />
    </m-group>
  );
}
