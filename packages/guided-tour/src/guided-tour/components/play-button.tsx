import * as React from "react";
import { useCallback, useState } from "react";

type PlayButtonProps = {
  x?: number;
  y?: number;
  z?: number;
  ry?: number;
  reEnableTime: number;
  callback: () => void;
};

export function PlayButton({ x, y, z, ry, reEnableTime, callback }: PlayButtonProps): JSX.Element {
  const sfxDuration = 1200;
  const buttonAnimDuration = 350;
  const easing = "easeInOutCubic";

  const now = document.timeline.currentTime as number;
  const [enabled, setEnabled] = useState<boolean>(true);
  const [animating, setAnimating] = useState<boolean>(false);
  const [sfxStartTime, setSFXStartTime] = useState<number>(now - sfxDuration);
  const [sfxPauseTime, setSFXPauseTime] = useState<number>(now);
  const [sfxPlaying, setSFXPlaying] = useState<boolean>(false);

  const onURL = "/assets/guidedtour/floor_play_button_on.glb";
  const offURL = "/assets/guidedtour/floor_play_button_off.glb";
  const baseURL = "/assets/guidedtour/floor_button_base.glb";
  const sfxURL = "/assets/guidedtour/sfx_button.mp3";

  const buttonTravel = 0.03;
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
    playSFX();
    callback();
    setAnimating(true);
    setTimeout(() => setAnimating(false), buttonAnimDuration);
    setTimeout(() => setEnabled(false), buttonAnimDuration * 1.1);
    setTimeout(() => setEnabled(true), reEnableTime);
  }, [callback, playSFX, reEnableTime]);

  const PushAnimation = (): JSX.Element => (
    <>
      <m-attr-anim
        attr="y"
        start={0}
        end={-buttonTravel}
        start-time={document.timeline.currentTime as number}
        pause-time={(document.timeline.currentTime as number) + buttonAnimDuration}
        duration={buttonAnimDuration}
        ping-pong={true}
        easing={easing}
      ></m-attr-anim>
      <m-attr-anim
        attr="z"
        start={0}
        end={buttonTravel}
        start-time={document.timeline.currentTime as number}
        pause-time={(document.timeline.currentTime as number) + buttonAnimDuration}
        duration={buttonAnimDuration}
        ping-pong={true}
        easing={easing}
      ></m-attr-anim>
    </>
  );

  return (
    <m-group x={x} y={y} z={z} ry={ry}>
      <m-audio
        src={sfxURL}
        loop={false}
        start-time={sfxStartTime}
        pause-time={sfxPauseTime}
      ></m-audio>
      <m-model id="button-base" src={baseURL} />
      <m-model
        id="button-on"
        src={onURL}
        sx={onScale}
        sy={onScale}
        sz={onScale}
        onClick={handlePress}
      >
        {animating && <PushAnimation />}
      </m-model>
      <m-model id="button-off" src={offURL} sx={offScale} sy={offScale} sz={offScale} />
    </m-group>
  );
}
