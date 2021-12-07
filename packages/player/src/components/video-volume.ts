import { Drag, EventManager, parseHtmlToDom } from "@lin-media/utils";
import { VolumeButtonIconEnum } from "../config/enum";
import { PlayerEvents, VideoEvents } from "../config/event";
import MediaPlayer from "../index";
import VolumeTpl from "../templates/volume.art";
import { DragDataInfo } from "../types";
class VideoVolume {
  // 播放器实例
  private _playerInstance: MediaPlayer;
  // dom事件管理器
  private _eventManager = new EventManager();
  // 组件根元素
  private _compRootElement: HTMLElement;

  private _volumeProcessElement: HTMLElement;

  private _volumeButtonElement: HTMLElement;

  private _volumeAnimationElement: HTMLElement;

  private _dragInstance: Drag;
  private _prevVolume = 1;
  private _isMove = false;
  private _isEnter = false;

  constructor(playerInstance: MediaPlayer, slotElement: HTMLElement) {
    // 播放器实例
    this._playerInstance = playerInstance;
    // 初始化dom
    this._initDom(slotElement);
    // 处理静音自动播放
    this._initMuted();
    // 初始化音量进度条
    this._initVolumeProgress();
    // 初始化拖拽事件
    this._initDrag();
    // 初始化事件
    this._initListener();
  }

  private _initDom(slotElement: HTMLElement) {
    const html = VolumeTpl();
    this._compRootElement = parseHtmlToDom(html);
    slotElement.appendChild(this._compRootElement);

    this._volumeProcessElement = this._querySelector(".player-volume-process");
    this._volumeButtonElement = this._querySelector(".player-volume-button");
    this._volumeAnimationElement = this._querySelector(
      ".player-volume-animation"
    );
  }

  // 查询元素
  private _querySelector<T extends HTMLElement>(selector: string) {
    return this._compRootElement.querySelector(selector) as T;
  }

  private _initMuted() {
    // 静音
    const { muted } = this._playerInstance.$options;
    if (muted) {
      this._playerInstance.setVolume(0);
    }
  }

  // 初始化拖拽事件
  private _initDrag() {
    this._dragInstance = new Drag({
      dragElement: this._querySelector(".player-volume-ball"),
      wrapperElement: this._querySelector(".player-volume-mask")
    });
    this._dragInstance.$on("mousemove", (data: DragDataInfo) => {
      // 拖拽过程中实时设置音量
      this._playerInstance.setVolume(data.percentX);
      this._isMove = true;
      // 执行动画
      this._toggleAnimation();
      // 设置通知
      this._setNotice();
    });
    this._dragInstance.$on("click", (data: DragDataInfo) => {
      // 点击的时候保存旧的音量,方便点击静音图标，切换到上一次的音量
      this._setPrevVolume(data.percentX);
      this._playerInstance.setVolume(data.percentX);
      this._setNotice();
    });
    this._dragInstance.$on("mouseup", (data: DragDataInfo) => {
      // 鼠标抬起的时候也保存旧的音量
      this._setPrevVolume(data.percentX);
      this._isMove = false;
      // 执行动画
      this._toggleAnimation();
      // 显示提示
      this._setNotice();
    });
  }

  private _toggleAnimation() {
    // 鼠标进入音量容器或者正在拖拽时，需要显示容器
    if (this._isEnter || this._isMove) {
      this._volumeAnimationElement.style.width = "70px";
    } else {
      this._volumeAnimationElement.style.width = "";
    }
  }

  // 设置通知提示
  private _setNotice() {
    this._playerInstance.setNotice(
      this._playerInstance.$i18n.t("volume", {
        volume: `${Math.round(this._playerInstance.volume * 100)}%`
      })
    );
  }

  // 保存上一次的音量
  private _setPrevVolume(volume: number) {
    if (volume !== 0) {
      this._prevVolume = volume;
    }
  }

  // 初始化音量进度条长度
  private _initVolumeProgress() {
    this._prevVolume = this._playerInstance.volume || 1;
    this._setProgressWidth(this._playerInstance.volume);
  }

  // 设置音量长度
  private _setProgressWidth(volume: number) {
    this._volumeProcessElement.style.width = `${volume * 100}%`;
    // 静音需要显示静音图标
    if (volume === 0) {
      //   静音
      this.showMuteIcon();
    } else {
      this.showVolumeIcon();
    }
  }
  // 显示静音图标
  private showMuteIcon() {
    this._volumeButtonElement.classList.remove(VolumeButtonIconEnum.volume);
    this._volumeButtonElement.classList.add(VolumeButtonIconEnum.mute);
  }
  // 显示非静音图标
  private showVolumeIcon() {
    this._volumeButtonElement.classList.add(VolumeButtonIconEnum.volume);
    this._volumeButtonElement.classList.remove(VolumeButtonIconEnum.mute);
  }

  private _initListener() {
    this._on(PlayerEvents.DESTROY, this._destroy.bind(this));
    this._on(VideoEvents.VOLUMECHANGE, this._onVideoVolumechange.bind(this));

    // 音量图标
    this._eventManager.addEventListener({
      element: this._querySelector(".player-volume-button"),
      eventName: "click",
      handler: this._onVolumeButtonClick.bind(this)
    });

    // 音量容器
    this._eventManager.addEventListener({
      element: this._compRootElement,
      eventName: "mouseenter",
      handler: this._onMouseenter.bind(this)
    });
    this._eventManager.addEventListener({
      element: this._compRootElement,
      eventName: "mouseleave",
      handler: this._onMouseleave.bind(this)
    });
  }

  // 点击音量图标
  private _onVolumeButtonClick() {
    if (this._playerInstance.volume === 0) {
      // 静音->上一次保存的音量
      this._playerInstance.setVolume(this._prevVolume);
    } else {
      // 非静音->静音
      this._playerInstance.setVolume(0);
    }
    this._setNotice();
  }

  // 鼠标进入音量容器
  private _onMouseenter() {
    this._isEnter = true;
    // 切换动画
    this._toggleAnimation();
  }
  // 鼠标离开银两容器
  private _onMouseleave() {
    this._isEnter = false;
    this._toggleAnimation();
  }

  // 音量发生变化事件
  private _onVideoVolumechange(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    this._setProgressWidth(videoElement.volume);
  }

  // 事件监听
  private _on(eventName: string, handler: Function) {
    this._playerInstance.$eventBus.$on(eventName, handler);
  }

  private _destroy() {
    this._eventManager.removeEventListener();
    this._dragInstance.destroy();
  }
}

export default VideoVolume;
