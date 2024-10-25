import { MCubeElement, MPositionProbeElement } from "@mml-io/mml-react-types";
import * as React from "react";

const start = document.timeline.currentTime as number;

const gameDurationInMinutes = 4;

import glassStepSRC from "../assets/models/glass_step.glb";
import semiCylinderSRC from "../assets/models/semi_cylinder.glb";
import bgmSRC from "../assets/sounds/bgm_suspense.mp3";
import glassSFXA from "../assets/sounds/sfx_glass_A.mp3";
import glassSFXB from "../assets/sounds/sfx_glass_B.mp3";
import { Respawner } from "../components/respawner";
import { Teleporter } from "../components/teleporter";
import { Travelator } from "../components/travelator";

const glassSFX = [glassSFXA, glassSFXB];
const glassSFXDuration = [2328, 2136];

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
const Start = React.memo(({ x, y, z, width, height, depth, color }: StartProps) => {
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
      <m-model src={semiCylinderSRC} sy={0.1}></m-model>
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
const End = React.memo(({ x, y, z, width, height, depth, color, timer }: EndProps) => {
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
      <m-model src={semiCylinderSRC} sy={0.1} ry={180}></m-model>
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
const Rails = React.memo(
  ({ x, y, z, stepSizeX, stepGapX, length, thickness, color }: RailsProps) => {
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
  },
);
Rails.displayName = "Rails";

type StepProps = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  breakable: boolean;
  breakNow?: boolean;
  unbreakable?: boolean;
  debug?: boolean;
};
const Step = React.memo(
  ({ x, y, z, width, height, depth, breakable, breakNow, unbreakable, debug }: StepProps) => {
    const stepRef = React.useRef<MCubeElement | null>(null);
    const coinFlip = Math.random() > 0.5;

    const sfxSRC = coinFlip ? glassSFX[0] : glassSFX[1];
    const sfxDuration = coinFlip ? glassSFXDuration[0] : glassSFXDuration[1];

    const [breakTime, setBreakTime] = React.useState<string | number | undefined>(undefined);
    const [pauseTime, setPauseTime] = React.useState<string | number | undefined>(undefined);
    const [shouldCollide, setShouldCollide] = React.useState<boolean>(true);

    const handleBreak = React.useCallback(() => {
      if (unbreakable) {
        return;
      }
      const now = document.timeline.currentTime as number;
      setBreakTime(now);
      setPauseTime(now + 4000);
      setShouldCollide(false);
    }, [unbreakable]);

    React.useEffect(() => {
      if (breakNow) {
        const now = (document.timeline.currentTime as number) + Math.random() * 1000;
        setBreakTime(now);
        setPauseTime(now + 4000);
        setShouldCollide(false);
      }
    }, [breakNow]);

    React.useEffect(() => {
      const step = stepRef.current;
      if (step && breakable) {
        step.addEventListener("collisionstart", handleBreak);
      }
      return () => {
        if (step && breakable) {
          step.removeEventListener("collisionstart", handleBreak);
        }
      };
    }, [breakable, handleBreak]);

    return (
      <m-group x={x} y={y} z={z}>
        <m-cube
          ref={stepRef}
          width={width}
          height={height}
          depth={depth}
          collision-interval={breakable ? 20 : undefined}
          collide={shouldCollide}
          color={breakable ? "#550000" : "#000000"}
          visible={false}
        ></m-cube>
        <m-model
          src={glassStepSRC}
          collide={false}
          ry={coinFlip ? 180 : 0}
          anim={glassStepSRC}
          anim-start-time={breakTime}
          anim-pause-time={pauseTime}
          anim-loop={false}
        ></m-model>
        {breakable && (
          <m-audio
            src={sfxSRC}
            start-time={breakTime ? breakTime : start}
            pause-time={pauseTime ? pauseTime : start + sfxDuration}
            loop={false}
            volume={2}
            debug={debug}
          ></m-audio>
        )}
      </m-group>
    );
  },
);
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
  breakNow?: boolean;
  unbreakable?: boolean;
  debug?: boolean;
};
const Steps = React.memo(
  ({
    y,
    z,
    totalSteps,
    stepSizeX,
    stepSizeZ,
    stepGapX,
    stepGapZ,
    thickness,
    breakNow,
    unbreakable,
    debug,
  }: StepsProps) => {
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
                breakNow={breakNow}
                unbreakable={unbreakable}
                debug={debug}
              ></Step>
              <Step
                x={rightStepXPos}
                y={y ? y + yPos : yPos}
                z={z ? z + zPos : zPos}
                width={stepSizeX}
                height={thickness}
                depth={stepSizeZ}
                breakable={!coinFlip}
                breakNow={breakNow}
                unbreakable={unbreakable}
                debug={debug}
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
export const GlassBridgeGame = React.memo(({ x, y, z, ry, visibleTo }: GlassBridgeGameProps) => {
  const bridgeSteps = 7;

  const stepSizeZ = 3;
  const stepSizeX = 4.2;
  const stepGapX = 7;
  const stepGapZ = 6;
  const stepThickness = 0.1;

  const baseColor = "#aaaaaa";
  const baseDepth = 40;

  const debug = false;

  const railsLength = bridgeSteps * stepSizeZ + (bridgeSteps - 1) * stepGapZ + stepSizeZ;

  const [countDown, setCountDown] = React.useState<number | null>(null);

  const [gameStart, setGameStart] = React.useState<number | null>(null);
  const [gameEnd, setGameEnd] = React.useState<boolean>(false);
  const [resettingGame, setResettingGame] = React.useState<boolean>(false);

  const [breakNow, setBreakNow] = React.useState<boolean>(false);

  const startProbeRef = React.useRef<MPositionProbeElement | null>(null);
  const endProbeRef = React.useRef<MPositionProbeElement | null>(null);
  const timerTick = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const timer = React.useRef<number | null>(null);

  const winnersSet = React.useMemo(() => new Set<number>(), []);

  const handleGameEnd = React.useCallback(
    (event?: any) => {
      if (gameEnd === true || resettingGame === true || gameStart === null) {
        return;
      }
      if (winnersSet.has(event.detail.connectionId) && event !== undefined) {
        return;
      } else if (event !== undefined) {
        winnersSet.add(event.detail.connectionId);
      }
      if (timer.current !== null && timerTick.current !== undefined) {
        setGameEnd(true);
        setBreakNow(true);
        setTimeout(() => {
          setBreakNow(false);
          setResettingGame(true);
          setGameEnd(false);
          setTimeout(() => setResettingGame(false), 2000);
        }, 4000);
        clearInterval(timerTick.current);
        timerTick.current = undefined;
        timer.current = null;
        setCountDown(null);
        setGameStart(null);
      }
    },
    [gameEnd, gameStart, resettingGame, winnersSet],
  );

  const handleGameEndLeave = React.useCallback(
    (e: any) => {
      if (winnersSet.has(e.detail.connectionId)) {
        winnersSet.delete(e.detail.connectionId);
      }
    },
    [winnersSet],
  );

  const handleTick = React.useCallback(() => {
    timer.current = timer.current ? timer.current - 1000 : 0;
    if (timer.current <= 0) {
      handleGameEnd();
    }
    setCountDown(timer.current);
  }, [handleGameEnd]);

  const handleGameStart = React.useCallback(() => {
    if (resettingGame === true || gameEnd === true) {
      return;
    }
    if (timerTick.current === undefined) {
      setResettingGame(false);
      setGameStart(document.timeline.currentTime as number);
      timer.current = gameDurationInMinutes * 60 * 1000;
      timerTick.current = setInterval(handleTick, 1000);
    }
  }, [gameEnd, handleTick, resettingGame]);

  React.useEffect(() => {
    const startProbe = startProbeRef.current;
    const endProbe = endProbeRef.current;

    if (startProbe && endProbe) {
      startProbe.addEventListener("positionenter", handleGameStart);
      startProbe.addEventListener("positionmove", handleGameStart);
      endProbe.addEventListener("positionenter", handleGameEnd);
      endProbe.addEventListener("positionmove", handleGameEnd);
      endProbe.addEventListener("positionleave", handleGameEndLeave);
    }

    return () => {
      if (startProbe && endProbe) {
        startProbe.removeEventListener("positionenter", handleGameStart);
        startProbe.removeEventListener("positionmove", handleGameStart);
        endProbe.removeEventListener("positionenter", handleGameEnd);
        endProbe.removeEventListener("positionmove", handleGameEnd);
        endProbe.removeEventListener("positionleave", handleGameEndLeave);
      }
    };
  }, [handleGameEnd, handleGameEndLeave, handleGameStart]);

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
          z={0}
          totalSteps={bridgeSteps}
          stepSizeX={stepSizeX}
          stepSizeZ={stepSizeZ}
          stepGapX={stepGapX}
          stepGapZ={stepGapZ}
          thickness={stepThickness}
          breakNow={breakNow}
          unbreakable={gameStart === null}
          debug={debug}
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
        startX={-20}
        startY={0}
        startZ={-36}
        startRY={90}
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
      <m-audio
        src={bgmSRC}
        x={0}
        y={0}
        z={railsLength + baseDepth / 2}
        debug={debug}
        cone-angle={60}
        cone-falloff-angle={80}
        ry={180}
        rx={20}
        volume={4}
        start-time={gameStart ? gameStart : -100000}
        pause-time={gameStart ? undefined : (document.timeline.currentTime as number)}
      ></m-audio>
      <m-position-probe
        ref={startProbeRef}
        x={0}
        y={0}
        z={0}
        range={baseDepth / 4}
        debug={debug}
      ></m-position-probe>
      <m-position-probe
        ref={endProbeRef}
        x={0}
        y={0}
        z={railsLength + baseDepth / 2}
        range={baseDepth / 2}
        debug={debug}
      ></m-position-probe>
      <Travelator
        x={-20}
        y={0}
        z={-36.7}
        ry={0}
        width={10}
        depth={133}
        steps={20}
        travelTime={7000}
        reverse={false}
      />
    </m-group>
  );
});
GlassBridgeGame.displayName = "GlassBridgeGame";
