import {
  enterBrowserFullScreen,
  exitBrowserFullscreen,
  isBrowserFullscreen,
  EventManager,
  isUndef
} from "@media/utils";
import { ComponentOptions } from "../types";
import { WEBFULLSCREENCLASSNAME } from "../config/constant";
import { KeyCodeEnum } from "../config/enum";
import { PlayerEvents } from "../config/event";

class VideoFullscreen {
  private options: ComponentOptions;
  private isWebFullscreen = false;
  private eventManager: EventManager;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    // 全屏图标事件监听
    this.initButtonListener();
    // 全局事件
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
    // 网页全屏
    this.eventManager.addEventListener({
      element: fullscreenWebElement,
      eventName: "click",
      handler: this.onWebFullscreen.bind(this)
    });
    // 浏览器全屏
    this.eventManager.addEventListener({
      element: fullscreenBrowserElement,
      eventName: "click",
      handler: this.onBrowserFullscreen.bind(this)
    });
  }

  private initListener() {
    this.instance.$on(PlayerEvents.DESTROY, this.destroy.bind(this));
  }

  // 监听全局事件
  private initGlobalListener() {
    this.eventManager.addEventListener({
      element: document,
      eventName: "keyup",
      handler: this.onKeypress.bind(this)
    });
  }

  // 网页全屏事件处理
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
  // 浏览器全屏事件处理
  private onBrowserFullscreen() {
    if (!isBrowserFullscreen()) {
      this.enterBrowserFullScreen();
    } else {
      this.exitBrowserFullscreen();
    }
  }
  // 进入浏览器全屏
  enterBrowserFullScreen() {
    if (this.isWebFullscreen) {
      // 如果是浏览器全屏需要先退出
      this.exitWebFullscreen();
    }
    const containerElement = this.options.templateInstance.containerElement;
    if (!isUndef(containerElement) && !isBrowserFullscreen()) {
      enterBrowserFullScreen(containerElement);
      this.instance.$emit(PlayerEvents.ENTER_BROWSER_SCREEN);
    }
  }
  // 退出浏览器全屏
  exitBrowserFullscreen() {
    if (this.isWebFullscreen) {
      // 如果是浏览器全屏需要先退出
      this.exitWebFullscreen();
    }
    if (isBrowserFullscreen()) {
      exitBrowserFullscreen();
      this.instance.$emit(PlayerEvents.EXIT_BROWSER_SCREEN);
    }
  }
  // 退出网页全屏
  exitWebFullscreen() {
    this.isWebFullscreen = false;
    const containerElement = this.options.templateInstance.containerElement;
    if (
      !isUndef(containerElement) &&
      containerElement.classList.contains(WEBFULLSCREENCLASSNAME)
    ) {
      containerElement.classList.remove(WEBFULLSCREENCLASSNAME);
      this.instance.$emit(PlayerEvents.EXIT_WEB_SCREEN);
    }
  }
  // 进入网页全屏
  enterWebFullscreen() {
    this.isWebFullscreen = true;
    const containerElement = this.options.templateInstance.containerElement;
    if (
      !isUndef(containerElement) &&
      !containerElement.classList.contains(WEBFULLSCREENCLASSNAME)
    ) {
      containerElement.classList.add(WEBFULLSCREENCLASSNAME);
      this.instance.$emit(PlayerEvents.ENTER_WEB_SCREEN);
    }
  }

  private onKeypress(event: KeyboardEvent) {
    // 按下esc键，键盘左上角
    if (event.keyCode === KeyCodeEnum.esc && this.isWebFullscreen) {
      this.exitWebFullscreen();
    }
  }

  private destroy() {
    this.eventManager.removeEventListener();
  }
}

export default VideoFullscreen;
