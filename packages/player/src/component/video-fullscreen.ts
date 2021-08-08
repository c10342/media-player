import {
  enterBrowserFullScreen,
  exitBrowserFullscreen,
  isBrowserFullscreen,
  EventManager,
  isUndef
} from "@media/utils";
import { ComponentOptions } from "../types";
import { WEBFULLSCREENCLASSNAME, ESCKEYCODE } from "../config/constant";

class VideoFullscreen {
  private options: ComponentOptions | null;
  private isWebFullscreen = false;
  private eventManager: EventManager | null;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    this.initListener();
    this.initGlobalListener();
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initListener() {
    const { fullscreenWebElement, fullscreenBrowserElement } =
      this.options?.templateInstance ?? {};
    this.eventManager?.addEventListener({
      element: fullscreenWebElement,
      eventName: "click",
      handler: this.onWebFullscreen.bind(this)
    });
    this.eventManager?.addEventListener({
      element: fullscreenBrowserElement,
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
    const containerElement = this.options?.templateInstance.containerElement;
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
    const containerElement = this.options?.templateInstance.containerElement;
    if (
      !isUndef(containerElement) &&
      containerElement.classList.contains(WEBFULLSCREENCLASSNAME)
    ) {
      containerElement.classList.remove(WEBFULLSCREENCLASSNAME);
    }
  }

  private enterWebFullscreen() {
    this.isWebFullscreen = true;
    const containerElement = this.options?.templateInstance.containerElement;
    if (
      !isUndef(containerElement) &&
      !containerElement.classList.contains(WEBFULLSCREENCLASSNAME)
    ) {
      containerElement.classList.add(WEBFULLSCREENCLASSNAME);
    }
  }

  private onKeypress(event: KeyboardEvent) {
    if (event.keyCode === ESCKEYCODE && this.isWebFullscreen) {
      this.exitWebFullscreen();
    }
  }

  private resetData() {
    this.isWebFullscreen = false;
    this.eventManager = null;
    this.options = null;
  }

  destroy() {
    this.eventManager?.removeEventListener();
    this.resetData();
  }
}

export default VideoFullscreen;
