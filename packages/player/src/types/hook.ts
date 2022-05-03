import Player from "../player";
import { PlayerNextCallbackFn, PlayerConfig } from "./player";

export type HookType = "beforeSetup" | "afterSetup";

export type HookCallback = (
  data: PlayerConfig | Player,
  next: PlayerNextCallbackFn
) => void;

export interface HooksMap {
  beforeSetup: HookCallback[];
  afterSetup: HookCallback[];
}
