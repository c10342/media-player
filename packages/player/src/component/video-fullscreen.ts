import {
  enterBrowserFullScreen,
  exitBrowserFullscreen,
  isBrowserFullscreen,
  EventManager,
  isUndef
} from "@media/utils";
import { ComponentOptions, HtmlElementProp } from "../types";
import { WEBFULLSCREENCLASSNAME, ESCKEY } from "../config/constant";

class VideoFullscreen {
  private options: ComponentOptions;
  private fullscreenBrowserElement: HtmlElementProp;
  private fullscreenWebElement: HtmlElementProp;
  private isWebFullscreen = false;
  private eventManager: EventManager | null;
  private containerElement: HtmlElementProp;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initElement();
    this.initVar();
    this.initListener();
    this.initGlobalListener();
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initElement() {
    const templateInstance = this.options.templateInstance;
    this.fullscreenBrowserElement = templateInstance.fullscreenBrowserElement;
    this.fullscreenWebElement = templateInstance.fullscreenWebElement;
    this.containerElement = templateInstance.containerElement;
  }

  private initListener() {
    this.eventManager?.addEventListener({
      element: this.fullscreenWebElement,
      eventName: "click",
      handler: this.onWebFullscreen.bind(this)
    });
    this.eventManager?.addEventListener({
      element: this.fullscreenBrowserElement,
      eventName: "click",
      handler: this.onBrowserFullscreen.bind(this)
    });
  }

  private initGlobalListener() {
    this.eventManager?.addEventListener({
      element: document,
      eventName: "keyup",
      handler: this.onKeypress.bind(this)
    });
  }

  private onWebFullscreen() {
    if (isBrowserFullscreen()) {
      exitBrowserFullscreen();
    }
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
    const containerElement = this.containerElement;
    if (!isUndef(containerElement)) {
      if (!isBrowserFullscreen()) {
        enterBrowserFullScreen(containerElement);
      } else {
        exitBrowserFullscreen();
      }
    }
  }

  private exitWebFullscreen() {
    this.isWebFullscreen = false;
    const containerElement = this.containerElement;
    if (
      !isUndef(containerElement) &&
      containerElement.classList.contains(WEBFULLSCREENCLASSNAME)
    ) {
      containerElement.classList.remove(WEBFULLSCREENCLASSNAME);
    }
  }

  private enterWebFullscreen() {
    this.isWebFullscreen = true;
    const containerElement = this.containerElement;
    if (
      !isUndef(containerElement) &&
      !containerElement.classList.contains(WEBFULLSCREENCLASSNAME)
    ) {
      containerElement.classList.add(WEBFULLSCREENCLASSNAME);
    }
  }

  private onKeypress(event: KeyboardEvent) {
    if (event.key === ESCKEY && this.isWebFullscreen) {
      this.exitWebFullscreen();
    }
  }

  private resetData() {
    this.fullscreenBrowserElement = null;
    this.fullscreenWebElement = null;
    this.isWebFullscreen = false;
    this.eventManager = null;
  }

  destroy() {
    this.eventManager?.removeEventListener();
    this.resetData();
  }
}

export default VideoFullscreen;
