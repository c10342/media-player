import { EventManager, parseHtmlToDom } from "@lin-media/utils";
import { PlayerEvents } from "../config/event";
import MediaPlayer from "../index";
import ControlsTpl from "../templates/controls.art";
import VideoProgress from "./video-progress";
import VideoPlayButton from "./video-play-button";
import VideoVolume from "./video-volume";
import VideoTime from "./video-time";
import VideoFullscreen from "./video-fullscreen";

class VideoControls {
  // 播放器实例
  private _playerInstance: MediaPlayer;
  // dom事件管理器
  private _eventManager = new EventManager();
  // 组件根元素
  private _compRootElement: HTMLElement;

  constructor(playerInstance: MediaPlayer, slotElement: HTMLElement) {
    // 播放器实例
    this._playerInstance = playerInstance;
    // 初始化dom
    this._initDom(slotElement);
    // 初始化组件
    this._initComponent();
    this._initListener();
  }

  // 查询元素
  private _querySelector<T extends HTMLElement>(selector: string) {
    return this._compRootElement.querySelector(selector) as T;
  }

  private _initDom(slotElement: HTMLElement) {
    const html = ControlsTpl();
    this._compRootElement = parseHtmlToDom(html);
    slotElement.appendChild(this._compRootElement);
  }

  private _initComponent() {
    const { $options } = this._playerInstance;
    const leftSlotElement = this._querySelector(".player-controls-left");
    const rightSlotElement = this._querySelector(".player-controls-right");
    if (!$options.live) {
      new VideoProgress(
        this._playerInstance,
        this._querySelector(".player-controls-group")
      );
    }

    if (!this._playerInstance.$isMobile) {
      new VideoPlayButton(this._playerInstance, leftSlotElement);
    }
    new VideoVolume(this._playerInstance, leftSlotElement);
    if (!$options.live) {
      new VideoTime(this._playerInstance, leftSlotElement);
    }
    new VideoFullscreen(this._playerInstance, rightSlotElement);
  }
  private _initListener() {
    this._on(PlayerEvents.DESTROY, this._destroy.bind(this));
  }

  // 事件监听
  private _on(eventName: string, handler: Function) {
    this._playerInstance.$eventBus.$on(eventName, handler);
  }

  private _destroy() {
    this._eventManager.removeEventListener();
  }
}

export default VideoControls;
