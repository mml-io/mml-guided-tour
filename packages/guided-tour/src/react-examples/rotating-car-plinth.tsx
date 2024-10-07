import { MAttrAnimElement } from "@mml-io/mml-react-types";
import * as React from "react";

import codeDisplay from "../assets/models/code_display.glb";
import car from "../assets/models/scifi_car.glb";
import carPlinth from "../assets/models/scifi_car_plinth.glb";
import carPlinthLeft from "../assets/models/scifi_car_plinth_left.glb";
import carPlinthRight from "../assets/models/scifi_car_plinth_right.glb";
import infoAudioURL from "../assets/sounds/sfx_info_m-attr-anim_02.mp3";
import { FloatingAnim } from "../components/floating-anim";
import { InfoButton } from "../components/info-button";
import { TagCodeCanvas } from "../components/tag-code-canvas";
import { useAttributes } from "../helpers/use-attributes";

type RotatingCarPlinthProps = {
  x?: number;
  y?: number;
  z?: number;
  ry?: number;
  visibleTo?: string | number;
};

export const RotatingCarPlinth = React.memo(
  ({ x, y, z, ry, visibleTo }: RotatingCarPlinthProps) => {
    const [animStart, setAnimStart] = React.useState<number>(0);
    const [animEnd, setAnimEnd] = React.useState<number>(360);
    const [startTime, setStartTime] = React.useState<number>(
      document.timeline.currentTime as number,
    );
    const [pauseTime, setPauseTime] = React.useState<string | number | undefined>(undefined);
    const [duration, setDuration] = React.useState<number>(10000);

    const [carRotation, setCarRotation] = React.useState<number>(0);
    const [rotationSpeed, setRotationSpeed] = React.useState<number>(1);
    const [pauseRatio, setPauseRatio] = React.useState<number | undefined>(undefined);

    const minRotationSpeed = -10;
    const maxRotationSpeed = 10;
    const unitDuration = 20000;

    const mounted = React.useRef<boolean>(false);
    const [animRef, setAnimRef] = React.useState<MAttrAnimElement | null>(null);

    const animAttributes = useAttributes(animRef || null);

    const adjustCarAnim = React.useCallback(
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

    React.useEffect(() => {
      if (mounted.current === false) {
        mounted.current = true;
        adjustCarAnim(0);
      }
    }, [adjustCarAnim]);

    return (
      <m-group x={x} y={y} z={z} ry={ry} visible-to={visibleTo}>
        <InfoButton x={-3} z={-5} ry={90} infoAudioURL={infoAudioURL} infoAudioDuration={21000} />
        <m-model src={carPlinth}></m-model>
        <m-model src={car} ry={carRotation}>
          <FloatingAnim attr="y" start={0.25} end={0.3} duration={13000} />
          <m-attr-anim
            ref={setAnimRef}
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
        <m-model id="button-left" src={carPlinthLeft} onClick={() => adjustCarAnim(-1)}></m-model>
        <m-model id="button-right" src={carPlinthRight} onClick={() => adjustCarAnim(+1)}></m-model>
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
          <m-model src={codeDisplay} sx={0.6} sy={0.6} sz={0.5} ry={180}></m-model>
          <m-group x={-0.3} y={2.03}>
            {animRef && animAttributes && (
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
  },
);
RotatingCarPlinth.displayName = "RotatingCarPlinth";
