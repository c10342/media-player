import { EventManager, parseHtmlToDom, updateStyle } from "@lin-media/utils";
import {
  FLOATBUTTONENTERCLASSNAME,
  FLOATBUTTONLEAVECLASSNAME,
  VIDEOFLOATBUTTON
} from "../config/constant";
import { PlayButtonIconEnum } from "../config/enum";
import { PlayerEvents, VideoEvents } from "../config/event";
import MediaPlayer from "../index";
import FloatButtonTpl from "../templates/float-button";
class VideoFloatButton {
  static pluginName = VIDEOFLOATBUTTON;
  // 播放器实例
  private _playerInstance: MediaPlayer;
  // dom事件管理器
  private _eventManager = new EventManager();

  private _compRootElement: HTMLElement;

  private _iconElement: HTMLElement;

  private _isShow = true;

  constructor(playerInstance: MediaPlayer, slotElement: HTMLElement) {
    // 播放器实例
    this._playerInstance = playerInstance;
    // 初始化dom
    this._initDom(slotElement);
    this._initListener();
  }

  private _initDom(slotElement: HTMLElement) {
    const html = FloatButtonTpl();
    this._compRootElement = parseHtmlToDom(html);
    slotElement.appendChild(this._compRootElement);
    this._iconElement = this._compRootElement.querySelector(
      ".player-float-button-icon"
    )!;
  }

  private _initListener() {
    this._on(VideoEvents.PLAY, this._onPlay.bind(this));
    this._on(VideoEvents.PAUSE, this._onPause.bind(this));
    if (this._playerInstance.$isMobile) {
      this._on(
        PlayerEvents.SHOW_CONTROLS,
        this.__showPlayButtonAnimation.bind(this)
      );
      this._on(
        PlayerEvents.HIDE_CONTROLS,
        this._hidePlayButtonAnimation.bind(this)
      );
    }
    this._on(PlayerEvents.DESTROY, this._destroy.bind(this));
    this._eventManager.addEventListener({
      element: this._compRootElement,
      eventName: "click",
      handler: this._onPlayButtonClick.bind(this)
    });
    this._eventManager.addEventListener({
      element: this._compRootElement,
      eventName: "animationend",
      handler: this._onAnimationend.bind(this)
    });
  }

  private _onPlayButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this._playerInstance.toggle();
  }

  private _onPlay() {
    this._showPlayIcon();
    if (!this._playerInstance.$isMobile) {
      this._hidePlayButtonAnimation();
    }
  }

  private _onPause() {
    this._showPauseIcon();
    if (!this._playerInstance.$isMobile) {
      this.__showPlayButtonAnimation();
    }
  }

  // 显示播放图标
  private _showPlayIcon() {
    this._iconElement.classList.remove(PlayButtonIconEnum.Pause);
    this._iconElement.classList.add(PlayButtonIconEnum.Play);
  }
  // 显示暂停图标
  private _showPauseIcon() {
    this._iconElement.classList.add(PlayButtonIconEnum.Pause);
    this._iconElement.classList.remove(PlayButtonIconEnum.Play);
  }
  private _hidePlayButtonAnimation() {
    this._compRootElement.classList.remove(FLOATBUTTONENTERCLASSNAME);
    this._compRootElement.classList.add(FLOATBUTTONLEAVECLASSNAME);
    this._isShow = false;
  }

  private __showPlayButtonAnimation() {
    this._showPlayButton();
    this._compRootElement.classList.remove(FLOATBUTTONLEAVECLASSNAME);
    this._compRootElement.classList.add(FLOATBUTTONENTERCLASSNAME);
    this._isShow = true;
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

  private _onAnimationend(event: Event) {
    const target = event.target as HTMLElement;
    if (this._isShow) {
      target.classList.remove(FLOATBUTTONENTERCLASSNAME);
    } else {
      this._hidePlayButton();
      target.classList.remove(FLOATBUTTONLEAVECLASSNAME);
    }
  }

  private _on(eventName: string, handler: Function) {
    this._playerInstance.$eventBus.$on(eventName, handler);
  }

  private _destroy() {
    this._eventManager.removeEventListener();
  }
}

export default VideoFloatButton;
