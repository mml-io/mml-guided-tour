import * as React from "react";

type AnimationProps = {
  attr: string;
  start: number;
  end: number;
  duration: number;
  delay: number;
};
const Animation = React.memo(({ attr, start, end, duration, delay }: AnimationProps) => {
  return (
    <m-attr-anim
      attr={attr}
      start={start}
      end={end}
      duration={duration}
      loop={true}
      ping-pong={true}
      ping-pong-delay={delay}
      easing="easeInOutQuart"
    ></m-attr-anim>
  );
});
Animation.displayName = "Animation";

type MMLLogoProps = {
  x?: number;
  y?: number;
  z?: number;
  sx?: number;
  sy?: number;
  sz?: number;
  ry?: number;
  visibleTo?: string;
};
export const MMLLogo = React.memo(({ x, y, z, sx, sy, sz, ry, visibleTo }: MMLLogoProps) => {
  const duration = 21 * 1000;
  const delay = 7 * 1000;
  return (
    <m-group x={x} y={y} z={z} sx={sx} sy={sy} sz={sz} ry={ry} visible-to={visibleTo}>
      <m-group x="50" y="20" z="0" ry="-90" sx="3" sy="3" sz="3">
        <m-group id="logo">
          <m-group id="letters-holder" x="-1.7">
            <Animation attr="z" start={-5} end={0} duration={duration} delay={delay} />
            <Animation attr="sx" start={0} end={1} duration={duration} delay={delay} />
            <Animation attr="sy" start={0} end={1} duration={duration} delay={delay} />
            <m-group id="left-m" x="-5">
              <m-cube depth="0.25" color="#BB2649" x="-1.6" width="0.8" height="4"></m-cube>
              <m-cube depth="0.25" color="#BB2649" x="1.6" width="0.8" height="4"></m-cube>
              <m-cube
                depth="0.25"
                color="#BB2649"
                rz="45"
                x="-0.60"
                y="0.833"
                height="2.5"
                width="0.8"
              ></m-cube>
              <m-cube
                depth="0.25"
                color="#BB2649"
                rz="-45"
                x="0.60"
                y="0.833"
                height="2.5"
                width="0.8"
              ></m-cube>
            </m-group>
            <m-group id="middle-m">
              <m-cube depth="0.25" color="#FFA5B7" x="-1.6" width="0.8" height="4"></m-cube>
              <m-cube depth="0.25" color="#FFA5B7" x="1.6" width="0.8" height="4"></m-cube>
              <m-cube
                depth="0.25"
                color="#FFA5B7"
                rz="45"
                x="-0.60"
                y="0.833"
                height="2.5"
                width="0.8"
              ></m-cube>
              <m-cube
                depth="0.25"
                color="#FFA5B7"
                rz="-45"
                x="0.60"
                y="0.833"
                height="2.5"
                width="0.8"
              ></m-cube>
            </m-group>
            <m-group id="right-l" x="5">
              <m-cube depth="0.25" color="#1EBEB8" x="-1.6" width="0.8" height="4"></m-cube>
              <m-cube
                depth="0.25"
                color="#1EBEB8"
                y="-1.6"
                x="-0.4"
                height="0.8"
                width="3.2"
              ></m-cube>
            </m-group>
          </m-group>

          <m-group id="left-bracket-holder">
            <Animation attr="x" start={0} end={-9.5} duration={duration} delay={delay} />
            <Animation attr="rx" start={35.25} end={0} duration={duration} delay={delay} />
            <m-group id="left-bracket-wrapper">
              <Animation attr="sx" start={1} end={0.75} duration={duration} delay={delay} />
              <Animation attr="ry" start={45} end={0} duration={duration} delay={delay} />
              <m-group id="left-bracket">
                <Animation attr="rz" start={0} end={45} duration={duration} delay={delay} />
                <Animation attr="z" start={-2.5} end={0} duration={duration} delay={delay} />
                <m-cube depth="0.25" color="#F7F5DD" x="-2" height="5"></m-cube>
                <m-cube depth="0.25" color="#F7F5DD" y="2" width="5"></m-cube>
              </m-group>
            </m-group>
          </m-group>

          <m-group id="slash-holder">
            <Animation attr="rx" start={35.25} end={0} duration={duration} delay={delay} />
            <Animation attr="x" start={0} end={7} duration={duration} delay={delay} />
            <m-group id="slash-wrapper">
              <Animation attr="ry" start={45} end={0} duration={duration} delay={delay} />
              <Animation attr="rz" start={0} end={60} duration={duration} delay={delay} />
              <m-cube id="slash" width="5" height="0.5" depth="0.5" color="#F7F5DD">
                <Animation attr="rx" start={0} end={45} duration={duration} delay={delay} />{" "}
              </m-cube>
            </m-group>
          </m-group>

          <m-group id="right-bracket-holder">
            <Animation attr="sx" start={1} end={0.75} duration={duration} delay={delay} />
            <Animation attr="x" start={0} end={9.5} duration={duration} delay={delay} />
            <Animation attr="rx" start={35.25} end={0} duration={duration} delay={delay} />
            <m-group id="right-bracket-wrapper">
              <Animation attr="ry" start={45} end={0} duration={duration} delay={delay} />
              <m-group id="right-bracket">
                <Animation attr="rz" start={0} end={45} duration={duration} delay={delay} />
                <Animation attr="z" start={2.5} end={0} duration={duration} delay={delay} />
                <m-cube depth="0.25" color="#F7F5DD" x="2" height="5"></m-cube>
                <m-cube depth="0.25" color="#F7F5DD" y="-2" width="5"></m-cube>
              </m-group>
            </m-group>
          </m-group>
        </m-group>
      </m-group>
    </m-group>
  );
});
MMLLogo.displayName = "MMLLogo";
