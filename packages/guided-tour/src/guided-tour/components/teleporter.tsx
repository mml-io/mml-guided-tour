import { MPositionProbeElement } from "@mml-io/mml-react-types";
import * as React from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import { Particles } from "./particles";

const teleporterBaseURL = "/assets/guidedtour/teleporter_base_plinth.glb";
const teleporterPlatformURL = "/assets/guidedtour/teleporter_platform.glb";
const teleporterSFXURL = "/assets/guidedtour/sfx_charge.mp3";

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
          setAnimatingEnd(true);

          setTimeout(() => {
            setAnimatingEnd(false);
            setStartAudioTime((document.timeline.currentTime as number) - sfxDuration);
            travelTimeOut.current = null;
          }, transporterAnimDuration * 2);
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

    return (
      <m-group visible-to={visibleTo}>
        <m-model
          id="platform-start"
          src={teleporterPlatformURL}
          x={animatingStart === false && travelTimeOut.current ? endX : startX}
          y={
            animatingStart === true
              ? transporterAnimTravel
              : travelTimeOut.current
                ? animatingEnd === true
                  ? endY - transporterAnimTravel / 2
                  : endY + transporterAnimTravel
                : startY
          }
          z={animatingStart === false && travelTimeOut.current ? endZ : startZ}
        >
          {(animatingStart === true || animatingEnd === true) && (
            <m-attr-lerp attr="y" duration={transporterAnimDuration}></m-attr-lerp>
          )}
        </m-model>
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
Teleporter.displayName = "AudioSequencer";
