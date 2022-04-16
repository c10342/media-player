import { PlayerConfig } from "./player";

export type HookType = "beforeSetup" | "afterSetup";

export type BeforeSetupCallback = (data: PlayerConfig) => PlayerConfig;

export type AfterSetupCallback = (player: any) => void;

export type HookCallback = BeforeSetupCallback | AfterSetupCallback;

export interface HooksMap {
  beforeSetup: HookCallback[];
  afterSetup: HookCallback[];
}
