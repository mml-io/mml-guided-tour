import {
  MCubeElement,
  MCylinderElement,
  MMLCollisionMoveEvent,
  MMLCollisionStartEvent,
} from "@mml-io/mml-react-types";
import * as React from "react";
import { createRef, memo, useCallback, useEffect, useRef, useState } from "react";

type Instructions = {
  attr: string;
  start: number;
  end: number;
};
type CallBackFunction = () => void;
type Sequence = Array<Instructions | Array<Instructions>>;
type ArrayOfFunctions = Array<CallBackFunction>;
type ArrayOrFunction = CallBackFunction | Array<CallBackFunction>;

export type AnimSequence = Array<ArrayOrFunction>;

type RespawnerProps = {
  distance: number;
  interval: number;
  transporterColor: string;
  landingXOffset?: number;
  landingZOffset?: number;
  landingXRange?: number;
  landingZRange?: number;
};
export const Respawner = memo(
  ({
    distance,
    interval,
    transporterColor,
    landingXOffset,
    landingZOffset,
    landingXRange,
    landingZRange,
  }: RespawnerProps) => {
    const width = 100000;
    const depth = 100000;
    const totalTransporters = 30;
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

        const animSequence: AnimSequence = [];

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
            animSequence.push(() =>
              animate(element, seq.attr, seq.start, seq.end, duration, easing),
            );
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

          const coinFlip = Math.random() < 0.5;

          const firstX = (-10 - Math.random() * 20) * (coinFlip ? -1 : 1);
          const firstY = -15 + Math.random() * 20;
          const firstZ = -70 + randomIntPoN(10);

          const secondX = Math.random() * 10 * (coinFlip ? -1 : 1);
          const secondY = +20 + Math.random() * 10;
          const secondZ = -30 + Math.random() * 20;

          const finalXRange = landingXRange ? randomIntPoN(landingXRange) : randomIntPoN(5);
          const finalZRange = landingZRange ? randomIntPoN(landingZRange) : randomIntPoN(5);

          const finalX = landingXOffset ? landingXOffset + finalXRange : finalXRange;
          const finalZ = landingZOffset ? landingZOffset + finalZRange : finalZRange;

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
              { attr: "y", start: secondY, end: -transporterThickness * 2 },
              { attr: "z", start: secondZ, end: finalZ },
            ],
          ];
          createSequence(transporter, transportSequence, "easeInOutQuad", 2000, 0, false);

          setActiveTransporterIndex(newTransporterIndex);
        }
      },
      [
        activeTransporterIndex,
        createSequence,
        distance,
        landingXOffset,
        landingXRange,
        landingZOffset,
        landingZRange,
      ],
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
              color={transporterColor}
              visible={false}
            ></m-cylinder>
          );
        })}
      </m-group>
    );
  },
);
Respawner.displayName = "Respawner";
