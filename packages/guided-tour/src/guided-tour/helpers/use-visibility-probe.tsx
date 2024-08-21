import { MPositionProbeElement } from "@mml-io/mml-react-types";
import { useEffect, useRef, useState } from "react";

import { setToCSVString } from "./js-helpers";

export function useVisibilityProbe(
  probeRef: React.RefObject<MPositionProbeElement>,
  groupRef: React.RefObject<any>,
  range: number,
  interval: number,
  debug?: boolean,
) {
  const usersInProbe = useRef<Set<number>>(new Set());
  const [visibleTo, setVisibleTo] = useState<string>("");

  useEffect(() => {
    if (probeRef.current) {
      const probe = probeRef.current;

      const handlePositionEnter = (event: any) => {
        if (!usersInProbe.current.has(event.detail.connectionId)) {
          usersInProbe.current.add(event.detail.connectionId);
          setVisibleTo(setToCSVString(usersInProbe.current));
        }
      };

      const handlePositionMove = (event: any) => {
        if (!usersInProbe.current.has(event.detail.connectionId)) {
          usersInProbe.current.add(event.detail.connectionId);
          setVisibleTo(setToCSVString(usersInProbe.current));
        }
      };

      const handlePositionLeave = (event: any) => {
        if (usersInProbe.current.has(event.detail.connectionId)) {
          usersInProbe.current.delete(event.detail.connectionId);
          setVisibleTo(setToCSVString(usersInProbe.current));
        }
      };

      const handleDisconnect = (event: any) => {
        if (usersInProbe.current.has(event.detail.connectionId)) {
          usersInProbe.current.delete(event.detail.connectionId);
          setVisibleTo(setToCSVString(usersInProbe.current));
        }
      };

      if (debug) {
        probe.setAttribute("debug", `${debug}`);
      }
      probe.setAttribute("range", `${range}`);
      probe.setAttribute("interval", `${interval}`);
      probe.addEventListener("positionenter", handlePositionEnter);
      probe.addEventListener("positionmove", handlePositionMove);
      probe.addEventListener("positionleave", handlePositionLeave);
      window.addEventListener("disconnected", handleDisconnect);

      return () => {
        if (probe) {
          probe.removeEventListener("positionenter", handlePositionEnter);
          probe.removeEventListener("positionmove", handlePositionMove);
          probe.removeEventListener("positionleave", handlePositionLeave);
        }
        window.removeEventListener("disconnected", handleDisconnect);
      };
    }
  }, [probeRef, usersInProbe, range, interval, debug]);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.setAttribute("visible-to", visibleTo.length > 0 ? visibleTo : "-1");
    }
  }, [visibleTo, groupRef]);

  return {
    visibleTo,
  };
}
