import Player from "../player";
import Tech from "../techs/tech";
import { PlayerConfig, SourceItem } from "./player";

export interface TechsMap {
  [key: string]: TechClass;
}

export interface TechClass {
  new (
    player: Player,
    videoElement: HTMLVideoElement,
    source: SourceItem
  ): Tech;
  canHandleSource: (source: SourceItem, options: PlayerConfig) => string;
}
