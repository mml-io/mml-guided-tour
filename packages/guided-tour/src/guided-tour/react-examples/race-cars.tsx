import { MModelElement } from "@mml-io/mml-react-types";
import * as React from "react";
import { useCallback } from "react";

import { randomArrayElement } from "../helpers/js-helpers";

export const RaceCars = ({ x, y, z, ry }: { x: number; y: number; z: number; ry: number }) => {
  const raceDuration = 3900;
  const raceSoundDuration = 4000;
  const countdownSoundDuration = 4000;
  const trackLength = 30;
  const carScale = 0.5;

  const colorSaturation = "100%";
  const colorLightness = "65%";

  const yellowCarRef = React.useRef<MModelElement | null>(null);
  const greenCarRef = React.useRef<MModelElement | null>(null);
  const blueCarRef = React.useRef<MModelElement | null>(null);
  const pinkCarRef = React.useRef<MModelElement | null>(null);
  const redCarRef = React.useRef<MModelElement | null>(null);
  const carRefs = [yellowCarRef, greenCarRef, blueCarRef, pinkCarRef, redCarRef];

  const easings = ["easeInOutQuad", "easeInOutCubic"];
  const availableCars = ["yellow", "green", "blue", "pink", "red"];
  const availableCarsModels: Record<string, string> = {
    yellow: "/assets/guidedtour/f1_race_car_yellow.glb",
    green: "/assets/guidedtour/f1_race_car_green.glb",
    blue: "/assets/guidedtour/f1_race_car_blue.glb",
    pink: "/assets/guidedtour/f1_race_car_pink.glb",
    red: "/assets/guidedtour/f1_race_car_red.glb",
  };
  const carColors = [
    `hsl(72, ${colorSaturation}, ${colorLightness})`,
    `hsl(144, ${colorSaturation}, ${colorLightness})`,
    `hsl(216, ${colorSaturation}, ${colorLightness})`,
    `hsl(288, ${colorSaturation}, ${colorLightness})`,
    `hsl(380, ${colorSaturation}, ${colorLightness})`,
  ];

  const createAnimation = useCallback(
    (startTime: number, endTime: number) => {
      return (
        <m-attr-anim
          attr="x"
          start={-trackLength / 2 + 1}
          end={trackLength / 2 - 1.5}
          start-time={startTime}
          end-time={endTime}
          loop={false}
          ping-pong={false}
          duration="5000"
          easing={randomArrayElement(easings)}
        ></m-attr-anim>
      );
    },
    [easings],
  );

  const animateCars = useCallback(() => {}, []);

  const Cars = () => (
    <m-group id="cars">
      {availableCars.map((car, index) => (
        <m-model
          ref={carRefs[index]}
          id={car}
          key={index}
          src={availableCarsModels[car] as string}
          x={-trackLength / 2 + 1}
          y={0.3}
          z={index * carScale * 2 - carScale * 0.75}
          sx={carScale}
          sy={carScale}
          sz={carScale}
        ></m-model>
      ))}
    </m-group>
  );

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
      <RaceTrack />
      <Cars />
    </m-group>
  );
};
