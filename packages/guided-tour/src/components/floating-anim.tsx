import * as React from "react";

type FloatingAnimProps = {
  attr: string;
  start: number;
  end: number;
  duration: number;
};

export function FloatingAnim({ attr, start, end, duration }: FloatingAnimProps): JSX.Element {
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
