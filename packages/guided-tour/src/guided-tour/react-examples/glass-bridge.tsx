import { MPositionProbeElement } from "@mml-io/mml-react-types";
import * as React from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import { Respawner } from "../components/respawner";
import { Teleporter } from "../components/teleporter";

const millisecondsToTimeStamp = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

type StartProps = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: string;
};
const Start = memo(({ x, y, z, width, height, depth, color }: StartProps) => {
  return (
    <m-group x={x} y={y} z={z}>
      <m-cube
        width={width}
        height={height}
        depth={depth}
        x={0}
        y={-height / 2}
        z={-depth / 2}
        color={color}
      ></m-cube>
    </m-group>
  );
});
Start.displayName = "Start";

type EndProps = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: string;
  timer?: number | null | undefined;
};
const End = memo(({ x, y, z, width, height, depth, color, timer }: EndProps) => {
  return (
    <m-group x={x} y={y} z={z}>
      <m-cube
        width={width}
        height={height}
        depth={depth}
        x={0}
        y={-height / 2}
        z={depth / 2}
        color={color}
      ></m-cube>
      <m-cube
        width={timer ? width : 0}
        height={timer ? depth / 4 : 0}
        depth={timer ? 0.1 : 0}
        x={0}
        y={depth / 2}
        z={depth / 2}
      >
        <m-label
          alignment="center"
          padding="false"
          width={timer ? width - 1 : 0}
          height={timer ? depth / 4 - 1 : 0}
          content={timer ? millisecondsToTimeStamp(timer) : ""}
          font-size={650}
          font-color="#aaffaa"
          color="black"
          emissive={12}
          z={-1}
          ry={180}
        >
          <m-attr-lerp attr="all" easing="easeInOutQuad" duration={700}></m-attr-lerp>
        </m-label>
        <m-attr-lerp attr="all" easing="easeInOutQuad" duration={700}></m-attr-lerp>
      </m-cube>
    </m-group>
  );
});
End.displayName = "End";

type RailsProps = {
  x?: number;
  y?: number;
  z?: number;
  steps: number;
  stepSizeX: number;
  stepSizeZ: number;
  stepGapX: number;
  stepGapZ: number;
  length: number;
  thickness: number;
  color?: string;
};
const Rails = memo(({ x, y, z, stepSizeX, stepGapX, length, thickness, color }: RailsProps) => {
  const zPos = z ? z + length / 2 : length / 2;
  return (
    <m-group x={x} z={z}>
      {Array.from({ length: 4 }).map((_, i) => {
        const xPos = i % 2 === 0 ? -stepGapX / 2 : stepGapX / 2;
        return (
          <m-group key={i}>
            <m-cube
              x={xPos - stepSizeX / 2 - thickness / 2}
              y={y ? y - thickness / 2 : -thickness / 2}
              z={zPos}
              width={thickness}
              height={thickness}
              depth={length}
              color={color ? color : "#aaaaaa"}
              collide={false}
            />
            <m-cube
              x={xPos + stepSizeX / 2 + thickness / 2}
              y={y ? y - thickness / 2 : -thickness / 2}
              z={zPos}
              width={thickness}
              height={thickness}
              depth={length}
              color={color ? color : "#aaaaaa"}
              collide={false}
            />
          </m-group>
        );
      })}
      ;
    </m-group>
  );
});
Rails.displayName = "Rails";

type StepProps = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  breakable: boolean;
};
const Step = memo(({ x, y, z, width, height, depth, breakable }: StepProps) => {
  return (
    <m-group x={x} y={y} z={z}>
      <m-cube
        width={width}
        height={height}
        depth={depth}
        color={breakable ? "#000000" : "#550000"}
      ></m-cube>
    </m-group>
  );
});
Step.displayName = "Step";

type StepsProps = {
  y?: number;
  z?: number;
  totalSteps: number;
  stepSizeX: number;
  stepSizeZ: number;
  stepGapX: number;
  stepGapZ: number;
  thickness: number;
};
const Steps = memo(
  ({ y, z, totalSteps, stepSizeX, stepSizeZ, stepGapX, stepGapZ, thickness }: StepsProps) => {
    return (
      <m-group>
        {Array.from({ length: totalSteps }).map((_, i) => {
          const leftStepXPos = i % 2 === 0 ? -stepGapX / 2 : stepGapX / 2;
          const rightStepXPos = i % 2 !== 0 ? -stepGapX / 2 : stepGapX / 2;
          const yPos = -thickness / 2;
          const zPos = stepSizeZ + i * stepSizeZ + i * stepGapZ;
          const coinFlip = Math.random() > 0.5;
          return (
            <m-group key={i}>
              <Step
                x={leftStepXPos}
                y={y ? y + yPos : yPos}
                z={z ? z + zPos : zPos}
                width={stepSizeX}
                height={thickness}
                depth={stepSizeZ}
                breakable={coinFlip}
              ></Step>
              <Step
                x={rightStepXPos}
                y={y ? y + yPos : yPos}
                z={z ? z + zPos : zPos}
                width={stepSizeX}
                height={thickness}
                depth={stepSizeZ}
                breakable={!coinFlip}
              ></Step>
            </m-group>
          );
        })}
      </m-group>
    );
  },
);
Steps.displayName = "Steps";

type GlassBridgeGameProps = {
  x?: number;
  y?: number;
  z?: number;
  ry?: number;
  visibleTo?: string;
};
export const GlassBridgeGame = memo(({ x, y, z, ry, visibleTo }: GlassBridgeGameProps) => {
  const bridgeSteps = 7;

  const stepSizeZ = 4.2;
  const stepSizeX = 3.5;
  const stepGapX = 7;
  const stepGapZ = 6;
  const stepThickness = 0.1;

  const baseColor = "#aaaaaa";
  const baseDepth = 40;

  const railsLength = bridgeSteps * stepSizeZ + (bridgeSteps - 1) * stepGapZ + stepSizeZ;

  const [countDown, setCountDown] = useState<number | null>(null);
  const [resettingGame, setResettingGame] = useState<boolean>(false);

  const startProbeRef = useRef<MPositionProbeElement | null>(null);
  const endProbeRef = useRef<MPositionProbeElement | null>(null);
  const timerTick = useRef<NodeJS.Timeout | undefined>(undefined);
  const timer = useRef<number | null>(null);

  const handleGameEnd = useCallback(() => {
    if (timer.current !== null && timerTick.current !== undefined) {
      console.log("Game ended!");
      setTimeout(() => {
        setResettingGame(true);
        console.log(`resseting game... ${resettingGame}`);
        setTimeout(() => setResettingGame(false), 2000);
      }, 4000);
      clearInterval(timerTick.current);
      timerTick.current = undefined;
      timer.current = null;
      setCountDown(null);
    }
  }, [resettingGame]);

  const handleTick = useCallback(() => {
    timer.current = timer.current ? timer.current - 1000 : 0;
    if (timer.current <= 0) {
      console.log("Time out!");
      handleGameEnd();
    }
    setCountDown(timer.current);
  }, [handleGameEnd]);

  const handleGameStart = useCallback(() => {
    if (timerTick.current === undefined) {
      console.log("Game started!");
      timer.current = 1 * 10 * 1000;
      timerTick.current = setInterval(handleTick, 1000);
    }
  }, [handleTick]);

  useEffect(() => {
    const startProbe = startProbeRef.current;
    const endProbe = endProbeRef.current;

    if (startProbe && endProbe) {
      startProbe.addEventListener("positionenter", handleGameStart);
      startProbe.addEventListener("positionmove", handleGameStart);
      endProbe.addEventListener("positionenter", handleGameEnd);
      endProbe.addEventListener("positionmove", handleGameEnd);
    }

    return () => {
      if (startProbe && endProbe) {
        startProbe.removeEventListener("positionenter", handleGameStart);
        startProbe.removeEventListener("positionmove", handleGameStart);
        endProbe.removeEventListener("positionenter", handleGameEnd);
        endProbe.removeEventListener("positionmove", handleGameEnd);
      }
    };
  }, [handleGameEnd, handleGameStart]);

  return (
    <m-group x={x} y={y} z={z} ry={ry} visible-to={visibleTo}>
      <Start
        x={0}
        y={0}
        z={-0.05}
        width={baseDepth - 10}
        height={0.1}
        depth={baseDepth}
        color={baseColor}
      />
      <Rails
        x={0}
        z={0}
        steps={bridgeSteps}
        stepSizeX={stepSizeX}
        stepSizeZ={stepSizeZ}
        stepGapX={stepGapX}
        stepGapZ={stepGapZ}
        length={railsLength}
        thickness={stepThickness}
      />
      {resettingGame === false && (
        <Steps
          totalSteps={bridgeSteps}
          z={0}
          stepSizeX={stepSizeX}
          stepSizeZ={stepSizeZ}
          stepGapX={stepGapX}
          stepGapZ={stepGapZ}
          thickness={stepThickness}
        />
      )}
      <End
        x={0}
        y={0}
        z={railsLength}
        width={baseDepth - 10}
        height={0.1}
        depth={baseDepth}
        color={baseColor}
        timer={countDown}
      />
      <Teleporter
        startX={0}
        startY={0}
        startZ={railsLength + baseDepth / 2}
        startRY={-90}
        endX={x ? -x - 15 : -15}
        endY={y ? -y : 0}
        endZ={-2.25}
        endRY={180}
      />
      <Respawner
        distance={80}
        interval={200}
        transporterColor={baseColor}
        landingXRange={Math.floor(baseDepth * 0.3)}
        landingZRange={Math.floor(baseDepth * 0.25)}
        landingZOffset={-baseDepth / 2}
      />
      <m-position-probe
        ref={startProbeRef}
        x={0}
        y={0}
        z={0}
        range={baseDepth / 4}
      ></m-position-probe>
      <m-position-probe
        ref={endProbeRef}
        x={0}
        y={0}
        z={railsLength + baseDepth / 2}
        range={baseDepth / 2}
      ></m-position-probe>
    </m-group>
  );
});
GlassBridgeGame.displayName = "GlassBridgeGame";
