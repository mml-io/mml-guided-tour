import { MImageElement, MVideoElement } from "@mml-io/mml-react-types";
import * as React from "react";

type CinemaScreenProps = {
  x?: number;
  y?: number;
  z?: number;
  sx?: number;
  sy?: number;
  sz?: number;
  ry?: number;
  visibleTo?: string;
};
export const CinemaScreen = React.memo(
  ({ x, y, z, sx, sy, sz, ry, visibleTo }: CinemaScreenProps) => {
    const videoSRC = "/assets/guidedtour/video_charge.mp4";
    const audioSRC = "/assets/guidedtour/video_audio_charge.mp3";
    const textureVolumeOnSRC = "/assets/guidedtour/texture_volume_on.png";
    const textureVolumeOffSRC = "/assets/guidedtour/texture_volume_off.png";

    const videoRef = React.useRef<MVideoElement | null>(null);
    const volumeOnRef = React.useRef<MImageElement | null>(null);
    const volumeOffRef = React.useRef<MImageElement | null>(null);

    const [mute, setMute] = React.useState<boolean>(true);

    const toggleMute = React.useCallback(() => {
      setMute(!mute);
    }, [mute]);

    React.useEffect(() => {
      const video = videoRef.current;
      const volumeOn = volumeOnRef.current;
      const volumeOff = volumeOffRef.current;

      if (video && volumeOn && volumeOff) {
        volumeOn.addEventListener("click", toggleMute);
        volumeOff.addEventListener("click", toggleMute);
      }

      return () => {
        if (volumeOn) volumeOn.removeEventListener("click", toggleMute);
        if (volumeOff) volumeOff.removeEventListener("click", toggleMute);
      };
    }, [toggleMute]);

    const color = "#7d7d7d";
    return (
      <m-group x={x} y={y} z={z} sx={sx} sy={sy} sz={sz} ry={ry} visible-to={visibleTo}>
        <m-group y="23.5">
          <m-video
            ref={videoRef}
            width="45"
            start-time={0}
            loop={true}
            volume={0}
            src={videoSRC}
            emissive="2"
            z="0"
          ></m-video>
          <m-audio
            src={audioSRC}
            volume={mute ? 0 : 2}
            start-time={0}
            loop={true}
            cone-angle={45}
            cone-falloff-angle={80}
            debug={false}
          ></m-audio>
          <m-group id="frame">
            <m-plane height="20" z="-0.1" width="46" color="#000000"></m-plane>
            <m-cylinder radius="0.25" rz="90" height="47" y="10.5" color={color}></m-cylinder>
            <m-cylinder radius="0.25" rz="90" height="47" y="-10.5" color={color}></m-cylinder>
            <m-cylinder radius="0.25" height="33" y="-6" color={color} x="23.5"></m-cylinder>
            <m-cylinder radius="0.25" height="33" y="-6" color={color} x="-23.5"></m-cylinder>
          </m-group>
          <m-group y="-7" x="20" z="0.1" sx="4" sy="4" sz="4">
            <m-image
              ref={volumeOnRef}
              src={textureVolumeOnSRC}
              emissive="2"
              visible={!mute}
            ></m-image>
            <m-image
              ref={volumeOffRef}
              src={textureVolumeOffSRC}
              emissive="2"
              visible={mute}
            ></m-image>
          </m-group>
        </m-group>
      </m-group>
    );
  },
);
CinemaScreen.displayName = "CinemaScreen";
