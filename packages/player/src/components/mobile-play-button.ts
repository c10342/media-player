import { EventManager, parseHtmlToDom, updateStyle } from "@lin-media/utils";
import { PlayButtonIconEnum } from "../config/enum";
import { PlayerEvents, VideoEvents } from "../config/event";
import MediaPlayer from "../index";
import MobilePlayButtonTpl from "../templates/mobile-play-button";
class MobilePlayButton {
  // 播放器实例
  private _playerInstance: MediaPlayer;
  // dom事件管理器
  private _eventManager = new EventManager();

  private _compRootElement: HTMLElement;

  constructor(playerInstance: MediaPlayer, slotElement: HTMLElement) {
    // 播放器实例
    this._playerInstance = playerInstance;
    // 初始化dom
    this._initDom(slotElement);
    this._initListener();
  }

  private _initDom(slotElement: HTMLElement) {
    const html = MobilePlayButtonTpl();
    this._compRootElement = parseHtmlToDom(html);
    slotElement.appendChild(this._compRootElement);
  }

  private _initListener() {
    this._on(VideoEvents.PLAY, this._showPlayIcon.bind(this));
    this._on(VideoEvents.PAUSE, this._showPauseIcon.bind(this));
    this._on(PlayerEvents.SHOW_CONTROLS, this._showPlayButton.bind(this));
    this._on(PlayerEvents.HIDE_CONTROLS, this._hidePlayButton.bind(this));
    this._on(PlayerEvents.DESTROY, this._destroy.bind(this));
    this._eventManager.addEventListener({
      element: this._compRootElement,
      eventName: "click",
      handler: this._onPlayButtonClick.bind(this)
    });
  }

  private _onPlayButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this._playerInstance.toggle();
  }

  // 显示播放图标
  private _showPlayIcon() {
    this._compRootElement.classList.remove(PlayButtonIconEnum.Pause);
    this._compRootElement.classList.add(PlayButtonIconEnum.Play);
  }
  // 显示暂停图标
  private _showPauseIcon() {
    this._compRootElement.classList.add(PlayButtonIconEnum.Pause);
    this._compRootElement.classList.remove(PlayButtonIconEnum.Play);
  }
  // 显示播放按钮
  private _showPlayButton() {
    updateStyle(this._compRootElement, {
      opacity: "",
      pointerEvents: ""
    });
  }
  // 隐藏播放按钮
  private _hidePlayButton() {
    updateStyle(this._compRootElement, {
      opacity: "0",
      pointerEvents: "none"
    });
  }

  private _on(eventName: string, handler: Function) {
    this._playerInstance.$eventBus.$on(eventName, handler);
  }

  private _destroy() {
    this._eventManager.removeEventListener();
  }
}

export default MobilePlayButton;
