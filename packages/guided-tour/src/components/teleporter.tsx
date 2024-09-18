import { MPositionProbeElement } from "@mml-io/mml-react-types";
import * as React from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import { Particles } from "./particles";

const teleporterBaseURL = "/assets/guidedtour/teleporter_base_plinth.glb";
const teleporterPlatformURL = "/assets/guidedtour/teleporter_platform.glb";
const teleporterSFXURL = "/assets/guidedtour/sfx_charge.mp3";

type TransporterPlatformProps = {
  animatingStart: boolean;
  animatingEnd: boolean;
  shouldLerpY: boolean;
  transporterAnimTravel: number;
  transporterAnimDuration: number;
  startX: number;
  startY: number;
  startZ: number;
  endX: number;
  endY: number;
  endZ: number;
  travelTimeOut: NodeJS.Timeout | null;
};

const TransporterPlatform = memo(
  ({
    animatingStart,
    animatingEnd,
    shouldLerpY,
    transporterAnimTravel,
    transporterAnimDuration,
    startX,
    startY,
    startZ,
    endX,
    endY,
    endZ,
    travelTimeOut,
  }: TransporterPlatformProps) => {
    return (
      <m-model
        id="transporter-platform"
        src={teleporterPlatformURL}
        x={animatingStart === false && travelTimeOut ? endX : startX}
        y={
          animatingStart === true
            ? transporterAnimTravel
            : travelTimeOut
              ? animatingEnd === true
                ? endY - transporterAnimTravel
                : endY + transporterAnimTravel
              : startY
        }
        z={animatingStart === false && travelTimeOut ? endZ : startZ}
        visible={travelTimeOut !== null}
      >
        <m-attr-lerp
          attr={`${shouldLerpY ? "y" : undefined}`}
          duration={transporterAnimDuration}
        ></m-attr-lerp>
      </m-model>
    );
  },
);

TransporterPlatform.displayName = "TransporterPlatform";

type TeleporterProps = {
  startX: number;
  startY: number;
  startZ: number;
  startRY?: number;
  endX: number;
  endY: number;
  endZ: number;
  endRY?: number;
  visibleTo?: string | number;
};

export const Teleporter = memo(
  ({ startX, startY, startZ, startRY, endX, endY, endZ, endRY, visibleTo }: TeleporterProps) => {
    const baseYOffset = 0.6;
    const transporterAnimTravel = 0.103;
    const transporterAnimDuration = 1200;
    const probeRadius = 1.3;
    const probeYOffset = baseYOffset;
    const sfxDuration = 4000;

    const startProbeRef = useRef<MPositionProbeElement | null>(null);

    const [shouldLerpY, setShouldLerpY] = useState<boolean>(false);
    const [animatingStart, setAnimatingStart] = useState<boolean>(false);
    const [animatingEnd, setAnimatingEnd] = useState<boolean>(false);
    const [startAudioTime, setStartAudioTime] = useState<number>(
      (document.timeline.currentTime as number) - sfxDuration,
    );

    const travelTimeOut = useRef<NodeJS.Timeout | null>(null);

    const teleportToEnd = useCallback(() => {
      if (travelTimeOut.current === null) {
        travelTimeOut.current = setTimeout(() => {
          setAnimatingStart(false);

          setTimeout(() => setAnimatingEnd(true), transporterAnimDuration);

          setTimeout(() => {
            travelTimeOut.current = null;
            setAnimatingEnd(false);
            setStartAudioTime((document.timeline.currentTime as number) - sfxDuration);
          }, transporterAnimDuration * 2.5);
        }, transporterAnimDuration);

        setAnimatingStart(true);
        setStartAudioTime(document.timeline.currentTime as number);
      }
    }, [travelTimeOut]);

    useEffect(() => {
      const startProbe = startProbeRef.current;
      if (startProbe) {
        startProbe.addEventListener("positionenter", () => teleportToEnd());
        startProbe.addEventListener("positionmove", () => teleportToEnd());
      }
      return () => {
        if (startProbe) {
          startProbe.removeEventListener("positionenter", () => {});
          startProbe.removeEventListener("positionmove", () => {});
        }
      };
    }, [startProbeRef, teleportToEnd]);

    useEffect(() => {
      const isAnimating = animatingStart === true || animatingEnd === true;
      const shouldLerp = isAnimating && travelTimeOut.current !== null;
      setShouldLerpY(shouldLerp);
    }, [animatingEnd, animatingStart]);

    return (
      <m-group visible-to={visibleTo}>
        <TransporterPlatform
          animatingStart={animatingStart}
          animatingEnd={animatingEnd}
          shouldLerpY={shouldLerpY}
          transporterAnimTravel={transporterAnimTravel}
          transporterAnimDuration={transporterAnimDuration}
          startX={startX}
          startY={startY}
          startZ={startZ}
          endX={endX}
          endY={endY}
          endZ={endZ}
          travelTimeOut={travelTimeOut.current}
        />
        <m-model
          id="teleporter-start"
          src={teleporterBaseURL}
          x={startX}
          y={startY - baseYOffset}
          z={startZ}
          ry={startRY}
        >
          <Particles maxParticles={17} radius={1} height={4} duration={3000} />
          <m-audio
            src={teleporterSFXURL}
            volume={travelTimeOut.current ? 5 : 0}
            start-time={startAudioTime}
            pause-time={startAudioTime + sfxDuration}
            loop={false}
            y={15}
            rx={90}
            cone-angle={90}
            cone-falloff-angle={120}
          ></m-audio>
          <m-position-probe
            id="start-probe"
            ref={startProbeRef}
            y={probeYOffset}
            range={probeRadius}
            interval={250}
            debug={false}
          ></m-position-probe>
        </m-model>
        <m-model
          id="teleporter-end"
          src={teleporterBaseURL}
          x={endX}
          y={endY - baseYOffset}
          z={endZ}
          ry={endRY}
        >
          <m-audio
            src={teleporterSFXURL}
            volume={travelTimeOut.current ? 5 : 0}
            start-time={startAudioTime}
            pause-time={startAudioTime + sfxDuration}
            loop={false}
            y={15}
            rx={90}
            cone-angle={90}
            cone-falloff-angle={120}
          ></m-audio>
        </m-model>
      </m-group>
    );
  },
);

Teleporter.displayName = "Teleporter";
