import Player from "../player";
import Plugin from "../plugins/plugin";
import { PlayerConfig } from "./player";

export interface PluginClass<Options = any> {
  new (player: Player, options: Options): Plugin;
  id?: string;
  shouldInit?: (options: PlayerConfig) => boolean;
}

export interface PluginItem {
  name: string;
  options: DefaultPluginOptions;
  handler: PluginClass;
}

export interface DefaultPluginOptions {
  init?: boolean;
  defaults?: { [key: string]: any };
}
