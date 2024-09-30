import src from "mml:.";

import { roomModels } from "../../assets";
import { RoomFrame } from "../room-frame";

export const WelcomeRoom = RoomFrame({ src, displayName: "WelcomeRoom", model: roomModels.first });
