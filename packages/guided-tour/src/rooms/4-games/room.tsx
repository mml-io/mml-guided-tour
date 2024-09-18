import src from "mml:.";

import { RoomFrame } from "../room-frame";

export * from "./contents";

// NOTE: This room needs to be persisted after initial load as the teleporters
// in the room move the character far away from the position probe.
export const GamesRoom = RoomFrame({ src, displayName: "GamesRoom", persist: true });
