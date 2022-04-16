import { parseHtmlToDom } from "@lin-media/utils";
import Player from "../player";
import LiveTpl from "../templates/live";
import { ComponentApi } from "../types/component";
import { PlayerConfig } from "../types/player";
class VideoLive implements ComponentApi {
  static shouldInit(options: PlayerConfig) {
    return options.live;
  }
  // 播放器实例
  private player: Player;
  constructor(player: Player, slotElement: HTMLElement) {
    // 播放器实例
    this.player = player;
    // 初始化dom
    this.initDom(slotElement);
  }

  private initDom(slotElement: HTMLElement) {
    const parentElement = slotElement.querySelector(".player-controls-left")!;
    const html = LiveTpl({
      $t: this.player.i18n.t
    });
    parentElement.appendChild(parseHtmlToDom(html));
  }

  destroy() {
    //todo
  }
}

export default VideoLive;
