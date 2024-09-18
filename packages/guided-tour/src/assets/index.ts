export const teleporterBaseURL = "/assets/guidedtour/teleporter_base_plinth.glb";
export const botMeshURL = "/assets/guidedtour/bot_mesh.glb";
export const botAnimURL = "/assets/guidedtour/bot_anim_idle.glb";

export const logos = {
  discord: "/assets/guidedtour/3d-icons-discord.glb",
  github: "/assets/guidedtour/3d-icons-github.glb",
  www: "/assets/guidedtour/3d-icons-www.glb",
  mml: "/assets/guidedtour/3d-mml-logo.glb",
} as const;

export const posters = {
  animations: "/assets/guidedtour/poster_animations.jpeg",
  audioVideo: "/assets/guidedtour/poster_audio_video.jpeg",
  externalApi: "/assets/guidedtour/poster_external_api.jpeg",
  games: "/assets/guidedtour/poster_games.jpeg",
  whatsNext: "/assets/guidedtour/poster_whats_next.jpeg",
} as const;

export type PosterSrc = (typeof posters)[keyof typeof posters];

export const roomModels = {
  first: "/assets/guidedtour/room_1.glb",
  default: "/assets/guidedtour/room.glb",
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
