import { parseHtmlToDom } from "@lin-media/utils";
import Player from "../player";
import LiveTpl from "../templates/live";
import { PlayerConfig } from "../types/player";
import Component from "./component";
class VideoLive extends Component {
  static shouldInit(options: PlayerConfig) {
    return !!options.live;
  }
  static componentName = "VideoLive";

  constructor(player: Player, slotElement: HTMLElement, options = {}) {
    super(player, slotElement, options);

    // 初始化dom
    this.initDom(slotElement);
    this.initComponent(VideoLive.componentName);
  }

  private initDom(slotElement: HTMLElement) {
    const parentElement = slotElement.querySelector(".player-controls-left")!;
    const html = LiveTpl({
      $t: this.player.i18n.t
    });
    parentElement.appendChild(parseHtmlToDom(html));
  }
}

export default VideoLive;
