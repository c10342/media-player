import Player from "../player";
import { PlayerConfig } from "./player";

export type HookType = "beforeSetup" | "afterSetup";

export type HookCallback = (
  data: PlayerConfig | Player
) => PlayerConfig | Promise<PlayerConfig> | Player | Promise<Player>;

export interface HooksMap {
  beforeSetup: HookCallback[];
  afterSetup: HookCallback[];
}
