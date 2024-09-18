import * as React from "react";
import { memo } from "react";

import particleTextureURL from "../assets/images/texture_particle.png";
import { randomFloatBetween } from "../helpers/js-helpers";

type ParticlesProps = {
  maxParticles: number;
  radius: number;
  height: number;
  duration: number;
};
export const Particles = memo(({ maxParticles, radius, height, duration }: ParticlesProps) => {
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const angleIncrement = Math.PI * 2 * goldenRatio;

  return (
    <m-group>
      {Array.from({ length: maxParticles }).map((_, i) => {
        const t = i / maxParticles;
        const inc = Math.acos(1 - 2 * t);
        const azimuth = angleIncrement * i;
        const x = radius * Math.sin(inc) * Math.cos(azimuth);
        const z = radius * Math.sin(inc) * Math.sin(azimuth);
        const animDuration = duration + Math.random() * duration;
        const startTime = (document.timeline.currentTime as number) - Math.random() * duration;
        return (
          <m-image
            key={i}
            src={particleTextureURL}
            x={x}
            y={-Math.random() * height}
            z={z}
            rx={randomFloatBetween(-45, 45)}
            ry={randomFloatBetween(-180, 180)}
            rz={randomFloatBetween(-45, 45)}
            width={randomFloatBetween(0.02, 0.06)}
            cast-shadows={false}
            emissive={200}
            collide={false}
          >
            <m-attr-anim
              attr="y"
              start={0}
              end={height - 1 + Math.random() * (height - 2)}
              duration={animDuration}
              start-time={startTime}
            ></m-attr-anim>
          </m-image>
        );
      })}
    </m-group>
  );
});
Particles.displayName = "Particles";
