import {
  MMLPositionEnterEvent,
  MMLPositionLeaveEvent,
  MMLPositionMoveEvent,
  MModelElement,
  MPositionProbeElement,
} from "@mml-io/mml-react-types";
import * as React from "react";

import duckModelURL from "../assets/models/duck.glb";

type TrackingDuckProps = {
  x?: number;
  y?: number;
  z?: number;
  sx?: number;
  sy?: number;
  sz?: number;
  ry?: number;
  visibleTo?: string;
};

export const TrackingDuck = React.memo(
  ({ x, y, z, sx, sy, sz, ry, visibleTo }: TrackingDuckProps) => {
    const positionProbeRef = React.useRef<MPositionProbeElement | null>(null);
    const duckRef = React.useRef<MModelElement | null>(null);
    const [updateInterval, setUpdateInterval] = React.useState<NodeJS.Timeout | null>(null);

    const [rotationY, setRotationY] = React.useState<number>(0);
    const [rotationZ, setRotationZ] = React.useState<number>(0);

    const players = React.useMemo(() => new Map(), []);

    const handleProbeEnterEvent = React.useCallback(
      (event: MMLPositionEnterEvent) => {
        const { connectionId } = event.detail;
        const { position } = event.detail.elementRelative;
        players.set(connectionId, position);
      },
      [players],
    );

    const handleProbeMoveEvent = React.useCallback(
      (event: MMLPositionMoveEvent) => {
        const { connectionId } = event.detail;
        const { position } = event.detail.elementRelative;
        players.set(connectionId, position);
      },
      [players],
    );

    const handleProbeLeaveEvent = React.useCallback(
      (event: MMLPositionLeaveEvent) => {
        const { connectionId } = event.detail;
        if (players.has(connectionId)) {
          players.delete(connectionId);
        }
      },
      [players],
    );

    const handleWindowDisconnectedEvent = React.useCallback(() => {
      window.addEventListener("disconnected", (event) => {
        const { connectionId } = event.detail;
        if (players.has(connectionId)) {
          players.delete(connectionId);
        }
      });
    }, [players]);

    React.useEffect(() => {
      const positionProbe = positionProbeRef.current;
      const duck = duckRef.current;
      if (positionProbe && duck) {
        positionProbeRef.current?.addEventListener("positionenter", handleProbeEnterEvent);
        positionProbeRef.current?.addEventListener("positionmove", handleProbeMoveEvent);
        positionProbeRef.current?.addEventListener("positionleave", handleProbeLeaveEvent);
        window.addEventListener("disconnected", handleWindowDisconnectedEvent);

        if (updateInterval === null) {
          const interval = setInterval(() => {
            let minDistance = 999999;
            let closestId = null;
            let distanceX = 0;
            let distanceY = 0;
            let distanceZ = 0;
            players.forEach((playerPosition, index) => {
              const { x, y, z } = playerPosition;
              const duckX = parseFloat(duck.getAttribute("x")!);
              const duckY = parseFloat(duck.getAttribute("y")!);
              const duckZ = parseFloat(duck.getAttribute("z")!);
              const distX = duckX - x;
              const distY = duckY - y;
              const distZ = duckZ - z;
              const distance = Math.sqrt(distX * distX + distZ * distZ);
              if (distance < minDistance) {
                minDistance = distance;
                closestId = index;
                distanceX = distX;
                distanceY = distY;
                distanceZ = distZ;
              }
            });
            if (closestId) {
              const angleRadians = Math.atan2(distanceX, distanceZ);
              const angleDegrees = angleRadians * (180 / Math.PI);
              setRotationY((angleDegrees + 75) % 360);
              const pitchRadians = Math.atan2(
                -distanceY,
                Math.sqrt(distanceX * distanceX + distanceZ * distanceZ),
              );
              const pitchDegrees = pitchRadians * (180 / Math.PI);
              setRotationZ((pitchDegrees - 30) % 360);
            }
          }, 500);
          setUpdateInterval(interval);
        }
      }

      return () => {
        if (positionProbe) {
          positionProbe.removeEventListener("positionenter", handleProbeEnterEvent);
          positionProbe.removeEventListener("positionmove", handleProbeMoveEvent);
          positionProbe.removeEventListener("positionleave", handleProbeLeaveEvent);
        }
        if (updateInterval) {
          clearInterval(updateInterval);
          setUpdateInterval(null);
        }
        window.removeEventListener("disconnected", handleWindowDisconnectedEvent);
      };
    }, [
      handleProbeEnterEvent,
      handleProbeLeaveEvent,
      handleProbeMoveEvent,
      handleWindowDisconnectedEvent,
      players,
      updateInterval,
    ]);

    return (
      <m-group x={x} y={y} z={z} sx={sx} sy={sy} sz={sz} ry={ry} visible-to={visibleTo}>
        <m-position-probe ref={positionProbeRef} range={200}></m-position-probe>
        <m-model
          ref={duckRef}
          src={duckModelURL}
          x={50}
          y={0}
          z={0}
          sx={15}
          sy={15}
          sz={15}
          rx={5}
          ry={rotationY}
          rz={rotationZ}
        >
          <m-attr-lerp attr="rx, ry, rz" duration={500} easing="easeInOutQuad"></m-attr-lerp>
          <m-attr-anim
            attr="sx"
            start="15"
            end="15.5"
            duration="10000"
            easing="easeInOutSine"
            ping-pong="true"
          ></m-attr-anim>
          <m-attr-anim
            attr="sy"
            start="15"
            end="15.5"
            duration="10000"
            easing="easeInOutSine"
            ping-pong="true"
          ></m-attr-anim>
          <m-attr-anim
            attr="sz"
            start="15"
            end="15.5"
            duration="10000"
            easing="easeInOutSine"
            ping-pong="true"
          ></m-attr-anim>
        </m-model>
      </m-group>
    );
  },
);
TrackingDuck.displayName = "TrackingDuck";
