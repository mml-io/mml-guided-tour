import { MModelElement } from "@mml-io/mml-react-types";
// eslint-disable-next-line import/default
import React, { useCallback, useEffect, useRef, useState } from "react";

import { FloatingAnim } from "../components/floating-anim";

export function RotatingCarPlinth({ x, y, z }: { x: number; y: number; z: number }) {
  const now = document.timeline.currentTime as number;
  const [labelContent, setLabelContent] = useState<string>("+1");

  const [animStart, setAnimStart] = useState<number>(0);
  const [animEnd, setAnimEnd] = useState<number>(360);
  const [duration, setDuration] = useState<number>(10000);

  const [startTime, setStartTime] = useState<number>(now);
  const [pauseTime, setPauseTime] = useState<string | number | undefined>(undefined);

  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [pauseRatio, setPauseRatio] = useState<number | undefined>(undefined);

  const minRotationSpeed = -10;
  const maxRotationSpeed = 10;
  const unitDuration = 20000;

  const carRef = useRef<MModelElement | null>(null);
  const mounted = useRef<boolean>(false);

  const adjustCarAnim = useCallback(
    (delta: number) => {
      const newRotationSpeed = rotationSpeed + delta;

      if (!(newRotationSpeed <= maxRotationSpeed && newRotationSpeed >= minRotationSpeed)) {
        return;
      }

      const currentTime = document.timeline.currentTime as number;
      let ratioThroughRotation, currentDuration, timeElapsed;
      if (pauseRatio !== undefined) {
        ratioThroughRotation = pauseRatio;
        if (newRotationSpeed < 0) {
          ratioThroughRotation = 1 - ratioThroughRotation;
        }
      } else {
        currentDuration = unitDuration / Math.abs(rotationSpeed);
        timeElapsed = currentTime - startTime;
        ratioThroughRotation = (timeElapsed % currentDuration) / currentDuration;
      }

      setLabelContent(`${newRotationSpeed > 0 ? "+" : ""}${newRotationSpeed}`);

      if (newRotationSpeed === 0) {
        if (rotationSpeed < 0) {
          ratioThroughRotation = 1 - ratioThroughRotation;
        }
        setPauseRatio(ratioThroughRotation);
        if (carRef.current) {
          carRef.current.setAttribute("ry", `${360 * ratioThroughRotation}`);
        }
        setPauseTime(document.timeline.currentTime as number);
      } else {
        setPauseRatio(undefined);
        const newDuration = unitDuration / Math.abs(newRotationSpeed);
        const negativeTime = ratioThroughRotation * newDuration;
        const animationTime = currentTime - negativeTime;
        setStartTime(animationTime);
        setPauseTime(undefined);
        setStartTime(animationTime);
        setAnimStart(newRotationSpeed < 0 ? 360 : 0);
        setAnimEnd(newRotationSpeed < 0 ? 0 : 360);
        setDuration(newDuration);
      }
      setRotationSpeed(newRotationSpeed);
      // updateAttributesLabel();
    },
    [minRotationSpeed, pauseRatio, rotationSpeed, startTime],
  );

  useEffect(() => {
    if (mounted.current === false) {
      mounted.current = true;
      adjustCarAnim(+1);
    }
  }, [adjustCarAnim]);

  const Label = useCallback(
    () => (
      <m-label
        id="display"
        color="#505050"
        font-color="#ffffff"
        padding="0"
        alignment="center"
        content={labelContent}
        rx="-90"
        rz="-90"
        ry="-45"
        width="0.3"
        height="0.2"
        y="0.17"
        x="-4.55"
        font-size="18"
      ></m-label>
    ),
    [labelContent],
  );

  return (
    <m-group x={x} y={y} z={z}>
      <m-model src="/assets/guidedtour/scifi_car_plinth.glb"></m-model>
      <m-model ref={carRef} src="/assets/guidedtour/scifi_car.glb">
        <FloatingAnim attr="y" start={0.25} end={0.3} duration={13000} />
        <m-attr-anim
          id="car-anim"
          attr="ry"
          start={animStart}
          end={animEnd}
          start-time={startTime}
          pause-time={pauseTime}
          duration={duration}
          loop="true"
        ></m-attr-anim>
      </m-model>
      <m-model
        id="button-left"
        src="/assets/guidedtour/scifi_car_plinth_left.glb"
        onClick={() => adjustCarAnim(-1)}
      ></m-model>
      <m-model
        id="button-right"
        src="/assets/guidedtour/scifi_car_plinth_right.glb"
        onClick={() => adjustCarAnim(+1)}
      ></m-model>
      <Label />
    </m-group>
  );
}
