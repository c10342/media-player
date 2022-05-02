import { isPlainObject, isString, parseHtmlToDom } from "@lin-media/utils";
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
    this.player.$on(PlayerEvents.PLAYERERROR, this.onPlayerError.bind(this));
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
    if (this.player.videoReadyState !== 0 || !this.player.mediaError) {
      return;
    }
    this.showError(this.player.mediaError.message);
  }

  private onPlayerError(error: Error | string) {
    if (this.player.videoReadyState !== 0 || !error) {
      return;
    }
    if (isString(error)) {
      this.showError(error);
    } else if (isPlainObject(error)) {
      this.showError(error.message);
    } else {
      this.showError((error as any).toString());
    }
  }

  private initDom(slotElement: HTMLElement) {
    const html = getErrorHtml();
    this.rootElement = parseHtmlToDom(html);
    slotElement.appendChild(this.rootElement);
    this.errorElement = this.rootElement.querySelector(
      ".player-error-message"
    ) as HTMLElement;
  }

  private showError(message: string) {
    if (!message) {
      return;
    }
    this.errorElement.innerHTML = message;
    this.rootElement.style.display = "block";
    this.player.$emit(PlayerEvents.SHOWERROR, message);
  }

  private hideError() {
    this.rootElement.style.display = "";
    this.errorElement.innerHTML = "";
    this.player.$emit(PlayerEvents.HIDEERROR);
  }
}

export default VideoError;
