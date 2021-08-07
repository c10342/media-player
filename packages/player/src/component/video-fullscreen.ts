import {
  enterBrowserFullScreen,
  exitBrowserFullscreen,
  isBrowserFullscreen,
  isBrowserFullscreenEnabled
} from "@media/utils";
import { ComponentOptions, HtmlElementProp } from "../types";

const WebFullscreenClassName = "player-fullscreen";

class VideoFullscreen {
  private options: ComponentOptions;
  private fullscreenBrowserElement: HtmlElementProp;
  private fullscreenWebElement: HtmlElementProp;
  private isWebFullscreen = false;
  private _onKeypress: (event: KeyboardEvent) => void;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initElement();
    this.initVar();
    this.initListener();
    this.initGlobalListener();
  }

  private initVar() {
    this._onKeypress = this.onKeypress.bind(this);
  }

  private initElement() {
    const templateInstance = this.options.templateInstance;
    this.fullscreenBrowserElement = templateInstance.fullscreenBrowserElement;
    this.fullscreenWebElement = templateInstance.fullscreenWebElement;
  }

  private initListener() {
    this.fullscreenWebElement?.addEventListener("click", () =>
      this.onWebFullscreen()
    );
    this.fullscreenBrowserElement?.addEventListener("click", () =>
      this.onBrowserFullscreen()
    );
  }

  private initGlobalListener() {
    window.addEventListener("keyup", this._onKeypress);
  }

  private onWebFullscreen() {
    if (this.isWebFullscreen) {
      this.exitWebFullscreen();
    } else {
      this.enterWebFullscreen();
    }
  }

  private onBrowserFullscreen() {
    if (this.isWebFullscreen) {
      this.exitWebFullscreen();
    }
    if (isBrowserFullscreenEnabled()) {
      if (!isBrowserFullscreen()) {
        enterBrowserFullScreen(this.options.el as HTMLElement);
      } else {
        exitBrowserFullscreen();
      }
    }
  }

  private exitWebFullscreen() {
    this.isWebFullscreen = false;
    const el = this.options.el as HTMLElement;
    if (el.classList.contains(WebFullscreenClassName)) {
      el.classList.remove(WebFullscreenClassName);
    }
  }

  private enterWebFullscreen() {
    this.isWebFullscreen = true;
    const el = this.options.el as HTMLElement;
    if (!el.classList.contains(WebFullscreenClassName)) {
      el.classList.add(WebFullscreenClassName);
    }
  }

  private onKeypress(event: KeyboardEvent) {
    if (event.key === "Escape" && this.isWebFullscreen) {
      this.exitWebFullscreen();
    }
  }

  private resetData() {
    this.fullscreenBrowserElement = null;
    this.fullscreenWebElement = null;
    this.isWebFullscreen = false;
  }

  destroy() {
    window.removeEventListener("keyup", this._onKeypress);
    this.resetData();
  }
}

export default VideoFullscreen;
