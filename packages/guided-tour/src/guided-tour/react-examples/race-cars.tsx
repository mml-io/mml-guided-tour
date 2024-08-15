import { MAudioElement, MModelElement } from "@mml-io/mml-react-types";
import * as React from "react";
import { useCallback, useMemo, useRef } from "react";

import { randomArrayElement, randomInt } from "../helpers/js-helpers";

export const RaceCars = ({ x, y, z, ry }: { x: number; y: number; z: number; ry: number }) => {
  const racing = useRef(false);

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
  const carRefs = useMemo(() => [yellowCarRef, greenCarRef, blueCarRef, pinkCarRef, redCarRef], []);

  const yellowCarSoundRef = React.useRef<MAudioElement | null>(null);
  const greenCarSoundRef = React.useRef<MAudioElement | null>(null);
  const blueCarSoundRef = React.useRef<MAudioElement | null>(null);
  const pinkCarSoundRef = React.useRef<MAudioElement | null>(null);
  const redCarSoundRef = React.useRef<MAudioElement | null>(null);
  const carSoundRefs = useMemo(
    () => [yellowCarSoundRef, greenCarSoundRef, blueCarSoundRef, pinkCarSoundRef, redCarSoundRef],
    [],
  );

  const easings = useMemo(() => ["easeInOutQuad", "easeInOutCubic", "easeInOutQuart"], []);
  const availableCars = useMemo(() => ["yellow", "green", "blue", "pink", "red"], []);

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

  const animateCars = useCallback(() => {
    if (racing.current) return;
    racing.current = true;
    let smallestTime = 999999999999;
    const now = document.timeline.currentTime as number;

    availableCars.forEach((_car, index) => {
      const car = carRefs[index].current;
      const carSound = carSoundRefs[index].current;
      if (!car || !carSound) return;

      const time = randomInt(raceDuration - raceDuration * 0.1, raceDuration);
      const easing = randomArrayElement(easings);

      const animation = document.createElement("m-attr-anim");
      animation.setAttribute("attr", "x");
      animation.setAttribute("start", `${-trackLength / 2 + 1}`);
      animation.setAttribute("end", `${trackLength / 2 - 1.5}`);
      animation.setAttribute("start-time", `${now}`);
      animation.setAttribute("end-time", `${now + time}`);
      animation.setAttribute("duration", `${time}`);
      animation.setAttribute("loop", "false");
      animation.setAttribute("ping-pong", "false");
      animation.setAttribute("easing", easing);
      car.appendChild(animation);

      const audioOffset = easing === "easeInOutQuad" ? 50 : easing === "easeInOutCubic" ? 250 : 350;
      carSound.setAttribute("volume", "1");
      carSound.setAttribute("start-time", `${now + audioOffset}`);
      carSound.setAttribute("pause-time", `${now + audioOffset + raceSoundDuration}`);
      setTimeout(() => {
        car.setAttribute("x", `${trackLength / 2 - 1.5}`);
        car.removeChild(animation);
        carSound.setAttribute("volume", "0");
      }, time);
      if (time < smallestTime) {
        smallestTime = time;
      }
    });
    setTimeout(() => (racing.current = false), raceDuration + 100);
  }, [availableCars, carRefs, carSoundRefs, easings]);

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
        >
          <m-audio
            ref={carSoundRefs[index]}
            src="/assets/guidedtour/sfx_racing.mp3"
            start-time={-raceSoundDuration}
            pause-time={document.timeline.currentTime as number}
            loop={false}
            volume={0}
          ></m-audio>
        </m-model>
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
    <m-group
      x={x}
      y={y}
      z={z}
      ry={ry}
      onClick={() => {
        animateCars();
      }}
    >
      <RaceTrack />
      <Cars />
    </m-group>
  );
};
