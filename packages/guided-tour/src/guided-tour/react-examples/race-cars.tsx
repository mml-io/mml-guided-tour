import { MAttrAnimElement, MAudioElement, MModelElement } from "@mml-io/mml-react-types";
import * as React from "react";
import { useRef } from "react";

import { TagCodeCanvas } from "../components/tag-code-canvas";
import { randomArrayElement, randomInt } from "../helpers/js-helpers";
import { useAttributes } from "../helpers/use-attributes";

export const RaceCars = ({ x, y, z, ry }: { x: number; y: number; z: number; ry: number }) => {
  const racing = useRef(false);
  const animRef = useRef<MAttrAnimElement | null>(null);
  const animAttributes = useAttributes(animRef);

  const winner = useRef<string>("");
  const winnerIndex = useRef<number>(-1);

  const raceDuration = 3900;
  const raceSoundDuration = 4000;

  const trackLength = 30;
  const carScale = 0.5;

  const yellowAnimRef = useRef<MAttrAnimElement | null>(null);
  const greenAnimRef = useRef<MAttrAnimElement | null>(null);
  const blueAnimRef = useRef<MAttrAnimElement | null>(null);
  const pinkAnimRef = useRef<MAttrAnimElement | null>(null);
  const redAnimRef = useRef<MAttrAnimElement | null>(null);
  const aimRefs = [yellowAnimRef, greenAnimRef, blueAnimRef, pinkAnimRef, redAnimRef];

  const yellowCarRef = useRef<MModelElement | null>(null);
  const greenCarRef = useRef<MModelElement | null>(null);
  const blueCarRef = useRef<MModelElement | null>(null);
  const pinkCarRef = useRef<MModelElement | null>(null);
  const redCarRef = useRef<MModelElement | null>(null);
  const carRefs = [yellowCarRef, greenCarRef, blueCarRef, pinkCarRef, redCarRef];

  const yellowSoundRef = useRef<MAudioElement | null>(null);
  const greenSoundRef = useRef<MAudioElement | null>(null);
  const blueSoundRef = useRef<MAudioElement | null>(null);
  const pinkSoundRef = useRef<MAudioElement | null>(null);
  const redSoundRef = useRef<MAudioElement | null>(null);
  const carSoundRefs = [yellowSoundRef, greenSoundRef, blueSoundRef, pinkSoundRef, redSoundRef];

  const easings = ["easeInOutQuad", "easeInOutCubic", "easeInOutQuart"];
  const availableCars = ["yellow", "green", "blue", "pink", "red"];

  const availableCarsModels: Record<string, string> = {
    yellow: "/assets/guidedtour/f1_race_car_yellow.glb",
    green: "/assets/guidedtour/f1_race_car_green.glb",
    blue: "/assets/guidedtour/f1_race_car_blue.glb",
    pink: "/assets/guidedtour/f1_race_car_pink.glb",
    red: "/assets/guidedtour/f1_race_car_red.glb",
  };

  // const colorSaturation = "100%";
  // const colorLightness = "65%";
  // const carColors = [
  //   `hsl(72, ${colorSaturation}, ${colorLightness})`,
  //   `hsl(144, ${colorSaturation}, ${colorLightness})`,
  //   `hsl(216, ${colorSaturation}, ${colorLightness})`,
  //   `hsl(288, ${colorSaturation}, ${colorLightness})`,
  //   `hsl(380, ${colorSaturation}, ${colorLightness})`,
  // ];

  const setAnimRef = React.useCallback((animElement: MAttrAnimElement) => {
    animRef.current = animElement;
  }, []);

  const animateCars = () => {
    if (racing.current) return;
    racing.current = true;
    let smallestTime = 999999999999;
    const now = document.timeline.currentTime as number;

    availableCars.forEach((_car, index) => {
      const car = carRefs[index].current;
      const carSound = carSoundRefs[index].current;
      const animElement = aimRefs[index].current;

      if (!car || !carSound || !animElement) return;

      const time = randomInt(raceDuration - raceDuration * 0.1, raceDuration);
      const easing = randomArrayElement(easings);

      animElement.setAttribute("attr", "x");
      animElement.setAttribute("start", `${-trackLength / 2 + 1}`);
      animElement.setAttribute("end", `${trackLength / 2 - 1.5}`);
      animElement.setAttribute("start-time", `${now}`);
      animElement.setAttribute("end-time", `${now + time}`);
      animElement.setAttribute("duration", `${time}`);
      animElement.setAttribute("loop", "false");
      animElement.setAttribute("ping-pong", "false");
      animElement.setAttribute("easing", easing);

      const audioOffset = easing === "easeInOutQuad" ? 50 : easing === "easeInOutCubic" ? 250 : 350;
      carSound.setAttribute("volume", "1");
      carSound.setAttribute("start-time", `${now + audioOffset}`);
      carSound.setAttribute("pause-time", `${now + audioOffset + raceSoundDuration}`);

      setTimeout(() => {
        car.setAttribute("x", `${trackLength / 2 - 1.5}`);
        carSound.setAttribute("volume", "0");
      }, time);

      if (time < smallestTime) {
        smallestTime = time;
        winner.current = `Winner: ${availableCars[index]} (${(time / 1000).toFixed(3)}s)`;
        winnerIndex.current = index;
        setAnimRef(animElement);
      }
    });
    setTimeout(() => (racing.current = false), raceDuration + 100);
  };

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
          <m-attr-anim
            ref={aimRefs[index]}
            id={`${car}-anim`}
            attr="x"
            start={-trackLength / 2 + 1}
            end={trackLength / 2 - 1.5}
            start-time={0}
            duration={0}
            loop={false}
            easing="easeInOutQuad"
          ></m-attr-anim>
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
            tagAttributes={animAttributes}
            fontSize={25}
            color="#cccc33"
            emissive={12}
            tag="m-attr-anim"
          />
        </m-group>
      </m-group>
    </m-group>
  );
};
