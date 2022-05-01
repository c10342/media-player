import { parseHtmlToDom } from "@lin-media/utils";
import Player from "../player";
import LiveTpl from "../templates/live";
import { PlayerConfig } from "../types/index";
import Component from "./component";
class VideoLive extends Component {
  static shouldInit(options: PlayerConfig) {
    return !!options.live;
  }

  constructor(
    player: Player,
    slotElement: HTMLElement,
    options = {},
    parentComponent: any
  ) {
    super(player, slotElement, options, parentComponent);

    // 初始化dom
    this.initDom(slotElement);
    this.triggerReady();
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
