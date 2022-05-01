import Player, {
  PlayerConfig,
  SourceItem,
  TechOptions
} from "@lin-media/player";
import { canPlayType } from "@lin-media/utils";
import Hls from "hls.js";

const Tech = Player.getTech("Tech");

class HlsHandler extends Tech {
  static canHandleSource(source: SourceItem, options: PlayerConfig): string {
    if (source.type === "video/hls") {
      return "maybe";
    }
    return "";
  }
  private hls: Hls;
  constructor(
    player: Player,
    videoElement: HTMLVideoElement,
    source: SourceItem,
    options: TechOptions
  ) {
    super(player, videoElement, source, options);

    this.initVideo();
  }

  private initVideo() {
    const video = this.videoElement;
    const videoSrc = this.source.url;
    if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.loadSource(videoSrc);
      this.hls.attachMedia(video);
    } else if (canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
    }
  }

  destroy() {
    if (this.hls) {
      this.hls.destroy();
    }
  }
}

Player.registerTech("HlsHandler", HlsHandler, {
  defaults: { age: 14 }
});
