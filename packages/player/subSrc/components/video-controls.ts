import { EventManager } from "@lin-media/utils";
import MediaPlayer from "../index";
import ControlsTpl from "../templates/controls.art";
import VideoProgress from "./video-progress";

class VideoControls {
  // 播放器实例
  private _playerInstance: MediaPlayer;
  // dom事件管理器
  private _eventManager = new EventManager();
  // 插槽
  private _slotElement: HTMLElement;

  constructor(playerInstance: MediaPlayer, slotElement: HTMLElement) {
    // 播放器实例
    this._playerInstance = playerInstance;
    // 插槽
    this._slotElement = slotElement;
    // 初始化dom
    this._initDom();
    // 初始化组件
    this._initCompoment();
  }

  // 查询元素
  private _querySelector<T extends HTMLElement>(selector: string) {
    return this._slotElement.querySelector(selector) as T;
  }

  private _initDom() {
    const html = ControlsTpl();
    this._slotElement.innerHTML = html;
  }

  private _initCompoment() {
    const { $options } = this._playerInstance;
    const _querySelector = this._querySelector.bind(this);
    if (!$options.live) {
      new VideoProgress(
        this._playerInstance,
        _querySelector(".player-progress-slot")
      );
    }
  }
}

export default VideoControls;
