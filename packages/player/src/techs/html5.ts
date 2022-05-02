import Player from "../player";
import { SourceItem, TechOptions } from "../types/index";
import Tech from "./tech";

const canHandleSourceType = ["video/mp4", "video/ogg", "video/webm"];

class Html5 extends Tech {
  static canHandleSource(sourceItem: SourceItem) {
    if (canHandleSourceType.includes(sourceItem.type)) {
      return "maybe";
    }
    return "";
  }
  constructor(
    player: Player,
    videoElement: HTMLVideoElement,
    source: SourceItem,
    options: TechOptions
  ) {
    super(player, videoElement, source, options);
    this.initVideo();
    this.triggerReady();
  }

  private initVideo() {
    this.videoElement.src = this.source.url;
  }

  destroy() {
    // 重置视频
    this.videoElement.load();
    // this.videoElement.src = "";
    super.destroy();
  }
}

export default Html5;
