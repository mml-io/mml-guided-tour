import { MVideoElement } from "@mml-io/mml-react-types";
import * as React from "react";

import next from "../assets/images/texture_button_next.png";
import pause from "../assets/images/texture_button_pause.png";
import play from "../assets/images/texture_button_play.png";
import power from "../assets/images/texture_button_power.png";
import volup from "../assets/images/texture_button_volup.png";
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
  enabled: boolean;
  onClick: (name: string) => void;
};

type ControlButtons = Map<string, ControlButton>;

export const GamingVideo = React.memo(({ x, y, z, ry, visibleTo }: GamingVideoProps) => {
  const controlIcons = React.useMemo(() => [power, volup, next, pause, play], []);
  const enabledEmissive = 12;
  const disabledEmissive = 0.1;
  const dimEmissive = 4.0;

  const [videoRef, setVideoRef] = React.useState<MVideoElement | null>(null);

  const [startedAt, setStartedAt] = React.useState<number>(0);
  const [lastPaused, setLastPaused] = React.useState<number>(0);

  const [startTime, setStartTime] = React.useState<number>(0);
  const [pauseTime, setPauseTime] = React.useState<number | undefined>(undefined);

  const [enabled, setEnabled] = React.useState<boolean>(true);

  const attributes = useAttributes(videoRef);

  const controlButtons: ControlButtons = React.useMemo(() => new Map(), []);
  const enabledButtons = React.useMemo(() => new Set(["power", "next", "pause"]), []);

  const videosAvailable = React.useMemo(
    () => ["/assets/guidedtour/sonic_ghz.mp4", "/assets/guidedtour/sonic_ss.mp4"],
    [],
  );

  const [videoIndex, setVideoIndex] = React.useState<number>(0);
  const [videoURL, setVideoURL] = React.useState<string>(videosAvailable[videoIndex]);
  const [volume, setVolume] = React.useState<number>(0);

  const resumeVideo = React.useCallback(() => {
    if (pauseTime === undefined || !enabled) {
      return;
    }

    if (!enabledButtons.has("pause")) enabledButtons.add("pause");
    if (enabledButtons.has("play")) enabledButtons.delete("play");

    const timeSincePaused = lastPaused - startedAt;
    const newStartedAt = (document.timeline.currentTime as number) - timeSincePaused;
    setStartedAt(newStartedAt);
    setStartTime(newStartedAt);
    setPauseTime(undefined);
  }, [enabled, enabledButtons, lastPaused, pauseTime, startedAt]);

  const pauseVideo = React.useCallback(() => {
    if (pauseTime !== undefined || !enabled) {
      return;
    }

    if (enabledButtons.has("pause")) enabledButtons.delete("pause");
    if (!enabledButtons.has("play")) enabledButtons.add("play");

    const newLastPaused = document.timeline.currentTime as number;
    setLastPaused(newLastPaused);
    setPauseTime(newLastPaused);
  }, [enabled, enabledButtons, pauseTime]);

  const toggleVolume = React.useCallback(() => {
    if (!enabled) {
      return;
    }
    setVolume(volume === 0 ? 1 : 0);
    if (!enabledButtons.has("volup") && volume === 0) {
      enabledButtons.add("volup");
    }
    if (enabledButtons.has("volup") && volume === 1) {
      enabledButtons.delete("volup");
    }
  }, [enabled, enabledButtons, volume]);

  const nextVideo = React.useCallback(() => {
    if (!enabled) {
      return;
    }
    const newIndex = videoIndex + 1 > videosAvailable.length - 1 ? 0 : videoIndex + 1;
    const newStartedAt = document.timeline.currentTime as number;

    setVideoIndex(newIndex);
    setVideoURL(videosAvailable[newIndex]);

    setStartedAt(newStartedAt);
    setStartTime(newStartedAt);
    setLastPaused(newStartedAt);
    setPauseTime(undefined);

    if (!enabledButtons.has("pause")) enabledButtons.add("pause");
    if (enabledButtons.has("play")) enabledButtons.delete("play");
  }, [enabled, enabledButtons, videoIndex, videosAvailable]);

  const togglePower = React.useCallback(() => {
    setEnabled(!enabled);
    if (enabled) {
      if (enabledButtons.has("power")) enabledButtons.delete("power");
    } else {
      if (!enabledButtons.has("power")) enabledButtons.add("power");
    }
  }, [enabled, enabledButtons]);

  const handleControlClick = React.useCallback(
    (name: string) => {
      switch (name) {
        case "power":
          togglePower();
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
    [nextVideo, pauseVideo, resumeVideo, togglePower, toggleVolume],
  );

  React.useEffect(() => {
    controlIcons.forEach((icon) => {
      const name = `${icon.split("_").pop()?.split(".").shift()}`;
      const enabled = ["power", "next", "pause", "volup"].includes(name);
      const button = {
        name,
        icon,
        enabled,
        onClick: handleControlClick,
      };
      controlButtons.set(name, button);
    });
  }, [controlButtons, controlIcons, handleControlClick]);

  return (
    <m-group x={x} y={y} z={z} ry={ry} visible-to={visibleTo}>
      <m-group sx={2} sy={2} sz={2} x={-1.1} y={3.5} z={1.1}>
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
          enabled={enabled}
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
          Array.from(controlButtons.values()).map((control, index) => (
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
              <m-image
                src={control.icon}
                width={0.5}
                height={0.5}
                emissive={
                  enabledButtons.has(control.name) && enabled
                    ? enabledEmissive
                    : (control.name === "volup" && enabled) || control.name === "power"
                      ? dimEmissive
                      : disabledEmissive
                }
                ry={180}
              ></m-image>
            </m-group>
          ))}
      </m-group>
    </m-group>
  );
});
GamingVideo.displayName = "GamingVideo";
