import { EventManager, Drag } from "@lin-media/utils";
import { DragDataInfo } from "../types";
import { VolumeButtonIconEnum } from "../config/enum";
import { t } from "../locale";
import { PlayerEvents, VideoEvents } from "../config/event";
import PlayerConstructor from "../constructor";

class VideoVolume {
  private playerInstance: PlayerConstructor;
  private eventManager: EventManager;
  private dragInstance: Drag;
  private prevVolume = 1;
  private isMove = false;
  private isEnter = false;
  constructor(playerInstance: PlayerConstructor) {
    this.playerInstance = playerInstance;
    this.initVar();
    // 处理静音自动播放
    this.initMuted();
    // 初始化音量进度条
    this.initVolumeProgress();
    // 初始化拖拽事件
    this.initDrag();
    // 初始化事件监听
    this.initVolumeListener();
    this.initListener();
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initMuted() {
    // 静音
    const { muted } = this.playerInstance.options;
    if (muted) {
      this.playerInstance.setVolume(0);
    }
  }
  // 初始化拖拽事件
  private initDrag() {
    const { volumeMaskElement, volumeBallElement } =
      this.playerInstance.templateInstance;
    this.dragInstance = new Drag({
      dragElement: volumeBallElement,
      wrapperElement: volumeMaskElement
    });
    this.dragInstance.$on("mousemove", (data: DragDataInfo) => {
      // 拖拽过程中实时设置音量
      this.playerInstance.setVolume(data.percentX);
      this.isMove = true;
      // 执行动画
      this.toggleAnimation();
      // 设置通知
      this.setNotice();
    });
    this.dragInstance.$on("click", (data: DragDataInfo) => {
      // 点击的时候保存旧的音量,方便点击静音图标，切换到上一次的音量
      this.setPrevVolume(data.percentX);
      this.playerInstance.setVolume(data.percentX);
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

  private initVolumeListener() {
    const { volumeButtonElement, volumeContainerElement } =
      this.playerInstance.templateInstance;
    // 音量图标
    this.eventManager.addEventListener({
      element: volumeButtonElement,
      eventName: "click",
      handler: this.onVolumeButtonClick.bind(this)
    });

    // 音量容器
    this.eventManager.addEventListener({
      element: volumeContainerElement,
      eventName: "mouseenter",
      handler: this.onMouseenter.bind(this)
    });
    this.eventManager.addEventListener({
      element: volumeContainerElement,
      eventName: "mouseleave",
      handler: this.onMouseleave.bind(this)
    });
  }

  // 初始化音量进度条长度
  private initVolumeProgress() {
    this.prevVolume = this.playerInstance.volume || 1;
    this.setProgressWidth(this.playerInstance.volume);
  }

  private initListener() {
    this.playerInstance.$on(PlayerEvents.DESTROY, () => this.destroy());
    this.playerInstance.$on(
      VideoEvents.VOLUMECHANGE,
      this.onVideoVolumechange.bind(this)
    );
  }
  // 点击音量图标
  private onVolumeButtonClick() {
    if (this.playerInstance.volume === 0) {
      // 静音->上一次保存的音量
      this.playerInstance.setVolume(this.prevVolume);
    } else {
      // 非静音->静音
      this.playerInstance.setVolume(0);
    }
    this.setNotice();
  }
  // 音量发生变化事件
  private onVideoVolumechange() {
    this.setProgressWidth(this.playerInstance.volume);
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

  private toggleAnimation() {
    const volumeAnimationElement =
      this.playerInstance.templateInstance.volumeAnimationElement;
    // 鼠标进入音量容器或者正在拖拽时，需要显示容器
    if (this.isEnter || this.isMove) {
      volumeAnimationElement.style.width = "70px";
    } else {
      volumeAnimationElement.style.width = "";
    }
  }
  // 设置通知提示
  private setNotice() {
    this.playerInstance.setNotice(
      t("volume", {
        volume: `${Math.round(this.playerInstance.volume * 100)}%`
      })
    );
  }

  // 设置音量长度
  private setProgressWidth(volume: number) {
    const volumeProcessElement =
      this.playerInstance.templateInstance.volumeProcessElement;
    volumeProcessElement.style.width = `${volume * 100}%`;
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
    const volumeButtonElement =
      this.playerInstance.templateInstance.volumeButtonElement;

    if (volumeButtonElement.classList.contains(VolumeButtonIconEnum.volume)) {
      volumeButtonElement.classList.remove(VolumeButtonIconEnum.volume);
    }
    if (!volumeButtonElement.classList.contains(VolumeButtonIconEnum.mute)) {
      volumeButtonElement.classList.add(VolumeButtonIconEnum.mute);
    }
  }
  // 显示非静音图标
  private showVolumeIcon() {
    const volumeButtonElement =
      this.playerInstance.templateInstance.volumeButtonElement;

    if (volumeButtonElement.classList.contains(VolumeButtonIconEnum.mute)) {
      volumeButtonElement.classList.remove(VolumeButtonIconEnum.mute);
    }
    if (!volumeButtonElement.classList.contains(VolumeButtonIconEnum.volume)) {
      volumeButtonElement.classList.add(VolumeButtonIconEnum.volume);
    }
  }
  // 保存上一次的音量
  private setPrevVolume(volume: number) {
    if (volume !== 0) {
      this.prevVolume = volume;
    }
  }

  private destroy() {
    this.eventManager.removeEventListener();
    this.dragInstance.destroy();
  }
}

export default VideoVolume;
