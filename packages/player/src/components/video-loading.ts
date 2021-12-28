import { EventManager, parseHtmlToDom, updateStyle } from "@lin-media/utils";
import { VideoReadyStateEnum } from "../config/enum";
import { PlayerEvents, VideoEvents } from "../config/event";
import MediaPlayer from "../index";
import LoadingTpl from "../templates/loading.art";

class VideoLoading {
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
    this._initListener();
  }

  // 事件监听
  private _on(eventName: string, handler: Function) {
    this._playerInstance.$eventBus.$on(eventName, handler);
  }

  private _initDom(slotElement: HTMLElement) {
    const html = LoadingTpl();
    this._compRootElement = parseHtmlToDom(html);
    slotElement.appendChild(this._compRootElement);
  }

  private _initListener() {
    this._on(PlayerEvents.DESTROY, this._destroy.bind(this));
    // 切换清晰度前
    this._on(
      PlayerEvents.SWITCH_DEFINITION_START,
      this._onBeforeSwitchDefinition.bind(this)
    );
    this._on(VideoEvents.WAITING, this._onVideoWaiting.bind(this));
    this._on(VideoEvents.CANPLAY, this._onVideoCanplay.bind(this));
  }

  // 视频缓冲事件
  private _onVideoWaiting(event: Event) {
    const target = event.target as HTMLVideoElement;
    if (target.readyState !== VideoReadyStateEnum.complete) {
      // 显示loading
      this._showLoading();
    }
  }

  // 视频可播放事件
  private _onVideoCanplay() {
    this._hideLoading();
  }

  // 切换清晰度的时候也要显示loading
  private _onBeforeSwitchDefinition() {
    this._showLoading();
  }
  // 显示loading
  private _showLoading() {
    updateStyle(this._compRootElement, {
      display: "flex"
    });
  }
  // 隐藏loading
  private _hideLoading() {
    updateStyle(this._compRootElement, {
      display: ""
    });
  }

  private _destroy() {
    this._eventManager.removeEventListener();
  }
}

export default VideoLoading;
