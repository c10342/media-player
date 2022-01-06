import {
  EventManager,
  isUndef,
  parseHtmlToDom,
  PLUGINNAME,
  updateStyle
} from "@lin-media/utils";
import {
  MessageChannelEvents,
  PlayerEvents,
  VideoEvents
} from "../config/event";
import MediaPlayer from "../index";
import ControlsTpl from "../templates/controls";
import VideoProgress from "./video-progress";
import VideoPlayButton from "./video-play-button";
import VideoVolume from "./video-volume";
import VideoTime from "./video-time";
import VideoFullscreen from "./video-fullscreen";
import VideoSpeed from "./video-speed";
import VideoDefinition from "./video-definition";
import VideoLive from "./video-live";
import { ControlsObj } from "../types";
import { VIDEOCONTROLS } from "../config/constant";

class VideoControls {
  static [PLUGINNAME] = VIDEOCONTROLS;
  // 播放器实例
  private _playerInstance: MediaPlayer;
  // dom事件管理器
  private _eventManager = new EventManager();
  // 组件根元素
  private _compRootElement: HTMLElement;

  // 是否进入播放器标志位
  private _isEnter = false;
  // 定时器
  private _timer: number | null;

  constructor(playerInstance: MediaPlayer, slotElement: HTMLElement) {
    // 播放器实例
    this._playerInstance = playerInstance;
    // 初始化dom
    this._initDom(slotElement);
    // 初始化组件
    this._initComponent();
    this._initListener();
    this._initMessageChannel();
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
    const controls = $options.controls as any;
    const isMobile = this._playerInstance.$isMobile;
    const compList = [
      {
        ctor: VideoProgress,
        slot: this._querySelector(".player-controls-group"),
        init: !$options.live && controls[VideoProgress[PLUGINNAME]]
      },
      {
        ctor: VideoPlayButton,
        slot: leftSlotElement,
        init: !isMobile && controls[VideoPlayButton[PLUGINNAME]]
      },
      {
        ctor: VideoVolume,
        slot: leftSlotElement,
        init: !isMobile && controls[VideoVolume[PLUGINNAME]]
      },
      {
        ctor: VideoTime,
        slot: leftSlotElement,
        init: !$options.live && controls[VideoTime[PLUGINNAME]]
      },
      {
        ctor: VideoLive,
        slot: leftSlotElement,
        init: $options.live && controls[VideoLive[PLUGINNAME]]
      },
      {
        ctor: VideoSpeed,
        slot: rightSlotElement,
        init:
          !$options.live &&
          $options.speedList &&
          $options.speedList.length > 0 &&
          controls[VideoSpeed[PLUGINNAME]]
      },
      {
        ctor: VideoDefinition,
        slot: rightSlotElement,
        init:
          $options.videoList &&
          $options.videoList.length > 0 &&
          controls[VideoDefinition[PLUGINNAME]]
      },
      {
        ctor: VideoFullscreen,
        slot: rightSlotElement,
        init: controls[VideoFullscreen[PLUGINNAME]]
      }
    ];
    compList.forEach((item) => {
      if (item.init) {
        const name = item.ctor[PLUGINNAME];
        this._playerInstance.$children[name] = new item.ctor(
          this._playerInstance,
          item.slot
        );
      }
    });
  }
  private _initListener() {
    this._on(PlayerEvents.DESTROY, this._destroy.bind(this));

    if (!this._playerInstance.$isMobile) {
      this._on(VideoEvents.PLAY, this._onVideoPlay.bind(this));
      this._on(VideoEvents.PAUSE, this._onVideoPause.bind(this));
      this._eventManager.addEventListener({
        element: this._playerInstance.$rootElement,
        eventName: "mouseenter",
        handler: this._onMouseenter.bind(this)
      });
      this._eventManager.addEventListener({
        element: this._playerInstance.$rootElement,
        eventName: "mouseleave",
        handler: this._onMouseleave.bind(this)
      });
    }
  }

  private _initMessageChannel() {
    this._on(MessageChannelEvents.HIDECONTROLS, this._hideControls.bind(this));
    this._on(MessageChannelEvents.SHOWCONTROLS, this._showControls.bind(this));
    this._on(
      MessageChannelEvents.TOGGLECONTROLS,
      this._toggleControls.bind(this)
    );
  }

  // 视频播放事件处理
  private _onVideoPlay() {
    this._hideControls();
  }
  // 视频暂停事件处理
  private _onVideoPause() {
    this._showControls();
  }

  // 鼠标进入容器事件处理
  private _onMouseenter() {
    this._isEnter = true;
    this._showControls();
  }
  // 鼠标离开容器事件处理
  private _onMouseleave() {
    this._isEnter = false;
    this._hideControls();
  }

  private _toggleControls() {
    this._isEnter = !this._isEnter;
    if (this._isEnter) {
      this._hide();
    } else {
      this._show();
    }
  }

  // 显示控制条
  private _showControls() {
    // 非播放状态，或者鼠标在播放器内，显示出来
    if (this._playerInstance.paused || this._isEnter) {
      this._show();
    }
  }
  // 隐藏控制条
  private _hideControls(time = 4000) {
    // 销毁定时器
    this._destroyTimer();
    // 4秒后隐藏
    this._timer = window.setTimeout(() => {
      if (!this._playerInstance.paused && !this._isEnter) {
        this._hide();
      }
    }, time);
  }

  // 销毁定时器
  private _destroyTimer() {
    if (!isUndef(this._timer)) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  private _show() {
    updateStyle(this._compRootElement, {
      transform: ""
    });
    this._emit(PlayerEvents.SHOW_CONTROLS);
  }

  private _hide() {
    updateStyle(this._compRootElement, {
      transform: "translateY(100%)"
    });
    this._emit(PlayerEvents.HIDE_CONTROLS);
  }

  // 事件监听
  private _on(eventName: string, handler: Function) {
    this._playerInstance.$eventBus.$on(eventName, handler);
  }

  private _emit(eventName: string, data?: any) {
    this._playerInstance.$eventBus.$emit(eventName, data);
  }

  private _destroy() {
    this._eventManager.removeEventListener();
    this._destroyTimer();
  }
}

export default VideoControls;
