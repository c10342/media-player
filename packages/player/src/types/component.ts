import Component from "../components/component";
import Player from "../player";
import { PlayerConfig } from "./player";

export interface ComponentClass<Options = any> {
  new (
    player: Player,
    rootElement: HTMLElement,
    options: Options
  ): Component<Options>;
  componentName: string;
  shouldInit?: (options: PlayerConfig) => boolean;
}

export interface DefaultComponentOptions {
  init?: boolean;
  defaults?: { [key: string]: any };
  level?: number;
  parentComponent?: string;
}

export interface ComponentItem {
  name: string;
  options: DefaultComponentOptions;
  handler: ComponentClass;
}

export type FullscreenType = "web" | "browser";
