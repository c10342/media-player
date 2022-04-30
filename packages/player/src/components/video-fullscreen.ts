import {
  enterBrowserFullScreen,
  exitBrowserFullscreen,
  isBrowserFullscreen,
  isUndef,
  parseHtmlToDom,
  isMobile
} from "@lin-media/utils";
import {
  BODYHIDDENCLASSNAME,
  WEBFULLSCREENCLASSNAME
} from "../config/constant";
import { FullScreenTypeEnum, KeyCodeEnum } from "../config/enum";
import { PlayerEvents } from "../config/event";
import Player from "../player";
import FullscreenTpl from "../templates/fullscreen";
import { FullscreenType } from "../types/component";
import { definePlayerMethods } from "../utils/helper";
import Component from "./component";

class VideoFullscreen extends Component {
  private isWebFullscreen = false;
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

  // 查询元素
  private querySelector<T extends HTMLElement>(selector: string) {
    return this.rootElement.querySelector(selector) as T;
  }

  private initDom(slotElement: HTMLElement) {
    const parentElement = slotElement.querySelector(".player-controls-right")!;
    const html = FullscreenTpl({
      isMobile: isMobile()
    });
    this.rootElement = parseHtmlToDom(html);
    parentElement.appendChild(this.rootElement);
  }

  private initListener() {
    // 网页全屏
    this.eventManager.addEventListener({
      element: this.querySelector(".player-fullscreen-web"),
      eventName: "click",
      handler: this.onWebFullscreen.bind(this)
    });
    // 浏览器全屏
    this.eventManager.addEventListener({
      element: this.querySelector(".player-fullscreen-browser"),
      eventName: "click",
      handler: this.onBrowserFullscreen.bind(this)
    });
    this.eventManager.addEventListener({
      element: document,
      eventName: "keyup",
      handler: this.onKeypress.bind(this)
    });
  }

  private initPlayerMethods() {
    const methods: any = {
      requestFullscreen: this.request.bind(this),
      cancelFullscreen: this.cancel.bind(this)
    };
    definePlayerMethods(this.player, methods);
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
  private enterBrowserFullScreen() {
    if (this.isWebFullscreen) {
      // 如果是浏览器全屏需要先退出
      this.exitWebFullscreen();
    }
    const containerElement = this.player.rootElement;
    if (!isUndef(containerElement) && !isBrowserFullscreen()) {
      enterBrowserFullScreen(containerElement);
      this.player.$emit(PlayerEvents.ENTER_BROWSER_SCREEN);
    }
  }
  // 退出浏览器全屏
  private exitBrowserFullscreen() {
    if (this.isWebFullscreen) {
      // 如果是浏览器全屏需要先退出
      this.exitWebFullscreen();
    }
    if (isBrowserFullscreen()) {
      exitBrowserFullscreen();
      this.player.$emit(PlayerEvents.EXIT_BROWSER_SCREEN);
    }
  }
  // 退出网页全屏
  private exitWebFullscreen() {
    this.isWebFullscreen = false;
    const containerElement = this.player.rootElement;
    if (containerElement.classList.contains(WEBFULLSCREENCLASSNAME)) {
      containerElement.classList.remove(WEBFULLSCREENCLASSNAME);
      document.body.classList.remove(BODYHIDDENCLASSNAME);
      this.player.$emit(PlayerEvents.EXIT_WEB_SCREEN);
    }
  }
  // 进入网页全屏
  private enterWebFullscreen() {
    this.isWebFullscreen = true;
    const containerElement = this.player.rootElement;
    if (!containerElement.classList.contains(WEBFULLSCREENCLASSNAME)) {
      containerElement.classList.add(WEBFULLSCREENCLASSNAME);
      document.body.classList.add(BODYHIDDENCLASSNAME);
      this.player.$emit(PlayerEvents.ENTER_WEB_SCREEN);
    }
  }

  private onKeypress(event: KeyboardEvent) {
    // 按下esc键，键盘左上角
    if (event.keyCode === KeyCodeEnum.esc && this.isWebFullscreen) {
      this.exitWebFullscreen();
    }
  }

  private request(type: FullscreenType) {
    if (type === FullScreenTypeEnum.web) {
      this.enterWebFullscreen();
    } else if (type === FullScreenTypeEnum.browser) {
      this.enterBrowserFullScreen();
    }
  }

  private cancel(type: FullscreenType) {
    if (type === FullScreenTypeEnum.web) {
      this.exitWebFullscreen();
    } else if (type === FullScreenTypeEnum.browser) {
      this.exitBrowserFullscreen();
    }
  }
}

export default VideoFullscreen;
