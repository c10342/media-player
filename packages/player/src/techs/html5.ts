import { EventEmit } from "@lin-media/utils";

import Player from "../player";
import { SourceItem } from "../types/player";
import { canVideoPlayType } from "../utils/helper";

const canHandleSourceType = "video/mp4";

const canPlayType = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

class Html5 extends EventEmit {
  static canHandleSource(sourceItem: SourceItem) {
    if (
      sourceItem.type === canHandleSourceType &&
      canVideoPlayType(canPlayType)
    ) {
      return "maybe";
    }
    return "";
  }
  constructor(
    player: Player,
    videoElement: HTMLVideoElement,
    source: SourceItem
  ) {
    super();
    videoElement.src = source.url;
  }
}

export default Html5;
