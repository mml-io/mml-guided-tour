// eslint-disable-next-line import/default
import React from "react";

export function FloatingAnim({
  attr,
  start,
  end,
  duration,
}: {
  attr: string;
  start: number;
  end: number;
  duration: number;
}) {
  return (
    <m-attr-anim
      attr={attr}
      start={start}
      end={end}
      duration={duration}
      ping-pong="true"
      ping-pong-delay={duration / 10}
      loop="true"
      easing="easeInOutQuad"
    ></m-attr-anim>
  );
}
