import * as React from "react";
import { useCallback, useState } from "react";

type TwoWayWallButtonProps = {
  x: number;
  y: number;
  z: number;
  scale: number;
  reEnableTime: number;
  onOpen: () => void;
};

export const TwoWayWallButton = ({
  x,
  y,
  z,
  scale,
  reEnableTime,
  onOpen,
}: TwoWayWallButtonProps): JSX.Element => {
  const sfxDuration = 1200;
  const buttonAnimDuration = 350;
  const easing = "easeInOutCubic";

  const now = document.timeline.currentTime as number;
  const [enabled, setEnabled] = useState<boolean>(true);
  const [animating, setAnimating] = useState<boolean>(false);
  const [sfxStartTime, setSFXStartTime] = useState<number>(now - sfxDuration);
  const [sfxPauseTime, setSFXPauseTime] = useState<number>(now);
  const [sfxPlaying, setSFXPlaying] = useState<boolean>(false);

  const onURL = "/assets/guidedtour/door_open_button_on.glb";
  const offURL = "/assets/guidedtour/door_open_button_off.glb";
  const baseURL = "/assets/guidedtour/door_open_button_base.glb";
  const sfxURL = "/assets/guidedtour/sfx_button.mp3";

  const buttonTravel = 0.05;
  const onScale = enabled ? 1 : 0.001;
  const offScale = enabled ? 0.001 : 1;

  const playSFX = useCallback(() => {
    if (sfxPlaying) {
      return;
    }
    setSFXPlaying(true);

    setSFXStartTime(document.timeline.currentTime as number);
    setSFXPauseTime((document.timeline.currentTime as number) + sfxDuration);

    setTimeout(() => setSFXPlaying(false), sfxDuration);
  }, [sfxPlaying]);

  const handlePress = useCallback(() => {
    if (animating || !enabled) {
      return;
    }
    playSFX();
    onOpen();
    setAnimating(true);
    setTimeout(() => setAnimating(false), buttonAnimDuration);
    setTimeout(() => setEnabled(false), buttonAnimDuration * 1.1);
    setTimeout(() => setEnabled(true), reEnableTime);
  }, [animating, enabled, playSFX, onOpen, reEnableTime]);

  const PushAnimation = ({ zStart, zEnd }: { zStart: number; zEnd: number }): JSX.Element => (
    <m-attr-anim
      attr="z"
      start={zStart}
      end={zEnd}
      start-time={document.timeline.currentTime as number}
      pause-time={(document.timeline.currentTime as number) + buttonAnimDuration}
      duration={buttonAnimDuration}
      ping-pong={true}
      easing={easing}
    ></m-attr-anim>
  );

  return (
    <m-group>
      <m-audio
        src={sfxURL}
        loop={false}
        start-time={sfxStartTime}
        pause-time={sfxPauseTime}
      ></m-audio>
      <m-group x={x} y={y} z={z} sx={scale} sy={scale} sz={scale} onClick={handlePress}>
        <m-model id="front-base" src={baseURL} />
        <m-model id="front-on" src={onURL} sx={onScale} sy={onScale} sz={onScale}>
          {animating && <PushAnimation zStart={0.0} zEnd={buttonTravel} />}
        </m-model>
        <m-model id="front-off" src={offURL} sx={offScale} sy={offScale} sz={offScale}></m-model>
      </m-group>
    </m-group>
  );
};
