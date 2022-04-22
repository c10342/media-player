import { EventEmit } from "@lin-media/utils";
import Player from "../player";
import { PlayerConfig, SourceItem } from "../types/player";

class Tech extends EventEmit {
  static canHandleSource(source: SourceItem, options: PlayerConfig) {
    return "";
  }
  player: Player;
  videoElement: HTMLVideoElement;
  source: SourceItem;
  constructor(
    player: Player,
    videoElement: HTMLVideoElement,
    source: SourceItem
  ) {
    super();
    this.player = player;
    this.videoElement = videoElement;
    this.source = source;
  }

  destroy() {
    this.clear();
  }
}

export default Tech;
