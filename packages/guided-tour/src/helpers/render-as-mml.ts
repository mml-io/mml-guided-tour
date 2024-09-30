import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

export function renderAsMML(node: React.ReactNode) {
  const container = document.body.appendChild(document.createElement("div"));
  const root = createRoot(container);
  flushSync(() => {
    root.render(node);
  });
}
