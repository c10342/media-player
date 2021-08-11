import {
  enterBrowserFullScreen,
  exitBrowserFullscreen,
  isBrowserFullscreen,
  EventManager,
  isUndef
} from "@media/utils";
import { ComponentOptions } from "../types";
import { WEBFULLSCREENCLASSNAME } from "../config/constant";
import { CustomEvents } from "../js/event";
import { KeyCodeEnum } from "../config/enum";

class VideoFullscreen {
  private options: ComponentOptions;
  private isWebFullscreen = false;
  private eventManager: EventManager;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    this.initButtonListener();
    this.initGlobalListener();
    this.initListener();
  }

  private get instance() {
    return this.options.instance;
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initButtonListener() {
    const { fullscreenWebElement, fullscreenBrowserElement } =
      this.options.templateInstance;
    this.eventManager.addEventListener({
      element: fullscreenWebElement,
      eventName: "click",
      handler: this.onWebFullscreen.bind(this)
    });
    this.eventManager.addEventListener({
      element: fullscreenBrowserElement,
      eventName: "click",
      handler: this.onBrowserFullscreen.bind(this)
    });
  }

  private initListener() {
    this.instance.$on(CustomEvents.DESTROY, this.destroy.bind(this));
  }

  private initGlobalListener() {
    this.eventManager.addEventListener({
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
    if (!isBrowserFullscreen()) {
      this.enterBrowserFullScreen();
    } else {
      this.exitBrowserFullscreen();
    }
  }

  enterBrowserFullScreen() {
    if (this.isWebFullscreen) {
      this.exitWebFullscreen();
    }
    const containerElement = this.options.templateInstance.containerElement;
    if (!isUndef(containerElement) && !isBrowserFullscreen()) {
      enterBrowserFullScreen(containerElement);
      this.instance.$emit(CustomEvents.ENTER_BROWSER_SCREEN);
    }
  }

  exitBrowserFullscreen() {
    if (this.isWebFullscreen) {
      this.exitWebFullscreen();
    }
    if (isBrowserFullscreen()) {
      exitBrowserFullscreen();
      this.instance.$emit(CustomEvents.EXIT_BROWSER_SCREEN);
    }
  }

  exitWebFullscreen() {
    this.isWebFullscreen = false;
    const containerElement = this.options.templateInstance.containerElement;
    if (
      !isUndef(containerElement) &&
      containerElement.classList.contains(WEBFULLSCREENCLASSNAME)
    ) {
      containerElement.classList.remove(WEBFULLSCREENCLASSNAME);
      this.instance.$emit(CustomEvents.EXIT_WEB_SCREEN);
    }
  }

  enterWebFullscreen() {
    this.isWebFullscreen = true;
    const containerElement = this.options.templateInstance.containerElement;
    if (
      !isUndef(containerElement) &&
      !containerElement.classList.contains(WEBFULLSCREENCLASSNAME)
    ) {
      containerElement.classList.add(WEBFULLSCREENCLASSNAME);
      this.instance.$emit(CustomEvents.ENTER_WEB_SCREEN);
    }
  }

  private onKeypress(event: KeyboardEvent) {
    if (event.keyCode === KeyCodeEnum.esc && this.isWebFullscreen) {
      this.exitWebFullscreen();
    }
  }

  destroy() {
    this.eventManager.removeEventListener();
  }
}

export default VideoFullscreen;
