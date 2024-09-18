import { WelcomeRoom } from "./0-welcome/room";
import { AnimationsRoom } from "./1-animations/room";
import { AudioVideoRoom } from "./2-audio-video/room";
import { ExternalApisRoom } from "./3-external-apis/room";
import { GamesRoom } from "./4-games/room";
import { WhatsNextRoom } from "./5-whats-next/room";
export { ServiceCorridor } from "./service-corridor";

export const roomDepth = 45;

export const rooms = [
  WelcomeRoom,
  AnimationsRoom,
  AudioVideoRoom,
  ExternalApisRoom,
  GamesRoom,
  WhatsNextRoom,
] as const;

export { WelcomeRoom, AnimationsRoom, AudioVideoRoom, ExternalApisRoom, GamesRoom, WhatsNextRoom };
