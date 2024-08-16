import { MAttrAnimElement } from "@mml-io/mml-react-types";
import * as React from "react";
import { useRef, useState } from "react";

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

export function RaceCars({ x, y, z, ry }: RaceCarsProps): JSX.Element {
  const racing = useRef(false);

  const animRef = useRef<MAttrAnimElement | null>(null);
  // const animAttributes = useAttributes(animRef);

  const [animationProps, setAnimationProps] = useState<AnimationProps[]>([]);
  const [audioProps, setAudioProps] = useState<AudioProps[]>([]);

  const [attributes, setAttributes] = useState<Record<string, string>>({});
  const [winnerIndex, setWinnerIndex] = useState<number>(0);

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
    availableCarsModels[availableCars[i]] =
      `/assets/guidedtour/f1_race_car_${availableCars[i]}.glb`;
  }

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

      setAttributes({
        attr: "x",
        start: `${-trackLength / 2 + 1}`,
        end: `${trackLength / 2 - 1.5}`,
        "start-time": `${now}`,
        duration: `${time}`,
        loop: `${false}`,
      });

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

    newAnimationProps[winnerIndex].winner = true;
    setAnimationProps(newAnimationProps);
    setAudioProps(newAudioProps);
    setWinnerIndex(winnerIndex);
    setTimeout(() => (racing.current = false), raceDuration + 100);
  };

  const Cars = ({ animations, audio }: { animations: AnimationProps[]; audio: AudioProps[] }) => {
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
  };

  const RaceTrack = () => (
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
  );

  return (
    <m-group x={x} y={y} z={z} ry={ry}>
      <PlayButton
        x={-7}
        z={-2}
        reEnableTime={raceDuration + 100}
        callback={() => {
          animateCars();
        }}
      />
      <RaceTrack />
      <Cars animations={animationProps} audio={audioProps} />
      <m-group x={-5} z={4.4} ry={180}>
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
      </m-group>
    </m-group>
  );
}
