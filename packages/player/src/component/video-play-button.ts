import { EventManager } from "@lin-media/utils";

import { PlayButtonIconEnum } from "../config/enum";
import { PlayerEvents, VideoEvents } from "../config/event";
import PlayerConstructor from "../constructor";

class VideoPlayButton {
  private playerInstance: PlayerConstructor;
  private eventManager: EventManager;
  constructor(playerInstance: PlayerConstructor) {
    this.playerInstance = playerInstance;
    this.initVar();
    this.initListener();
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initListener() {
    this.playerInstance.$on(PlayerEvents.DESTROY, this.destroy.bind(this));
    this.playerInstance.$on(VideoEvents.PLAY, this.onVideoPlay.bind(this));
    this.playerInstance.$on(VideoEvents.PAUSE, this.onVideoPause.bind(this));
    this.eventManager.addEventListener({
      element: this.playerInstance.templateInstance.playElement,
      eventName: "click",
      handler: this.onPlayButtonClick.bind(this)
    });
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
    this.playerInstance.toggle();
  }
  // 显示播放图标
  private showPlayIcon() {
    const playElement = this.playerInstance.templateInstance.playElement;
    playElement.classList.remove(PlayButtonIconEnum.Pause);

    playElement.classList.add(PlayButtonIconEnum.Play);
  }
  // 显示暂停图标
  private showPauseIcon() {
    const playElement = this.playerInstance.templateInstance.playElement;
    playElement.classList.remove(PlayButtonIconEnum.Play);
    playElement.classList.add(PlayButtonIconEnum.Pause);
  }

  private destroy() {
    this.eventManager.removeEventListener();
  }
}

export default VideoPlayButton;
