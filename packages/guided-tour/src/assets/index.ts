import poster_animations from "./images/poster_animations.jpeg";
import poster_audio_video from "./images/poster_audio_video.jpeg";
import poster_external_api from "./images/poster_external_api.jpeg";
import poster_games from "./images/poster_games.jpeg";
import poster_whats_next from "./images/poster_whats_next.jpeg";
import logo_discord from "./models/3d-icons-discord.glb";
import logo_github from "./models/3d-icons-github.glb";
import logo_www from "./models/3d-icons-www.glb";
import logo_mml from "./models/3d-mml-logo.glb";
import room_1 from "./models/room_1_enc.glb";
import room from "./models/room_enc.glb";

export const logos = {
  discord: logo_discord,
  github: logo_github,
  www: logo_www,
  mml: logo_mml,
} as const;

export const posters = {
  animations: poster_animations,
  audioVideo: poster_audio_video,
  externalApi: poster_external_api,
  games: poster_games,
  whatsNext: poster_whats_next,
} as const;

export type PosterSrc = (typeof posters)[keyof typeof posters];

export const roomModels = {
  first: room_1,
  default: room,
} as const;

export type RoomModel = (typeof roomModels)[keyof typeof roomModels];

export const sequencer = {
  kick: "/assets/guidedtour/sfx_808_kick.wav",
  cymbol: "/assets/guidedtour/sfx_808_cymbol.wav",
  hihat: "/assets/guidedtour/sfx_808_hihat.wav",
  snare: "/assets/guidedtour/sfx_808_snare.wav",
  bodyTexture: "/assets/guidedtour/texture_808.jpg",
};

export type SequencerSrc = (typeof sequencer)[keyof typeof sequencer];
