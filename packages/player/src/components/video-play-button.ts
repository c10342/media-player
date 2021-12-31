import { EventManager, parseHtmlToDom } from "@lin-media/utils";
import { PlayButtonIconEnum } from "../config/enum";
import { PlayerEvents, VideoEvents } from "../config/event";
import MediaPlayer from "../index";
import PlayButtonTpl from "../templates/play-button";

class VideoPlayButton {
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

  private _initDom(slotElement: HTMLElement) {
    const html = PlayButtonTpl();
    this._compRootElement = parseHtmlToDom(html);
    slotElement.appendChild(this._compRootElement);
  }

  private _initListener() {
    this._on(PlayerEvents.DESTROY, this._destroy.bind(this));
    this._on(VideoEvents.PLAY, this._onVideoPlay.bind(this));
    this._on(VideoEvents.PAUSE, this._onVideoPause.bind(this));
    this._eventManager.addEventListener({
      element: this._compRootElement,
      eventName: "click",
      handler: this._onPlayButtClick.bind(this)
    });
  }

  // 视频播放事件处理
  private _onVideoPlay() {
    // 显示播放图标
    this._showPlayIcon();
  }
  // 视频暂停事件处理
  private _onVideoPause() {
    // 显示暂停图标
    this._showPauseIcon();
  }

  // 显示播放图标
  private _showPlayIcon() {
    this._compRootElement.classList.remove(PlayButtonIconEnum.Pause);

    this._compRootElement.classList.add(PlayButtonIconEnum.Play);
  }
  // 显示暂停图标
  private _showPauseIcon() {
    this._compRootElement.classList.remove(PlayButtonIconEnum.Play);
    this._compRootElement.classList.add(PlayButtonIconEnum.Pause);
  }

  private _onPlayButtClick(event: MouseEvent) {
    event.stopPropagation();
    // 切换播放状态
    this._playerInstance.toggle();
  }

  // 事件监听
  private _on(eventName: string, handler: Function) {
    this._playerInstance.$eventBus.$on(eventName, handler);
  }

  private _destroy() {
    this._eventManager.removeEventListener();
  }
}

export default VideoPlayButton;
