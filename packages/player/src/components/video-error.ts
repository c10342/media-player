import { parseHtmlToDom } from "@lin-media/utils";
import { VideoReadyStateEnum } from "../config/enum";
import { PlayerEvents, VideoEvents } from "../config/event";
import Player from "../player";
import getErrorHtml from "../templates/error";
import { definePlayerMethods } from "../utils/helper";
import Component from "./component";
class VideoError extends Component {
  private errorElement: HTMLElement;
  constructor(
    player: Player,
    slotElement: HTMLElement,
    options = {},
    parentComponent: any
  ) {
    super(player, slotElement, options, parentComponent);
    // 初始化dom
    this.initDom(slotElement);
    this.initListener();
    this.initPlayerMethods();
    this.triggerReady();
  }

  private initListener() {
    this.player.$on(VideoEvents.ERROR, this.onError.bind(this));
    this.eventManager.addEventListener({
      element: this.rootElement,
      eventName: "contextmenu",
      handler: (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  }

  private initPlayerMethods() {
    const methods: any = {
      showError: this.showError.bind(this),
      hideError: this.hideError.bind(this)
    };
    definePlayerMethods(this.player, methods);
  }

  private onError() {
    // 0：媒体资源没加载
    if (
      this.player.videoReadyState !== VideoReadyStateEnum.HAVE_NOTHING ||
      !this.player.mediaError
    ) {
      return;
    }
    this.showError(this.player.mediaError);
  }

  private initDom(slotElement: HTMLElement) {
    const html = getErrorHtml();
    this.rootElement = parseHtmlToDom(html);
    slotElement.appendChild(this.rootElement);
    this.errorElement = this.rootElement.querySelector(
      ".player-error-message"
    ) as HTMLElement;
  }

  private showError(data: { message: string; [key: string]: any }) {
    if (data && data.message) {
      this.errorElement.innerHTML = data.message;
      this.rootElement.style.display = "block";
      this.player.$emit(PlayerEvents.SHOWERROR, data);
    }
  }

  private hideError() {
    this.rootElement.style.display = "";
    this.errorElement.innerHTML = "";
    this.player.$emit(PlayerEvents.HIDEERROR);
  }
}

export default VideoError;
