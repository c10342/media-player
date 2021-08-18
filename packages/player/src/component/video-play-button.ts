import { EventManager, isUndef, PlayerEvents, VideoEvents } from "@media/utils";
import { ComponentOptions } from "../types";

import { PlayButtonIconEnum } from "../config/enum";

class VideoPlayButton {
  private options: ComponentOptions;
  private eventManager: EventManager;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    this.initPlayButtonListener();
    this.initListener();
  }

  private get instance() {
    return this.options.instance;
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initPlayButtonListener() {
    const playElement = this.options.templateInstance.playElement;
    this.eventManager.addEventListener({
      element: playElement,
      eventName: "click",
      handler: this.onPlayButtonClick.bind(this)
    });
  }

  private initListener() {
    const instance = this.instance;
    instance.$on(PlayerEvents.DESTROY, this.destroy.bind(this));
    instance.$on(VideoEvents.PLAY, this.onVideoPlay.bind(this));
    instance.$on(VideoEvents.PAUSE, this.onVideoPause.bind(this));
  }

  // 视频播放事件处理
  private onVideoPlay() {
    // 显示播放图标
    this.showPlayIcon();
  }
  // 视频暂停事件处理
  private onVideoPause() {
    // 显示暂停图标
    this.showPauseIcon();
  }

  // 点击按钮
  private onPlayButtonClick(event: MouseEvent) {
    event.stopPropagation();
    // 切换播放状态
    this.instance.toggle();
  }
  // 显示播放图标
  private showPlayIcon() {
    const playElement = this.options.templateInstance.playElement;
    if (!isUndef(playElement)) {
      if (playElement.classList.contains(PlayButtonIconEnum.Pause)) {
        playElement.classList.remove(PlayButtonIconEnum.Pause);
      }
      playElement.classList.add(PlayButtonIconEnum.Play);
    }
  }
  // 显示暂停图标
  private showPauseIcon() {
    const playElement = this.options.templateInstance.playElement;
    if (!isUndef(playElement)) {
      if (playElement.classList.contains(PlayButtonIconEnum.Play)) {
        playElement.classList.remove(PlayButtonIconEnum.Play);
      }
      playElement.classList.add(PlayButtonIconEnum.Pause);
    }
  }

  private destroy() {
    this.eventManager.removeEventListener();
  }
}

export default VideoPlayButton;
