import Player from "../player";
import Tech from "../techs/tech";
import { PlayerConfig, SourceItem } from "./player";

export interface TechOptions {
  [key: string]: any;
}

export interface TechClass {
  new (
    player: Player,
    videoElement: HTMLVideoElement,
    source: SourceItem,
    options: TechOptions
  ): Tech;
  id: string;
  canHandleSource: (source: SourceItem, options: PlayerConfig) => string;
}

export interface TechItem {
  name: string;
  options: TechOptions;
  handler: TechClass;
}
