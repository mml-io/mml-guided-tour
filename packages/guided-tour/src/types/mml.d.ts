declare const type: unique symbol;

declare type Tagged<Base, Tags extends PropertyKey> = Base & { [type]: { [T in Tags]: void } };

declare module "*.html" {
  const url: Tagged<string, "html">;
  export default url;
}

declare module "mml:*" {
  const url: Tagged<string, "mml">;
  export default url;
}

declare module "*.glb" {
  const url: Tagged<string, "glb" | "model">;
  export default url;
}

declare module "*.jpg" {
  const url: Tagged<string, "jpeg" | "image">;
  export default url;
}

declare module "*.jpeg" {
  const url: Tagged<string, "jpeg" | "image">;
  export default url;
}

declare module "*.png" {
  const url: Tagged<string, "png" | "image">;
  export default url;
}

declare module "*.mp3" {
  const url: Tagged<string, "mp3" | "audio">;
  export default url;
}

declare module "*.wav" {
  const url: Tagged<string, "wav" | "audio">;
  export default url;
}

declare module "*.mp4" {
  const url: Tagged<string, "mp4" | "video">;
  export default url;
}
