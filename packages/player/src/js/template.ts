import templateTpl from "../template/layout.art";

import {
  HtmlElementProp,
  HTMLVideoElementProp,
  PlayerOptions
} from "../types/index";

class Template {
  private options: PlayerOptions;

  containerElement: HtmlElementProp;

  playElement: HtmlElementProp;

  videoElement: HTMLVideoElementProp;

  currentTimeElement: HtmlElementProp;

  totalTimeElement: HtmlElementProp;

  videoLoadedElement: HtmlElementProp;

  videoPlayedElement: HtmlElementProp;

  progressMaskElement: HtmlElementProp;

  progressBallElement: HtmlElementProp;

  videoMaskElement: HtmlElementProp;

  fullscreenBrowserElement: HtmlElementProp;

  fullscreenWebElement: HtmlElementProp;

  loadingWrapperElement: HtmlElementProp;

  processTimeElement: HtmlElementProp;

  constructor(options: PlayerOptions) {
    this.options = options;
    this.initTemplate();
    this.initDom();
  }

  private initTemplate() {
    const el = this.options.el as HTMLElement;
    const html = templateTpl({
      ...this.options
    });
    el.innerHTML = html;
  }

  private initDom() {
    const el = this.options.el as HTMLElement;
    this.containerElement = el.querySelector(".player-container");
    this.videoElement = el.querySelector(".player-video");
    this.videoMaskElement = el.querySelector(".player-video-mask");
    this.playElement = el.querySelector(".player-status-button");
    this.currentTimeElement = el.querySelector(".player-currentTime");
    this.totalTimeElement = el.querySelector(".player-totalTime");
    this.videoLoadedElement = el.querySelector(".player-process-loaded");
    this.videoPlayedElement = el.querySelector(".player-process-played");
    this.progressMaskElement = el.querySelector(".player-process-mask");
    this.progressBallElement = el.querySelector(".player-process-ball");
    this.processTimeElement = el.querySelector(".player-process-time");
    this.fullscreenBrowserElement = el.querySelector(
      ".player-fullscreen-browser"
    );
    this.fullscreenWebElement = el.querySelector(".player-fullscreen-web");
    this.loadingWrapperElement = el.querySelector(".player-loading-container");
  }

  destroy() {
    // todo
  }
}

export default Template;
