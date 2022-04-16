import {
  Drag,
  EventManager,
  isMobile,
  parseHtmlToDom,
  updateStyle
} from "@lin-media/utils";
import { VolumeButtonIconEnum } from "../config/enum";
import { VideoEvents } from "../config/event";
import Player from "../player";
import VolumeTpl from "../templates/volume";
import { DragDataInfo } from "../types";
import { ComponentApi } from "../types/component";

class VideoVolume implements ComponentApi {
  static shouldInit() {
    return !isMobile();
  }
  // 播放器实例
  private player: Player;
  // dom事件管理器
  private eventManager = new EventManager();
  // 组件根元素
  private rootElement: HTMLElement;

  private volumeProcessElement: HTMLElement;

  private volumeButtonElement: HTMLElement;

  private volumeAnimationElement: HTMLElement;

  private dragInstance: Drag;
  private prevVolume = 1;
  private isMove = false;
  private isEnter = false;

  constructor(player: Player, slotElement: HTMLElement) {
    // 播放器实例
    this.player = player;
    // 初始化dom
    this.initDom(slotElement);
    // 处理静音自动播放
    this.initMuted();
    // 初始化音量进度条
    this.initVolumeProgress();
    // 初始化拖拽事件
    this.initDrag();
    // 初始化事件
    this.initListener();
  }

  private initDom(slotElement: HTMLElement) {
    const parentElement = slotElement.querySelector(".player-controls-left")!;
    const html = VolumeTpl();
    this.rootElement = parseHtmlToDom(html);
    parentElement.appendChild(this.rootElement);

    this.volumeProcessElement = this.querySelector(".player-volume-process");
    this.volumeButtonElement = this.querySelector(".player-volume-button");
    this.volumeAnimationElement = this.querySelector(
      ".player-volume-animation"
    );
  }

  // 查询元素
  private querySelector<T extends HTMLElement>(selector: string) {
    return this.rootElement.querySelector(selector) as T;
  }

  private initMuted() {
    // 静音
    const { muted } = this.player.options;
    if (muted) {
      this.player.setVolume(0);
    }
  }

  // 初始化拖拽事件
  private initDrag() {
    this.dragInstance = new Drag({
      dragElement: this.querySelector(".player-volume-ball"),
      wrapperElement: this.querySelector(".player-volume-mask")
    });
    this.dragInstance.$on("mousemove", (data: DragDataInfo) => {
      // 拖拽过程中实时设置音量
      this.player.setVolume(data.percentX);
      this.isMove = true;
      // 执行动画
      this.toggleAnimation();
      // 设置通知
      this.setNotice();
    });
    this.dragInstance.$on("click", (data: DragDataInfo) => {
      // 点击的时候保存旧的音量,方便点击静音图标，切换到上一次的音量
      this.setPrevVolume(data.percentX);
      this.player.setVolume(data.percentX);
      this.setNotice();
    });
    this.dragInstance.$on("mouseup", (data: DragDataInfo) => {
      // 鼠标抬起的时候也保存旧的音量
      this.setPrevVolume(data.percentX);
      this.isMove = false;
      // 执行动画
      this.toggleAnimation();
      // 显示提示
      this.setNotice();
    });
  }

  private toggleAnimation() {
    // 鼠标进入音量容器或者正在拖拽时，需要显示容器
    updateStyle(this.volumeAnimationElement, {
      width: this.isEnter || this.isMove ? "70px" : ""
    });
  }

  // 设置通知提示
  private setNotice() {
    this.player.setNotice(
      this.player.i18n.t("volume", {
        volume: `${Math.round(this.player.volume * 100)}%`
      })
    );
  }

  // 保存上一次的音量
  private setPrevVolume(volume: number) {
    if (volume !== 0) {
      this.prevVolume = volume;
    }
  }

  // 初始化音量进度条长度
  private initVolumeProgress() {
    this.prevVolume = this.player.volume || 1;
    this.setProgressWidth(this.player.volume);
  }

  // 设置音量长度
  private setProgressWidth(volume: number) {
    updateStyle(this.volumeProcessElement, {
      width: `${volume * 100}%`
    });
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
    this.volumeButtonElement.classList.remove(VolumeButtonIconEnum.volume);
    this.volumeButtonElement.classList.add(VolumeButtonIconEnum.mute);
  }
  // 显示非静音图标
  private showVolumeIcon() {
    this.volumeButtonElement.classList.add(VolumeButtonIconEnum.volume);
    this.volumeButtonElement.classList.remove(VolumeButtonIconEnum.mute);
  }

  private initListener() {
    this.player.$on(
      VideoEvents.VOLUMECHANGE,
      this.onVideoVolumechange.bind(this)
    );

    // 音量图标
    this.eventManager.addEventListener({
      element: this.querySelector(".player-volume-button"),
      eventName: "click",
      handler: this.onVolumeButtonClick.bind(this)
    });

    // 音量容器
    this.eventManager.addEventListener({
      element: this.rootElement,
      eventName: "mouseenter",
      handler: this.onMouseenter.bind(this)
    });
    this.eventManager.addEventListener({
      element: this.rootElement,
      eventName: "mouseleave",
      handler: this.onMouseleave.bind(this)
    });
  }

  // 点击音量图标
  private onVolumeButtonClick() {
    if (this.player.volume === 0) {
      // 静音->上一次保存的音量
      this.player.setVolume(this.prevVolume);
    } else {
      // 非静音->静音
      this.player.setVolume(0);
    }
    this.setNotice();
  }

  // 鼠标进入音量容器
  private onMouseenter() {
    this.isEnter = true;
    // 切换动画
    this.toggleAnimation();
  }
  // 鼠标离开银两容器
  private onMouseleave() {
    this.isEnter = false;
    this.toggleAnimation();
  }

  // 音量发生变化事件
  private onVideoVolumechange(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    this.setProgressWidth(videoElement.volume);
  }

  destroy() {
    this.eventManager.removeEventListener();
    this.dragInstance.destroy();
  }
}

export default VideoVolume;
