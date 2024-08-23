import { MVideoElement } from "@mml-io/mml-react-types";
import * as React from "react";
import { memo, useCallback, useMemo, useState } from "react";

import { TagCodeCanvas } from "../components/tag-code-canvas";
import { useAttributes } from "../helpers/use-attributes";

type GamingVideoProps = {
  x?: number;
  y?: number;
  z?: number;
  ry?: number;
  visibleTo?: string | number;
};

type ControlButton = {
  name: string;
  icon: string;
  onClick: (name: string) => void;
};

export const GamingVideo = memo(({ x, y, z, ry, visibleTo }: GamingVideoProps) => {
  const [videoRef, setVideoRef] = useState<MVideoElement | null>(null);

  const [startedAt, setStartedAt] = useState<number>(0);
  const [lastPaused, setLastPaused] = useState<number>(0);

  const [startTime, setStartTime] = useState<number>(0);
  const [pauseTime, setPauseTime] = useState<number | undefined>(undefined);

  const attributes = useAttributes(videoRef);

  const videosAvailable = useMemo(
    () => ["/assets/guidedtour/sonic_ghz.mp4", "/assets/guidedtour/sonic_ss.mp4"],
    [],
  );

  const [videoIndex, setVideoIndex] = useState<number>(0);
  const [videoURL, setVideoURL] = useState<string>(videosAvailable[videoIndex]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [volume, setVolume] = useState<number>(0);

  const controlIcons = useMemo(
    () => [
      "/assets/guidedtour/texture_button_power.png",
      "/assets/guidedtour/texture_button_volup.png",
      "/assets/guidedtour/texture_button_next.png",
      "/assets/guidedtour/texture_button_pause.png",
      "/assets/guidedtour/texture_button_play.png",
    ],
    [],
  );

  const resumeVideo = useCallback(() => {
    if (pauseTime === undefined) {
      return;
    }
    const timeSincePaused = lastPaused - startedAt;
    const newStartedAt = (document.timeline.currentTime as number) - timeSincePaused;
    setStartedAt(newStartedAt);
    setStartTime(newStartedAt);
    setPauseTime(undefined);
  }, [lastPaused, pauseTime, startedAt]);

  const pauseVideo = useCallback(() => {
    if (pauseTime !== undefined) {
      return;
    }
    const newLastPaused = document.timeline.currentTime as number;
    setLastPaused(newLastPaused);
    setPauseTime(newLastPaused);
  }, [pauseTime]);

  const toggleVolume = useCallback(() => {
    setVolume(volume === 0 ? 1 : 0);
  }, [volume]);

  const nextVideo = useCallback(() => {
    const newIndex = videoIndex + 1 > videosAvailable.length - 1 ? 0 : videoIndex + 1;
    const newStartedAt = document.timeline.currentTime as number;

    setVideoIndex(newIndex);
    setVideoURL(videosAvailable[newIndex]);

    setStartedAt(newStartedAt);
    setStartTime(newStartedAt);
    setLastPaused(newStartedAt);

    setPauseTime(undefined);
  }, [videoIndex, videosAvailable]);

  const handleControlClick = useCallback(
    (name: string) => {
      switch (name) {
        case "power":
          break;
        case "volup":
          toggleVolume();
          break;
        case "next":
          nextVideo();
          break;
        case "pause":
          pauseVideo();
          break;
        case "play":
          resumeVideo();
          break;
        default:
          break;
      }
    },
    [nextVideo, pauseVideo, resumeVideo, toggleVolume],
  );

  const controlButtons: ControlButton[] = controlIcons.map((icon) => ({
    name: `${icon.split("_").pop()?.split(".").shift()}`,
    icon,
    onClick: handleControlClick,
  }));

  return (
    <m-group x={x} y={y} z={z} ry={ry} visible-to={visibleTo}>
      <m-group sx={2} sy={2} sz={2} x={-1.1} y={3.5} z={1.1} onClick={() => nextVideo()}>
        <m-video
          ref={setVideoRef}
          src={videoURL}
          volume={volume}
          ry={220}
          width={3.6}
          height={2.95}
          emissive={2}
          start-time={startTime}
          pause-time={pauseTime || undefined}
        ></m-video>
      </m-group>
      <m-group ry={180} x={-9.5} y={2.25} z={3.5}>
        <TagCodeCanvas
          tagAttributes={attributes}
          fontSize={30}
          color="#ffffaa"
          emissive={12}
          tag="m-video"
        />
      </m-group>
      <m-group id="controls" x={-1.1} y={1} z={3.5} sx={2} sy={2} sz={2}>
        {controlButtons &&
          controlButtons.map((control, index) => (
            <m-group
              key={index}
              x={-2}
              y={index * 0.35}
              z={0}
              sx={0.5}
              sy={0.5}
              sz={0.5}
              onClick={() => control.onClick(control.name)}
            >
              <m-cylinder
                radius={0.33}
                height={0.1}
                rx={90}
                z={0.1}
                color="#003300"
                opacity={0.8}
              ></m-cylinder>
              <m-image src={control.icon} width={0.5} height={0.5} emissive={7} ry={180}></m-image>
            </m-group>
          ))}
      </m-group>
    </m-group>
  );
});
GamingVideo.displayName = "GamingVideo";
