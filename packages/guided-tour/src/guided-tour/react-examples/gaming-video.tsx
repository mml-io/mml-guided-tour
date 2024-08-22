import { MVideoElement } from "@mml-io/mml-react-types";
import * as React from "react";
import { memo, useCallback, useMemo, useState } from "react";

import { TagCodeCanvas } from "../components/tag-code-canvas";
import { useAttributes } from "../helpers/use-attributes";

type GamingVideoProps = {
  x?: number;
  y?: number;
  z?: number;
  ry?: number;
  visibleTo?: string | number;
};

export const GamingVideo = memo(({ x, y, z, ry, visibleTo }: GamingVideoProps) => {
  const [videoRef, setVideoRef] = useState<MVideoElement | null>(null);
  const attributes = useAttributes(videoRef);

  const videosAvailable = useMemo(
    () => ["/assets/guidedtour/video_sonic_ghz.mp4", "/assets/guidedtour/video_sonic_ss.mp4"],
    [],
  );

  const [videoIndex, setVideoIndex] = useState<number>(0);
  const [videoURL, setVideoURL] = useState<string>(videosAvailable[videoIndex]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [volume, setVolume] = useState<number>(0);

  const nextVideo = useCallback(() => {
    setVideoIndex(videoIndex + 1 > videosAvailable.length - 1 ? 0 : videoIndex + 1);
    setVideoURL(videosAvailable[videoIndex]);
  }, [videoIndex, videosAvailable]);

  return (
    <m-group x={x} y={y} z={z} ry={ry} visible-to={visibleTo}>
      <m-group sx={2} sy={2} sz={2} x={-1.1} y={3.5} z={1.1} onClick={() => nextVideo()}>
        <m-video
          ref={setVideoRef}
          src={videoURL}
          volume={volume}
          ry={220}
          width={3.6}
          height={2.95}
          emissive={2}
        ></m-video>
      </m-group>
      <m-group ry={180} x={-9} y={3} z={3.5}>
        <TagCodeCanvas
          tagAttributes={attributes}
          fontSize={35}
          color="#ffffaa"
          emissive={12}
          tag="m-video"
        />
      </m-group>
    </m-group>
  );
});
GamingVideo.displayName = "GamingVideo";
