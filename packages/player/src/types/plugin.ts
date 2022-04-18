import { ClassType } from "./index";

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
