import { canPlayType } from "@lin-media/utils";
import Player from "../player";
import { SourceItem } from "../types/player";
import Tech from "./tech";

const canHandleSourceType = "video/mp4";

const playType = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

class Html5 extends Tech {
  static canHandleSource(sourceItem: SourceItem) {
    if (sourceItem.type === canHandleSourceType && canPlayType(playType)) {
      return "maybe";
    }
    return "";
  }
  constructor(
    player: Player,
    videoElement: HTMLVideoElement,
    source: SourceItem
  ) {
    super(player, videoElement, source);
    videoElement.src = source.url;
    this.triggerReady();
  }
}

export default Html5;
