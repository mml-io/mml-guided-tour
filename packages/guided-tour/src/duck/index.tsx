/* eslint-disable import/default */
import { MAttrAnimElement, MModelElement } from "@mml-io/mml-react-types";
import React, { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

function Duck() {
  const [forward, setForward] = useState<boolean>(false);
  const modelRef = useRef<HTMLElement>();
  const animRef = useRef<HTMLElement>();

  const handleClick = useCallback(() => {
    if (animRef.current) {
      setForward(!forward);
      animRef.current.setAttribute("start", forward ? "0" : "360");
      animRef.current.setAttribute("end", forward ? "360" : "0");
    }
  }, [forward]);

  useEffect(() => {
    const model = modelRef.current;
    if (model) model.addEventListener("click", handleClick);
    return () => {
      if (model) model.removeEventListener("click", handleClick);
    };
  }, [forward, handleClick]);

  return (
    <m-model
      ref={modelRef as RefObject<MModelElement>}
      id="duck"
      src="https://public.mml.io/duck.glb"
      sx={2}
      sy={2}
      sz={2}
    >
      <m-attr-anim
        ref={animRef as RefObject<MAttrAnimElement>}
        attr="ry"
        start="0"
        end="360"
        duration={4000}
      ></m-attr-anim>
    </m-model>
  );
}

const container =
  document.getElementById("root") ?? document.body.appendChild(document.createElement("div"));
const root = createRoot(container);
flushSync(() => {
  root.render(<Duck />);
});
