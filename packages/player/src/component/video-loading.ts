import { EventManager } from "@lin-media/utils";
import { VideoReadyStateEnum } from "../config/enum";
import { PlayerEvents, VideoEvents } from "../config/event";
import PlayerConstructor from "../constructor";

class VideoLoading {
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
    // 切换清晰度前
    this.playerInstance.$on(
      PlayerEvents.SWITCH_DEFINITION_START,
      this.onBeforeSwitchDefinition.bind(this)
    );
    this.playerInstance.$on(
      VideoEvents.WAITING,
      this.onVideoWaiting.bind(this)
    );
    this.playerInstance.$on(
      VideoEvents.CANPLAY,
      this.onVideoCanplay.bind(this)
    );
  }

  // 视频缓冲事件
  private onVideoWaiting(event: Event) {
    const target = event.target as HTMLVideoElement;
    if (target.readyState !== VideoReadyStateEnum.complete) {
      // 显示loading
      this.showLoading();
    }
  }

  // 视频可播放事件
  private onVideoCanplay() {
    this.hideLoading();
  }
  // 切换清晰度的时候也要显示loading
  private onBeforeSwitchDefinition() {
    this.showLoading();
  }
  // 显示loading
  private showLoading() {
    const loadingWrapperElement =
      this.playerInstance.templateInstance.loadingWrapperElement;
    loadingWrapperElement.style.display = "flex";
  }
  // 隐藏loading
  private hideLoading() {
    const loadingWrapperElement =
      this.playerInstance.templateInstance.loadingWrapperElement;
    loadingWrapperElement.style.display = "";
  }

  private destroy() {
    this.eventManager.removeEventListener();
  }
}

export default VideoLoading;
