import * as React from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

import { MemoryGame } from "../react-examples/memory-game";
import { RaceCars } from "../react-examples/race-cars";
import { RotatingCarPlinth } from "../react-examples/rotating-car-plinth";

function Room2Document() {
  return (
    <>
      <m-image
        src={"/assets/guidedtour/poster_animations.jpeg"}
        width={19}
        height={16}
        y={10}
        x={-17.87}
        z={0}
        ry={90}
      ></m-image>
      <RotatingCarPlinth x={11} />
      <RaceCars x={-12.5} z={-4} ry={-90} />
      <m-group x={5.5} z={21.7} ry={180}>
        <MemoryGame />
      </m-group>
    </>
  );
}

const container =
  document.getElementById("root") ?? document.body.appendChild(document.createElement("div"));
const root = createRoot(container);
flushSync(() => {
  root.render(<Room2Document />);
});
