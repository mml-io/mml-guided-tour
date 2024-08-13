import { MAttrAnimElement } from "@mml-io/mml-react-types";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { FloatingAnim } from "../components/floating-anim";
import { TagCodeCanvas } from "../components/tag-code-canvas";
import { useAttributes } from "../helpers/use-attributes";

export function RotatingCarPlinth({ x, y, z }: { x: number; y: number; z: number }) {
  const [animStart, setAnimStart] = useState<number>(0);
  const [animEnd, setAnimEnd] = useState<number>(360);
  const [startTime, setStartTime] = useState<number>(document.timeline.currentTime as number);
  const [pauseTime, setPauseTime] = useState<string | number | undefined>(undefined);
  const [duration, setDuration] = useState<number>(10000);

  const [carRotation, setCarRotation] = useState<number>(0);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [pauseRatio, setPauseRatio] = useState<number | undefined>(undefined);

  const minRotationSpeed = -10;
  const maxRotationSpeed = 10;
  const unitDuration = 20000;

  const mounted = useRef<boolean>(false);
  const animRef = useRef<MAttrAnimElement | null>(null);

  const animAttributes = useAttributes(animRef);

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

      if (newRotationSpeed === 0) {
        if (rotationSpeed < 0) {
          ratioThroughRotation = 1 - ratioThroughRotation;
        }
        setPauseRatio(ratioThroughRotation);
        setCarRotation(360 * ratioThroughRotation);
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
    },
    [minRotationSpeed, pauseRatio, rotationSpeed, startTime],
  );

  useEffect(() => {
    if (mounted.current === false) {
      mounted.current = true;
      adjustCarAnim(0);
    }
  }, [adjustCarAnim]);

  return (
    <m-group x={x} y={y} z={z}>
      <m-model src="/assets/guidedtour/scifi_car_plinth.glb"></m-model>
      <m-model src="/assets/guidedtour/scifi_car.glb" ry={carRotation}>
        <FloatingAnim attr="y" start={0.25} end={0.3} duration={13000} />
        <m-attr-anim
          ref={animRef}
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
      <m-label
        id="rotation-speed-label"
        color="#505050"
        font-color="#ffffff"
        padding="0"
        alignment="center"
        content={`${rotationSpeed > 0 ? "+" : ""}${rotationSpeed}`}
        rx="-90"
        rz="-90"
        ry="-45"
        width="0.3"
        height="0.2"
        y="0.17"
        x="-4.55"
        font-size="18"
      ></m-label>
      <m-group x={3} z={-9} ry={-90}>
        <m-model
          src="/assets/guidedtour/code_display.glb"
          sx={0.6}
          sy={0.6}
          sz={0.5}
          ry={180}
        ></m-model>
        <m-group x={-0.3} y={2.03}>
          {animRef.current && animAttributes && (
            <TagCodeCanvas
              tagAttributes={animAttributes}
              fontSize={25}
              color="#cccc33"
              emissive={12}
              tag="m-attr-anim"
            />
          )}
        </m-group>
      </m-group>
    </m-group>
  );
}
