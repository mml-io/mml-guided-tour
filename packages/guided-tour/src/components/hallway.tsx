import { MModelElement } from "@mml-io/mml-react-types";
import * as React from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import { Door } from "./door";
import hallway from "../assets/models/hallway.glb";
import secretDoorURL from "../assets/models/hallway_secret_wall.glb";

type HallwayProps = {
  x: number;
  y: number;
  z: number;
};

const SecterDoor = memo(() => {
  const secretDoorRef = useRef<MModelElement | null>(null);
  const animating = useRef<boolean>(false);
  const [doorOpen, setDoorOpen] = useState(false);

  const handleClick = useCallback(() => {
    if (animating.current) return;
    animating.current = true;
    setDoorOpen(true);
    setTimeout(() => {
      setDoorOpen(false);
      setTimeout(() => {
        animating.current = false;
      }, 5000);
    }, 5000);
  }, []);

  useEffect(() => {
    const secretDoor = secretDoorRef.current;
    if (secretDoor) {
      secretDoor.addEventListener("click", handleClick);
    }

    return () => {
      if (secretDoor) {
        secretDoor.removeEventListener("click", handleClick);
      }
    };
  }, [handleClick]);

  return (
    <m-group>
      <m-model
        ref={secretDoorRef}
        src={secretDoorURL}
        y={doorOpen ? 4 : 0}
        sx={doorOpen ? 1.003 : 1}
      >
        {animating.current && (
          <m-attr-lerp attr="all" easing="easeInOutQuad" duration={2000}></m-attr-lerp>
        )}
      </m-model>
    </m-group>
  );
});
SecterDoor.displayName = "SecterDoor";

export const Hallway = memo(({ x, y, z }: HallwayProps) => {
  const doorWidth = 5;
  const doorHeight = 6;
  const doorDepth = 0.1;
  const doorColor = "#707070";

  const doorAnimDuration = 1050;

  return (
    <m-group x={x} y={y} z={z}>
      <m-model src={hallway} sx={0.9999}></m-model>
      <SecterDoor />
      <Door
        x={-12.5}
        y={0}
        z={-4.13}
        width={doorWidth}
        height={doorHeight}
        depth={doorDepth}
        wallThickness={0.65}
        color={doorColor}
        animDuration={doorAnimDuration}
      />
      <Door
        x={12.5}
        y={0}
        z={3.85}
        width={doorWidth}
        height={doorHeight}
        depth={doorDepth}
        wallThickness={0.99}
        invertButton={true}
        color={doorColor}
        animDuration={doorAnimDuration}
      />
    </m-group>
  );
});
Hallway.displayName = "Hallway";
