import { ClassType } from "./index";
import MediaPlayer from "../player";

export interface PluginItem {
  name: string;
  options: DefaultPluginOptions;
  handler: ClassType<PluginApi>;
}

export interface PluginApi {
  destroy: () => void;
}

export interface DefaultPluginOptions {
  init?: boolean;
  defaultOptions?: { [key: string]: any };
}

// 插件的定义
export interface PluginClass {
  new (player: MediaPlayer, el: HTMLElement): Object;
  pluginName: string;
}
