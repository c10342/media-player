import Player from "../player";
import { PlayerNextCallbackFn, PlayerConfig } from "./player";

export type HookCallback = (
  data: PlayerConfig | Player,
  next: PlayerNextCallbackFn
) => void;

export interface HooksMap {
  beforeSetup: HookCallback[];
  afterSetup: HookCallback[];
  beforeDestroy: HookCallback[];
  afterDestroy: HookCallback[];
}

export type HookType = keyof HooksMap;
