import { MPositionProbeElement } from "@mml-io/mml-react-types";
import { memo, useRef } from "react";
import * as React from "react";

import { logos, posters } from "../assets";
import { RoomPoster } from "../components/room-poster";
import { renderAsMML } from "../helpers/render-as-mml";

type LinkElementProps = {
  x: number;
  y: number;
  z: number;
  ry: number;
  sx?: number;
  sy?: number;
  sz?: number;
  range: number;
  modelURL: string;
  href: string;
  startTime?: number;
  debug?: boolean;
};
const LinkElement = memo(
  ({ x, y, z, ry, sx, sy, sz, range, modelURL, href, startTime, debug }: LinkElementProps) => {
    const probeRef = useRef<MPositionProbeElement | null>(null);
    return (
      <m-link href={href}>
        <m-group x={x} y={y} z={z} ry={ry}>
          <m-position-probe ref={probeRef} range={range} debug={debug}></m-position-probe>
          <m-model src={modelURL} sx={sx} sy={sy} sz={sz} collide={false}>
            <m-attr-anim
              attr="y"
              start={0}
              end={0.2}
              duration={12000}
              loop={true}
              ping-pong={true}
              ping-pong-delay={600}
              easing="easeInOutSine"
              start-time={startTime}
            ></m-attr-anim>
          </m-model>
        </m-group>
      </m-link>
    );
  },
);
LinkElement.displayName = "LinkElement";

export function Room6() {
  const scale = 0.7;
  const socials = [logos.discord, logos.github, logos.www];
  const URLs = ["http://discord.gg/msquared", "https://github.com/mml-io/mml", "https://mml.io/"];
  const debug = false;
  return (
    <>
      <RoomPoster src={posters.whatsNext} />
      <m-group>
        <m-cube
          x={-12.6}
          y={3.1}
          z={22.7}
          width={5}
          height={6.2}
          depth={0.35}
          color="#777777"
        ></m-cube>
        <LinkElement
          x={0}
          y={0.5}
          z={0}
          sx={scale}
          sy={scale}
          sz={scale}
          ry={-90}
          range={15}
          modelURL={logos.mml}
          href="https://mmleditor.com/"
          debug={debug}
        ></LinkElement>
        {Array.from({ length: socials.length }).map((_, i) => {
          const elements = socials.length;
          const linkLogo = socials[i];
          const linkURL = URLs[i];

          const angleStep = Math.PI / elements;
          const angle = i * angleStep + 0.53;

          const radius = 15;
          const x = radius * Math.cos(angle);
          const y = 4;
          const z = radius * Math.sin(angle) + 5;
          const ry = -angle * (180 / Math.PI) - 90;

          return (
            <m-group key={i}>
              <LinkElement
                x={x}
                y={y}
                z={z}
                ry={ry}
                range={10}
                modelURL={linkLogo}
                href={linkURL}
                startTime={i * -1000}
                debug={debug}
              />
            </m-group>
          );
        })}
      </m-group>
    </>
  );
}

renderAsMML(<Room6 />);
