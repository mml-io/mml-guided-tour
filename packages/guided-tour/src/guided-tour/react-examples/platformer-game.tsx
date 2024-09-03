import {
  MCubeElement,
  MCylinderElement,
  MMLCollisionMoveEvent,
  MMLCollisionStartEvent,
} from "@mml-io/mml-react-types";
import * as React from "react";
import { createRef, memo, useCallback, useEffect, useRef, useState } from "react";

import { Teleporter } from "../components/teleporter";
import { Travelator } from "../components/travelator";

type PlatformerGameProps = {
  x?: number;
  y?: number;
  z?: number;
  ry?: number;
  visibleTo?: string | number;
};

const platformerStartURL = "/assets/guidedtour/platformer_start.glb";
const platformerEndURL = "/assets/guidedtour/platformer_end.glb";
const platformerSpinnerURL = "/assets/guidedtour/platformer_spinner.glb";
const hammersBaseURL = "/assets/guidedtour/platformer_hammers_base.glb";
const hammersEdgeURL = "/assets/guidedtour/platformer_hammers_edge.glb";
const hammerURL = "/assets/guidedtour/platformer_hammer.glb";
const hexagonURL = "/assets/guidedtour/platformer_hexagon.glb";
const axesBaseURL = "/assets/guidedtour/platformer_axe_base.glb";
const axesRodURL = "/assets/guidedtour/platformer_axe_rod.glb";
const axesBladeURL = "/assets/guidedtour/platformer_axe_blade.glb";
const heliBodyURL = "/assets/guidedtour/platformer_heli_body.glb";
const heliBladeURL = "/assets/guidedtour/platformer_heli_blade.glb";
const bgmURL = "/assets/guidedtour/bgm_kabalevsky.mp3";

type StartProps = {
  x: number;
  y: number;
  z: number;
  ry?: number;
};
const Start = memo(({ x, y, z, ry }: StartProps) => {
  return (
    <m-group x={x} y={y} z={z} ry={ry}>
      <m-model src={platformerStartURL}></m-model>
    </m-group>
  );
});
Start.displayName = "Start";

type EndProps = {
  x: number;
  y: number;
  z: number;
  ry?: number;
};
const End = memo(({ x, y, z, ry }: EndProps) => {
  return (
    <m-group x={x} y={y} z={z} ry={ry}>
      <m-model src={platformerEndURL}></m-model>
    </m-group>
  );
});
End.displayName = "End";

type SpinnersProps = {
  x: number;
  y: number;
  z: number;
  width: number;
  depth: number;
  active: boolean;
};
const Spinners = memo(({ x, y, z, width, depth, active }: SpinnersProps) => {
  const spinnerRadius = 3.4999;
  const spinnerDiameter = spinnerRadius * 2;
  const hexHeight = (spinnerDiameter * Math.sqrt(3)) / 2;
  const numSpinnersX = Math.floor(width / spinnerDiameter);
  const numSpinnersZ = Math.floor(depth / hexHeight);

  return (
    <m-group ry={180}>
      {Array.from({ length: numSpinnersX }).map((_, j) => {
        return Array.from({ length: numSpinnersZ }).map((_, i) => {
          const spinnerRadius = 3.4999;
          const spinnerDiameter = spinnerRadius * 2;
          const hexHeight = (spinnerDiameter * Math.sqrt(3)) / 2;
          const numSpinnersX = Math.floor(width / spinnerDiameter);
          const numSpinnersZ = Math.floor(depth / hexHeight);

          const totalWidth = numSpinnersX * spinnerDiameter + spinnerRadius;
          const totalDepth = numSpinnersZ * hexHeight;
          const halfTotalWidth = totalWidth / 2;
          const halfRadius = spinnerRadius / 2;

          const ccw = (i + j) % 2 === 0;
          const xOffset = (j % 2) * spinnerRadius;
          const xPos = j * hexHeight - totalDepth / 2 + halfRadius;
          const zPos = i * spinnerDiameter + xOffset - halfTotalWidth + halfRadius;
          return (
            <m-group
              key={`${j}-${i}`}
              x={xPos + x}
              y={y}
              z={zPos - z}
              rx={ccw ? 180 : 0}
              rz={ccw ? 180 : 0}
            >
              <m-model src={platformerSpinnerURL}>
                {active && (
                  <m-attr-anim
                    attr="ry"
                    start={ccw ? 0 : 360}
                    end={ccw ? 360 : 0}
                    start-time={document.timeline.currentTime as number}
                    duration={2900}
                    loop={true}
                  ></m-attr-anim>
                )}
              </m-model>
            </m-group>
          );
        });
      })}
    </m-group>
  );
});
Spinners.displayName = "Spinners";

type HammersProps = {
  x: number;
  y: number;
  z: number;
  ry: number;
  difficulty: 1 | 2;
  active: boolean;
};
const Hammers = memo(({ x, y, z, ry, difficulty, active }: HammersProps) => {
  const xOffset = 6;
  const zOffset = 18;
  const baseSpeed = 2100;
  return (
    <m-group x={x} y={y} z={z} ry={ry}>
      {Array.from({ length: 2 }).map((_, i) => {
        return (
          <m-model key={i} src={hammersBaseURL} x={i === 0 ? -xOffset : xOffset} y={-3.5}>
            {Array.from({ length: 2 }).map((_, j) => {
              return (
                <m-model
                  key={j}
                  src={hammersEdgeURL}
                  y={0.01}
                  z={j === 0 ? -zOffset : zOffset}
                ></m-model>
              );
            })}
            {Array.from({ length: difficulty < 2 ? 7 : 14 }).map((_, k) => {
              const z = k * 3.75 * (difficulty < 2 ? 1 : 0.5) - 11.1;
              const coinFlip = Math.random() < 0.5;
              const speedOffsetMult = Math.random() * 300 * (coinFlip ? -1 : 1);
              const duration = baseSpeed + speedOffsetMult;
              return (
                <m-model key={k} src={hammerURL} z={z} sz={1.5}>
                  {active && (
                    <m-attr-anim
                      attr="rz"
                      start={coinFlip ? 0 : 360}
                      end={coinFlip ? 360 : 0}
                      start-time={(document.timeline.currentTime as number) - k * 300}
                      duration={duration}
                      loop={true}
                    ></m-attr-anim>
                  )}
                </m-model>
              );
            })}
          </m-model>
        );
      })}
    </m-group>
  );
});
Hammers.displayName = "Hammer";

type SineHexPlatformsProps = {
  x: number;
  y: number;
  z: number;
  ry: number;
  difficulty: 1 | 2;
  active: boolean;
};
const SineHexPlatforms = memo(({ x, y, z, ry, difficulty, active }: SineHexPlatformsProps) => {
  const platforms = 10;
  const hexOffset = 12;
  const duration = difficulty < 2 ? 12000 : 8000;
  const yAnimDuration = duration * (2 / 3);
  return (
    <m-group x={x} y={y} z={z} ry={ry}>
      {Array.from({ length: platforms }).map((_, i) => {
        return (
          <m-model key={i} src={hexagonURL} z={i * hexOffset}>
            {active && i < platforms - 1 && (
              <>
                <m-attr-anim
                  attr="x"
                  start={-6}
                  end={6}
                  duration={duration}
                  loop={true}
                  ping-pong={true}
                  easing="easeInOutSine"
                  start-time={(document.timeline.currentTime as number) - i * 1000}
                ></m-attr-anim>
                <m-attr-anim
                  attr="y"
                  start={0}
                  end={-0.5}
                  duration={yAnimDuration}
                  start-time={(document.timeline.currentTime as number) - i * 1000}
                  ping-pong={true}
                  easing={"easeInOutSine"}
                ></m-attr-anim>
              </>
            )}
          </m-model>
        );
      })}
    </m-group>
  );
});
SineHexPlatforms.displayName = "SineHexPlatforms";

type AxesPlatformProps = {
  x: number;
  y: number;
  z: number;
  ry: number;
  difficulty: 1 | 2;
  active: boolean;
};
const AxesPlatform = memo(({ x, y, z, ry, difficulty, active }: AxesPlatformProps) => {
  const totalAxes = 8;
  const axesSwingTime = difficulty < 2 ? 5000 : 3500;
  const zOffset = -17;
  let space = 4.4;
  return (
    <m-group x={x} y={y} z={z} ry={ry}>
      <m-model src={axesBaseURL}></m-model>
      {Array.from({ length: totalAxes }).map((_, i) => {
        if (i === 3) {
          space += 0.5;
        }
        return (
          <m-group key={i} z={i * space + zOffset} y={20}>
            {active && (
              <m-attr-anim
                attr="rz"
                start={-45}
                end={45}
                duration={axesSwingTime}
                loop={true}
                ping-pong={true}
                ping-pong-delay={difficulty < 2 ? axesSwingTime * 0.035 : 0}
                start-time={
                  (document.timeline.currentTime as number) - i * (difficulty < 2 ? 200 : 350)
                }
                easing={difficulty < 2 ? "easeInOutQuad" : "easeInOutSine"}
              ></m-attr-anim>
            )}
            <m-model src={axesRodURL} x={0}>
              <m-model src={axesBladeURL} y={0} sz={1.5}></m-model>
            </m-model>
          </m-group>
        );
      })}
    </m-group>
  );
});
AxesPlatform.displayName = "AxesPlatform";

type HelisProps = {
  y: number;
  z: number;
  amount: number;
  rowsDistance: number;
  active: boolean;
};
const Helis = memo(({ y, z, amount, rowsDistance, active }: HelisProps) => {
  const spacing = 21;
  return (
    <m-group>
      {Array.from({ length: 2 }).map((_, i) => {
        return (
          <m-group
            key={i}
            id={`heli-row-${i}`}
            x={i % 2 === 0 ? -rowsDistance : rowsDistance}
            y={y}
            z={z}
          >
            {Array.from({ length: amount }).map((_, j) => {
              return (
                <m-group key={j} z={j * spacing}>
                  <m-attr-anim
                    attr="y"
                    start={0}
                    end={1.3}
                    duration={7000}
                    loop={true}
                    start-time={(document.timeline.currentTime as number) - j * 1000}
                    ping-pong={true}
                    ping-pong-delay={350}
                    easing={"easeInOutSine"}
                  ></m-attr-anim>
                  <m-model src={heliBodyURL}></m-model>
                  <m-model src={heliBladeURL}>
                    {active && (
                      <m-attr-anim
                        attr="ry"
                        start={0}
                        end={360}
                        duration={250}
                        loop={true}
                        start-time={(document.timeline.currentTime as number) - j * 100}
                      ></m-attr-anim>
                    )}
                  </m-model>
                </m-group>
              );
            })}
          </m-group>
        );
      })}
    </m-group>
  );
});
Helis.displayName = "Helis";

type BackgroundMusicProps = {
  x: number;
  y: number;
  z: number;
  speakers: number;
  length: number;
  rowsDistance: number;
  volume: number;
  angle: number;
  fallOffAngle: number;
  active: boolean;
  debug?: boolean;
};
const BackgroundMusic = memo(
  ({
    x,
    y,
    z,
    speakers,
    length,
    rowsDistance,
    volume,
    angle,
    fallOffAngle,
    active,
    debug,
  }: BackgroundMusicProps) => {
    return (
      <m-group x={x} y={y} z={z}>
        {Array.from({ length: speakers }).map((_, i) => {
          return (
            <m-group key={i}>
              <m-audio
                x={-rowsDistance}
                z={(i * length) / speakers}
                src={bgmURL}
                volume={active ? volume : 0}
                loop={true}
                rx={90}
                ry={90}
                cone-angle={angle}
                cone-falloff-angle={fallOffAngle}
                debug={debug}
              ></m-audio>
              <m-audio
                x={rowsDistance}
                z={(i * length) / speakers}
                src={bgmURL}
                volume={active ? volume : 0}
                loop={true}
                rz={-90}
                ry={-90}
                cone-angle={angle}
                cone-falloff-angle={fallOffAngle}
                debug={debug}
              ></m-audio>
            </m-group>
          );
        })}
      </m-group>
    );
  },
);
BackgroundMusic.displayName = "BackgroundMusic";

type RespawnerProps = {
  distance: number;
  interval: number;
};
const Respawner = memo(({ distance, interval }: RespawnerProps) => {
  const width = 100000;
  const depth = 100000;
  const totalTransporters = 20;
  const transporterThickness = 0.01;

  const respawnerRef = useRef<MCubeElement>(null);

  const transportersRef = useRef<Array<React.RefObject<MCylinderElement>>>(
    Array.from({ length: totalTransporters }, () => createRef<MCylinderElement>()),
  );

  const [activeTransporterIndex, setActiveTransporterIndex] = useState(0);

  const animate = (
    element: HTMLElement,
    attr: string,
    start: number,
    end: number,
    duration: number,
    easing: string,
  ) => {
    const anim = document.createElement("m-attr-anim");
    anim.setAttribute("attr", attr);
    anim.setAttribute("start", `${start}`);
    anim.setAttribute("end", `${end}`);
    anim.setAttribute("start-time", `${document.timeline.currentTime}`);
    anim.setAttribute("end-time", `${(document.timeline.currentTime as number) + duration}`);
    anim.setAttribute("duration", `${duration}`);
    anim.setAttribute("easing", easing);
    anim.setAttribute("loop", "false");
    element.appendChild(anim);
    setTimeout(() => {
      element.setAttribute(attr, `${end}`);
      element.removeChild(anim);
    }, duration);
    return anim;
  };

  type Instructions = {
    attr: string;
    start: number;
    end: number;
  };
  type CallBackFunction = () => void;
  type Sequence = Array<Instructions | Array<Instructions>>;
  type ArrayOfFunctions = Array<CallBackFunction>;
  type ArrayOrFunction = CallBackFunction | Array<CallBackFunction>;

  const createSequence = useCallback(
    (
      element: HTMLElement,
      sequence: Sequence,
      easing: string,
      duration: number,
      pauses: number,
      loop = false,
    ) => {
      const timeAction = (cb: CallBackFunction, delay: number) => setTimeout(() => cb(), delay);

      const animSequence: Array<ArrayOrFunction> = [];

      for (let i = 0; i < sequence.length; i++) {
        const seq = sequence[i];
        if (Array.isArray(seq)) {
          const subSeqArr: ArrayOfFunctions = [];
          for (let j = 0; j < seq.length; j++) {
            const subSeq = seq[j];
            subSeqArr.push(() =>
              animate(element, subSeq.attr, subSeq.start, subSeq.end, duration, easing),
            );
          }
          animSequence.push(subSeqArr);
        } else {
          animSequence.push(() => animate(element, seq.attr, seq.start, seq.end, duration, easing));
        }
      }

      const seqSize = animSequence.length;
      const seqDuration = seqSize * duration + seqSize * pauses;

      const playSeq = () => {
        for (let i = 0; i < seqSize; i++) {
          const seqItem = animSequence[i];
          if (typeof seqItem === "function") {
            timeAction(seqItem, duration * i + pauses * i);
          } else if (Array.isArray(seqItem)) {
            for (let j = 0; j < seqItem.length; j++) {
              timeAction(seqItem[j], duration * i + pauses * i);
            }
          }
        }
      };

      playSeq();
      if (loop === true) {
        setInterval(() => playSeq(), seqDuration);
      } else {
        setTimeout(() => {
          element.setAttribute("x", "0");
          element.setAttribute("y", `${-distance - Math.random() * 2 - 1}`);
          element.setAttribute("z", "0");
          element.setAttribute("visible", "false");
        }, seqDuration + 100);
      }
    },
    [distance],
  );

  const randomIntPoN = (val: number) => {
    val = Math.abs(val);
    return Math.floor(Math.random() * (val * 2 + 1)) - val;
  };

  const handleRespawnerCollision = useCallback(
    (event: MMLCollisionStartEvent | MMLCollisionMoveEvent) => {
      const xPos = event.detail.position.x * depth;
      const yPos = -distance;
      const zPos = event.detail.position.z * width;
      let newTransporterIndex = activeTransporterIndex + 1;
      if (newTransporterIndex >= totalTransporters) {
        newTransporterIndex = 0;
      }
      const transporter = transportersRef.current[newTransporterIndex].current;
      if (transporter) {
        transporter.setAttribute("visible", "true");
        transporter.setAttribute("x", `${xPos}`);
        transporter.setAttribute("y", `${yPos}`);
        transporter.setAttribute("z", `${zPos}`);

        const targetY = 0;

        const coinFlip = Math.random() < 0.5;

        const firstX = (-10 - Math.random() * 20) * (coinFlip ? -1 : 1);
        const firstY = targetY - 15 + Math.random() * 20;
        const firstZ = -70 + randomIntPoN(10);

        const secondX = Math.random() * 10 * (coinFlip ? -1 : 1);
        const secondY = targetY + 20 + Math.random() * 10;
        const secondZ = -30 + Math.random() * 20;

        const finalX = randomIntPoN(12);
        const finalZ = randomIntPoN(10);

        const transportSequence = [
          [
            { attr: "x", start: xPos, end: firstX },
            { attr: "y", start: yPos, end: firstY },
            { attr: "z", start: zPos, end: firstZ },
          ],
          [
            { attr: "x", start: firstX, end: secondX },
            { attr: "y", start: firstY, end: secondY },
            { attr: "z", start: firstZ, end: secondZ },
          ],
          [
            { attr: "x", start: secondX, end: finalX },
            { attr: "y", start: secondY, end: targetY - transporterThickness * 2 },
            { attr: "z", start: secondZ, end: finalZ },
          ],
        ];
        createSequence(transporter, transportSequence, "easeInOutQuad", 2000, 0, false);

        setActiveTransporterIndex(newTransporterIndex);
      }
    },
    [activeTransporterIndex, createSequence, depth, distance, width],
  );

  useEffect(() => {
    const respawner = respawnerRef.current;
    if (respawner) {
      respawner.addEventListener("collisionstart", handleRespawnerCollision);
      respawner.addEventListener("collisionmove", handleRespawnerCollision);
    }
    return () => {
      if (respawner) {
        respawner.removeEventListener("collisionstart", handleRespawnerCollision);
        respawner.removeEventListener("collisionmove", handleRespawnerCollision);
      }
    };
  }, [depth, distance, handleRespawnerCollision, width]);

  return (
    <m-group id="respawner">
      <m-cube
        ref={respawnerRef}
        y={-distance}
        width={width}
        height={0.1}
        depth={depth}
        collision-interval={interval}
        opacity={0}
        visible={false}
      ></m-cube>
      {Array.from({ length: totalTransporters }).map((_, i) => {
        return (
          <m-cylinder
            radius={2}
            height={transporterThickness}
            x={0}
            y={-distance - i * 0.1}
            z={0}
            key={i}
            ref={transportersRef.current[i]}
            color="#4D96ED"
            visible={false}
          ></m-cylinder>
        );
      })}
    </m-group>
  );
});
Respawner.displayName = "Respawner";

export const PlatformerGame = memo(({ x, y, z, ry, visibleTo }: PlatformerGameProps) => {
  const yPos = 0;
  const active = true;
  const difficulty = 1;
  return (
    <m-group x={x} y={y} z={z} ry={ry} visible-to={visibleTo}>
      <Start x={0} y={yPos} z={0} />
      <BackgroundMusic
        x={0}
        y={yPos + 2}
        z={0}
        length={300}
        speakers={12}
        rowsDistance={30}
        volume={3}
        angle={90}
        fallOffAngle={130}
        active={active}
        debug={false}
      />
      <Helis y={yPos + 2} z={30} amount={8} rowsDistance={15} active={active} />
      <Spinners x={7.35} y={yPos} z={39.55} width={23} depth={35} active={active} />
      <Hammers x={0} y={yPos} z={75.6} ry={0} difficulty={difficulty} active={active} />
      <SineHexPlatforms x={0} y={yPos} z={100.15} ry={0} difficulty={difficulty} active={active} />
      <AxesPlatform x={0} y={yPos} z={233.2} ry={0} difficulty={difficulty} active={active} />
      <End x={0} y={yPos} z={270.9} ry={180} />
      <Travelator
        x={-20}
        y={yPos}
        z={-9.4}
        ry={0}
        width={10}
        depth={290}
        steps={30}
        travelTime={15000}
        reverse={false}
      />
      <Teleporter
        startX={-20}
        startY={0}
        startZ={-10}
        startRY={90}
        endX={x ? -x - 15 : -15}
        endY={y ? -y : 0}
        endZ={-6.5}
        endRY={180}
      />
      <Respawner distance={80} interval={200} />
    </m-group>
  );
});
PlatformerGame.displayName = "PlatformerGame";
