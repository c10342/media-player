import {
  enterBrowserFullScreen,
  exitBrowserFullscreen,
  isBrowserFullscreen,
  EventManager,
  isUndef,
  parseHtmlToDom
} from "@lin-media/utils";
import { WEBFULLSCREENCLASSNAME } from "../config/constant";
import { FullScreenTypeEnum, KeyCodeEnum } from "../config/enum";
import { MessageChannelEvents, PlayerEvents } from "../config/event";
import MediaPlayer from "../index";
import FullscreenTpl from "../templates/fullscreen";

class VideoFullscreen {
  // 播放器实例
  private _playerInstance: MediaPlayer;
  // 组件根元素
  private _compRootElement: HTMLElement;

  private _isWebFullscreen = false;
  private _eventManager = new EventManager();
  constructor(playerInstance: MediaPlayer, slotElement: HTMLElement) {
    this._playerInstance = playerInstance;
    // 初始化dom
    this._initDom(slotElement);
    this._initListener();
    this._initMessageChannel();
  }

  // 查询元素
  private _querySelector<T extends HTMLElement>(selector: string) {
    return this._compRootElement.querySelector(selector) as T;
  }

  // 事件监听
  private _on(eventName: string, handler: Function) {
    this._playerInstance.$eventBus.$on(eventName, handler);
  }

  private _emit(eventName: string, data?: any) {
    this._playerInstance.$eventBus.$emit(eventName, data);
  }

  private _initDom(slotElement: HTMLElement) {
    const html = FullscreenTpl({
      isMobile: this._playerInstance.$isMobile
    });
    this._compRootElement = parseHtmlToDom(html);
    slotElement.appendChild(this._compRootElement);
  }

  private _initListener() {
    this._on(PlayerEvents.DESTROY, this._destroy.bind(this));
    // 网页全屏
    this._eventManager.addEventListener({
      element: this._querySelector(".player-fullscreen-web"),
      eventName: "click",
      handler: this._onWebFullscreen.bind(this)
    });
    // 浏览器全屏
    this._eventManager.addEventListener({
      element: this._querySelector(".player-fullscreen-browser"),
      eventName: "click",
      handler: this._onBrowserFullscreen.bind(this)
    });
    this._eventManager.addEventListener({
      element: document,
      eventName: "keyup",
      handler: this._onKeypress.bind(this)
    });
  }

  private _initMessageChannel() {
    this._on(MessageChannelEvents.FULLSCREENREQUEST, this._request.bind(this));
    this._on(MessageChannelEvents.FULLSCREENCANCEL, this._cancel.bind(this));
  }

  // 网页全屏事件处理
  private _onWebFullscreen() {
    if (isBrowserFullscreen()) {
      exitBrowserFullscreen();
    }
    if (this._isWebFullscreen) {
      this._exitWebFullscreen();
    } else {
      this._enterWebFullscreen();
    }
  }
  // 浏览器全屏事件处理
  private _onBrowserFullscreen() {
    if (!isBrowserFullscreen()) {
      this._enterBrowserFullScreen();
    } else {
      this._exitBrowserFullscreen();
    }
  }
  // 进入浏览器全屏
  private _enterBrowserFullScreen() {
    if (this._isWebFullscreen) {
      // 如果是浏览器全屏需要先退出
      this._exitWebFullscreen();
    }
    const containerElement = this._playerInstance.$rootElement;
    if (!isUndef(containerElement) && !isBrowserFullscreen()) {
      enterBrowserFullScreen(containerElement);
      this._emit(PlayerEvents.ENTER_BROWSER_SCREEN);
    }
  }
  // 退出浏览器全屏
  private _exitBrowserFullscreen() {
    if (this._isWebFullscreen) {
      // 如果是浏览器全屏需要先退出
      this._exitWebFullscreen();
    }
    if (isBrowserFullscreen()) {
      exitBrowserFullscreen();
      this._emit(PlayerEvents.EXIT_BROWSER_SCREEN);
    }
  }
  // 退出网页全屏
  private _exitWebFullscreen() {
    this._isWebFullscreen = false;
    const containerElement = this._playerInstance.$rootElement;
    if (containerElement.classList.contains(WEBFULLSCREENCLASSNAME)) {
      containerElement.classList.remove(WEBFULLSCREENCLASSNAME);
      this._emit(PlayerEvents.EXIT_WEB_SCREEN);
    }
  }
  // 进入网页全屏
  private _enterWebFullscreen() {
    this._isWebFullscreen = true;
    const containerElement = this._playerInstance.$rootElement;
    if (!containerElement.classList.contains(WEBFULLSCREENCLASSNAME)) {
      containerElement.classList.add(WEBFULLSCREENCLASSNAME);
      this._emit(PlayerEvents.ENTER_WEB_SCREEN);
    }
  }

  private _onKeypress(event: KeyboardEvent) {
    // 按下esc键，键盘左上角
    if (event.keyCode === KeyCodeEnum.esc && this._isWebFullscreen) {
      this._exitWebFullscreen();
    }
  }

  private _request(type: string) {
    if (type === FullScreenTypeEnum.web) {
      this._enterWebFullscreen();
    } else if (type === FullScreenTypeEnum.browser) {
      this._enterBrowserFullScreen();
    }
  }

  private _cancel(type: string) {
    if (type === FullScreenTypeEnum.web) {
      this._exitWebFullscreen();
    } else if (type === FullScreenTypeEnum.browser) {
      this._exitBrowserFullscreen();
    }
  }

  private _destroy() {
    this._eventManager.removeEventListener();
  }
}

export default VideoFullscreen;
