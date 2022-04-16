import { EventEmit } from "@lin-media/utils";

import { registerTech } from "../global-api/tech";
import Player from "../player";
import { VideoListItem } from "../types";
import { canVideoPlayType } from "../utils/helper";

const canHandleSourceType = "video/mp4";

const canPlayType = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

class Html5 extends EventEmit {
  static canHandleSource(sourceItem: VideoListItem) {
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
    source: VideoListItem
  ) {
    super();
    videoElement.src = source.url;
  }
}

registerTech("Html5", Html5);

export default Html5;
