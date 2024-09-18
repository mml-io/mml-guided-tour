import { MPositionProbeElement } from "@mml-io/mml-react-types";
import * as React from "react";

import plinthURL from "../assets/models/basic_plinth.glb";
import audio1URL from "../assets/sounds//video-first-interaction-01.mp3";
import audio2URL from "../assets/sounds/video-first-interaction-02.mp3";
import video1URL from "../assets/videos//video-first-interaction-01.mp4";
import video2URL from "../assets/videos/video-first-interaction-02.mp4";
import { PlayButton } from "../components/play-button";

type FirstInteractionProps = {
  x?: number;
  y?: number;
  z?: number;
  ry?: number;
  sx?: number;
  sy?: number;
};
const FirstInteraction = React.memo(({ x, y, z, ry, sx, sy }: FirstInteractionProps) => {
  const debug = false;
  const video1Length = 32000;
  const video2Length = 53050;

  const video1DurationInSeconds = 30.0;
  const video2DurationInSeconds = 47.0;
  const cubeAppearenceInSeconds = 14.75;
  const labelAppearenceInSeconds = 15.0;

  const visibleDepth = 0.01;
  const hiddenDepth = -0.02;

  const [demoRolling, setDemoRolling] = React.useState(false);
  const [clickCount, setClickCount] = React.useState(0);

  const [video1Start, setVideo1Start] = React.useState(-video1Length);
  const [video1Pause, setVideo1Pause] = React.useState(0);
  const [video1Volume, setVideo1Volume] = React.useState(0);
  const [video1Z, setVideo1Z] = React.useState(-0.01);

  const [video2Start, setVideo2Start] = React.useState(-video2Length);
  const [video2Pause, setVideo2Pause] = React.useState(0);
  const [video2Volume, setVideo2Volume] = React.useState(0);
  const [video2Z, setVideo2Z] = React.useState(-0.02);

  const [petLabelScale, setPetLabelScale] = React.useState(0);
  const [codeLabelScale, setCodeLabelScale] = React.useState(0);
  const [cubeScale, setCubeScale] = React.useState(0);
  const [cubeColor, setCubeColor] = React.useState("#bbbbbb");

  const playersProbeRef = React.useRef<MPositionProbeElement>(null);
  const usersInProbe = React.useRef<Set<number>>(new Set());

  const playVideo1 = React.useCallback(() => {
    const now = document.timeline.currentTime as number;
    const pauseTime = now + video1DurationInSeconds * 1000;
    setTimeout(() => setDemoRolling(true), 1000);
    setVideo1Start(now);
    setVideo1Pause(pauseTime);
    setVideo1Z(visibleDepth);
    setVideo1Volume(4);
    setTimeout(() => setCubeScale(1), cubeAppearenceInSeconds * 1000);
    setTimeout(
      () => setPetLabelScale(1),
      cubeAppearenceInSeconds * 1000 + labelAppearenceInSeconds * 1000,
    );
  }, [visibleDepth]);

  const stopFirstVideo = React.useCallback(() => {
    const now = document.timeline.currentTime as number;
    setVideo1Z(hiddenDepth);
    setVideo1Volume(0);
    setVideo1Start(now - video1DurationInSeconds * 1000);
    setVideo1Pause(now);
  }, [hiddenDepth]);

  const stopSecondVideo = React.useCallback(() => {
    const now = document.timeline.currentTime as number;
    setVideo2Z(hiddenDepth);
    setVideo2Volume(0);
    setPetLabelScale(0);
    setCodeLabelScale(0);
    setVideo2Start(now - video2DurationInSeconds * 1000);
    setVideo2Pause(now);
  }, [hiddenDepth]);

  const resetExample = React.useCallback(() => {
    stopFirstVideo();
    stopSecondVideo();
    setClickCount(0);
    setCubeScale(0);
    setPetLabelScale(0);
    setCodeLabelScale(0);
    setTimeout(() => setDemoRolling(false), 2100);
  }, [stopFirstVideo, stopSecondVideo]);

  const playVideo2 = React.useCallback(() => {
    const now = document.timeline.currentTime as number;
    const pauseTime = now + video2DurationInSeconds * 1000;
    setVideo2Z(visibleDepth);
    setVideo2Start(now);
    setVideo2Pause(pauseTime);
    setPetLabelScale(0);
    stopFirstVideo();
    setCubeColor("#bbbbbb");
    stopFirstVideo();
    setVideo2Volume(4);
    setTimeout(() => setCodeLabelScale(1), 15000);
    setTimeout(() => setCodeLabelScale(0), 30000);
    setTimeout(() => resetExample(), (video2DurationInSeconds + 1) * 1000);
  }, [resetExample, stopFirstVideo]);

  const handleCubeClick = React.useCallback(() => {
    if ((document.timeline.currentTime as number) > video1Pause && clickCount <= 2) {
      setClickCount((prev) => prev + 1);
      if (cubeColor !== "#FF77FF") {
        setCubeColor("#FF77FF");
      } else {
        setCubeColor("#55FFFF");
      }
      if (clickCount === 2) {
        setCubeScale(0.4);
        playVideo2();
      }
      console.log("clickCount", clickCount);
    }
  }, [clickCount, cubeColor, playVideo2, video1Pause]);

  React.useEffect(() => {
    if (playersProbeRef.current) {
      const probe = playersProbeRef.current;

      const handlePositionEnter = (event: any) => {
        if (!usersInProbe.current.has(event.detail.connectionId)) {
          usersInProbe.current.add(event.detail.connectionId);
        }
      };

      const handlePositionMove = (event: any) => {
        if (!usersInProbe.current.has(event.detail.connectionId)) {
          usersInProbe.current.add(event.detail.connectionId);
        }
      };

      const handlePositionLeave = (event: any) => {
        if (usersInProbe.current.has(event.detail.connectionId)) {
          usersInProbe.current.delete(event.detail.connectionId);
        }
      };

      const handleDisconnect = (event: any) => {
        if (usersInProbe.current.has(event.detail.connectionId)) {
          usersInProbe.current.delete(event.detail.connectionId);
        }
      };

      probe.addEventListener("positionenter", handlePositionEnter);
      probe.addEventListener("positionmove", handlePositionMove);
      probe.addEventListener("positionleave", handlePositionLeave);
      window.addEventListener("disconnected", handleDisconnect);

      return () => {
        if (probe) {
          probe.removeEventListener("positionenter", handlePositionEnter);
          probe.removeEventListener("positionmove", handlePositionMove);
          probe.removeEventListener("positionleave", handlePositionLeave);
        }
        window.removeEventListener("disconnected", handleDisconnect);
      };
    }
  }, []);

  const update = React.useCallback(() => {
    if (usersInProbe.current.size === 0) {
      if (demoRolling) {
        const now = document.timeline.currentTime as number;
        if (now > video1Pause + 10000 && clickCount === 0) {
          resetExample();
        }
      }
    }
  }, [clickCount, demoRolling, resetExample, video1Pause]);

  React.useEffect(() => {
    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, [update]);

  return (
    <m-group x={x} y={y} z={z} ry={ry} sx={sx} sy={sy}>
      <PlayButton
        x={2}
        y={y ? -y : 0}
        z={7}
        ry={0}
        callback={playVideo1}
        reEnableTime={1000}
        overrideReenable={demoRolling ? false : undefined}
      />
      <m-group id="screen-group" x={3.75} y={8.5} z={22.00036} ry={180} sx={2.5} sy={2.5}>
        <m-cube color="#707070" width={9.2} height={5.7} depth={0.03} z={-0.02}></m-cube>
        <m-cube color="#212121" width={9.0} height={5.5} depth={0.03} z={-0.01}></m-cube>
        <m-audio
          src={audio1URL}
          loop={false}
          start-time={video1Start}
          pause-time={video1Pause}
          volume={video1Volume}
          y={1}
          rx={20}
          cone-angle={70}
          cone-falloff-angle={180}
          debug={debug}
        ></m-audio>
        <m-audio
          src={audio2URL}
          loop={false}
          start-time={video2Start}
          pause-time={video2Pause}
          volume={video2Volume}
          y={1}
          rx={20}
          cone-angle={70}
          cone-falloff-angle={180}
          debug={debug}
        ></m-audio>
        <m-video
          src={video1URL}
          start-time={video1Start}
          pause-time={video1Pause}
          z={video1Z}
          y={0.05}
          width={8}
          height={4.5}
          volume={0}
          loop={false}
          emissive={1}
        ></m-video>
        <m-video
          src={video2URL}
          start-time={video2Start}
          pause-time={video2Pause}
          z={video2Z}
          y={0.05}
          width={8}
          height={4.5}
          volume={0}
          loop={false}
          emissive={1}
        ></m-video>
      </m-group>
      <m-group id="plinth-group" x={3.75} y={0.01} z={8} ry={90}>
        <m-position-probe ref={playersProbeRef} range={32} interval={1000}></m-position-probe>
        <m-model src={plinthURL}></m-model>
        <m-group id="cube-group">
          <m-group id="cube-label-group" y="0.2" z="1.5" sy={petLabelScale}>
            <m-attr-lerp attr="sy" easing="easeInOutQuad" duration={500}></m-attr-lerp>
            <m-attr-anim
              attr="rx"
              start="-3"
              end="3"
              duration="16000"
              loop="true"
              ping-pong="true"
              easing="easeInOutQuad"
            ></m-attr-anim>
            <m-label
              id="pet-label-back"
              x="-0.2"
              ry="90"
              padding="0"
              width="1"
              height="0.7"
              alignment="center"
              font-size="21"
              content={`I was pet ${clickCount} times ${clickCount === 0 ? "😢" : "😊"}`}
              color="black"
              font-color="white"
              emissive="3"
            ></m-label>
            <m-label
              id="pet-label-front"
              x="-0.199"
              ry="-90"
              padding="0"
              width="1"
              height="0.7"
              alignment="center"
              font-size="21"
              content={`I was pet ${clickCount} times ${clickCount === 0 ? "😢" : "😊"}`}
              color="black"
              font-color="white"
              emissive="3"
            ></m-label>
          </m-group>
          <m-group id="cube-code-group" x="0.5" y="0.5" z="2" sy={codeLabelScale}>
            <m-attr-lerp attr="sy" easing="easeInOutQuad" duration={500}></m-attr-lerp>
            <m-attr-anim
              attr="rx"
              start="-1"
              end="1"
              duration="16000"
              loop="true"
              ping-pong="true"
              easing="easeInOutQuad"
            ></m-attr-anim>
            <m-image
              src="/assets/guidedtour/img_first_cube_code.png"
              width="4"
              ry="110"
              collide="false"
              emissive="3"
            ></m-image>
          </m-group>
          <m-attr-anim
            attr={"y"}
            start={1.0}
            end={1.15}
            duration={8000}
            ping-pong={true}
            loop={true}
            easing="easeInOutQuad"
          ></m-attr-anim>
          <m-cube
            onClick={handleCubeClick}
            sx={cubeScale}
            sy={cubeScale}
            sz={cubeScale}
            color={cubeColor}
          >
            <m-attr-anim attr="rx" start={0} end={360} duration={30000} loop={true}></m-attr-anim>
            <m-attr-anim attr="ry" start={0} end={360} duration={20000} loop={true}></m-attr-anim>
            <m-attr-lerp attr="sx, sy, sz" easing="easeInOutQuad" duration={500}></m-attr-lerp>
          </m-cube>
        </m-group>
      </m-group>
    </m-group>
  );
});
FirstInteraction.displayName = "FirstInteraction";

export default FirstInteraction;
