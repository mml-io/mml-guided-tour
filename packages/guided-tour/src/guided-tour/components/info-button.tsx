import * as React from "react";
import { memo, useCallback, useState } from "react";

type PlayButtonProps = {
  x?: number;
  y?: number;
  z?: number;
  ry?: number;
  infoAudioURL: string;
  infoAudioDuration: number;
  callback?: () => void;
};

export const InfoButton = memo(
  ({ x, y, z, ry, infoAudioURL, infoAudioDuration, callback }: PlayButtonProps) => {
    const sfxDuration = 1200;
    const buttonAnimDuration = 350;
    const easing = "easeInOutCubic";

    const now = document.timeline.currentTime as number;
    const [enabled, setEnabled] = useState<boolean>(true);
    const [animating, setAnimating] = useState<boolean>(false);

    const [sfxStartTime, setSFXStartTime] = useState<number>(now - sfxDuration);
    const [sfxPauseTime, setSFXPauseTime] = useState<number>(now);
    const [sfxVolume, setSFXVolume] = useState<number>(0);
    const [sfxPlaying, setSFXPlaying] = useState<boolean>(false);

    const [infoAudioStartTime, setInfoAudioStartTime] = useState<number>(now - sfxDuration);
    const [infoAudioPauseTime, setInfoAudioPauseTime] = useState<number>(now);
    const [infoAudioVolume, setInfoAudioVolume] = useState<number>(0);
    const [infoAudioPlaying, setInfoAudioPlaying] = useState<boolean>(false);

    const onURL = "/assets/guidedtour/floor_question_button_on.glb";
    const offURL = "/assets/guidedtour/floor_question_button_off.glb";
    const baseURL = "/assets/guidedtour/floor_button_base.glb";
    const sfxURL = "/assets/guidedtour/sfx_button.mp3";
    const infoAudio = infoAudioURL;

    const buttonTravel = 0.03;
    const onScale = enabled ? 1 : 0.001;
    const offScale = enabled ? 0.001 : 1;

    const playSFX = useCallback(() => {
      if (sfxPlaying) {
        return;
      }
      setSFXPlaying(true);
      setSFXVolume(1);
      setSFXStartTime(document.timeline.currentTime as number);
      setSFXPauseTime((document.timeline.currentTime as number) + sfxDuration);

      setTimeout(() => {
        setSFXVolume(0);
        setSFXPlaying(false);
      }, sfxDuration);
    }, [sfxPlaying]);

    const playInfoAudio = useCallback(() => {
      if (infoAudioPlaying) {
        return;
      }
      setInfoAudioPlaying(true);
      setInfoAudioVolume(1);
      setInfoAudioStartTime(document.timeline.currentTime as number);
      setInfoAudioPauseTime((document.timeline.currentTime as number) + infoAudioDuration);

      setTimeout(() => {
        setSFXVolume(0);
        setInfoAudioPlaying(false);
      }, infoAudioDuration);
    }, [infoAudioDuration, infoAudioPlaying]);

    const handlePress = useCallback(() => {
      playSFX();
      if (callback && typeof callback === "function") {
        callback();
      }
      setAnimating(true);
      setTimeout(() => playInfoAudio(), sfxDuration);
      setTimeout(() => setAnimating(false), buttonAnimDuration);
      setTimeout(() => setEnabled(false), buttonAnimDuration * 1.1);
      setTimeout(() => setEnabled(true), infoAudioDuration + sfxDuration);
    }, [playSFX, callback, infoAudioDuration, playInfoAudio]);

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
          volume={sfxVolume}
          start-time={sfxStartTime}
          pause-time={sfxPauseTime}
        ></m-audio>
        <m-audio
          src={infoAudio}
          loop={false}
          volume={infoAudioVolume}
          start-time={infoAudioStartTime}
          pause-time={infoAudioPauseTime}
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
  },
);
InfoButton.displayName = "InfoButton";
