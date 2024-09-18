import * as React from "react";
import { useCallback, useState } from "react";

import { TwoWayWallButton } from "./two-way-wall-button";
import sfxURL from "../assets/sounds/sfx_door.mp3";

type DoorProps = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  wallThickness: number;
  invertButton?: boolean;
  color: string;
  animDuration: number;
};

export function Door({
  x,
  y,
  z,
  width,
  height,
  depth,
  wallThickness,
  invertButton,
  color,
  animDuration,
}: DoorProps) {
  const sfxDuration = 1200;
  const easing = "easeInOutQuint";
  const doorY = y + height / 2;

  const now = document.timeline.currentTime as number;
  const [opening, setOpening] = useState<boolean>(false);
  const [closing, setClosing] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [sfxStartTime, setSFXStartTime] = useState<number>(now - sfxDuration);
  const [sfxPauseTime, setSFXPauseTime] = useState<number>(now);
  const [sfxPlaying, setSFXPlaying] = useState<boolean>(false);

  const openTime = 5000;

  const playSFX = useCallback(() => {
    if (sfxPlaying) {
      return;
    }
    setSFXPlaying(true);

    setSFXStartTime(document.timeline.currentTime as number);
    setSFXPauseTime((document.timeline.currentTime as number) + sfxDuration);

    setTimeout(() => setSFXPlaying(false), sfxDuration);
  }, [sfxPlaying]);

  const openDoor = useCallback(() => {
    playSFX();
    setOpen(true);
    setOpening(true);

    setTimeout(() => setOpening(false), animDuration - 10);
    setTimeout(() => {
      playSFX();
      setClosing(true);
    }, animDuration + openTime);

    setTimeout(
      () => {
        setOpen(false);
        setClosing(false);
      },
      animDuration * 2 + openTime - 10,
    );
  }, [animDuration, playSFX]);

  const OpenAnim = useCallback(
    () => (
      <m-attr-anim
        attr="y"
        start={doorY}
        end={doorY + height}
        start-time={document.timeline.currentTime as number}
        pause-time={(document.timeline.currentTime as number) + animDuration}
        duration={animDuration}
        ping-pong={false}
        easing={easing}
      ></m-attr-anim>
    ),
    [animDuration, doorY, height],
  );

  const ClosingAnim = useCallback(
    () => (
      <m-attr-anim
        attr="y"
        start={doorY + height}
        end={doorY}
        start-time={document.timeline.currentTime as number}
        pause-time={(document.timeline.currentTime as number) + animDuration}
        duration={animDuration}
        ping-pong={false}
        easing={easing}
      ></m-attr-anim>
    ),
    [animDuration, doorY, height],
  );

  return (
    <m-group x={x} y={y} z={z}>
      <m-audio
        src={sfxURL}
        loop={false}
        start-time={sfxStartTime}
        pause-time={sfxPauseTime}
      ></m-audio>
      <m-cube
        y={!open ? doorY : doorY + height}
        width={width}
        height={height}
        depth={depth}
        color={color}
      >
        {opening && <OpenAnim />}
        {closing && <ClosingAnim />}
      </m-cube>
      <TwoWayWallButton
        x={!invertButton ? 3.36 : -3.3}
        y={y + 1.37}
        z={-0.2}
        scale={2.5}
        wallThickness={wallThickness}
        reEnableTime={animDuration * 2 + openTime}
        onOpen={() => {
          openDoor();
        }}
      />
    </m-group>
  );
}
