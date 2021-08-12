import { EventManager, isUndef } from "@media/utils";
import { VideoReadyStateEnum } from "../config/enum";
import { CustomEvents, VideoEvents } from "../js/event";
import { ComponentOptions } from "../types";

class VideoLoading {
  private options: ComponentOptions;
  private eventManager: EventManager;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    this.initListener();
  }

  private get instance() {
    return this.options.instance;
  }

  // 视频状态，4表示可以了
  private get videoReadyState() {
    const videoElement = this.instance.videoElement;
    return videoElement?.readyState ?? -1;
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initListener() {
    const instance = this.instance;
    instance.$on(CustomEvents.DESTROY, this.destroy.bind(this));
    // 切换清晰度前
    instance.$on(
      CustomEvents.SWITCH_DEFINITION_START,
      this.onBeforeSwitchDefinition.bind(this)
    );
    instance.$on(VideoEvents.WAITING, this.onVideoWaiting.bind(this));
    instance.$on(VideoEvents.CANPLAY, this.onVideoCanplay.bind(this));
  }

  // 视频缓冲事件
  private onVideoWaiting() {
    if (this.videoReadyState !== VideoReadyStateEnum.complete) {
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
      this.options.templateInstance.loadingWrapperElement;
    if (!isUndef(loadingWrapperElement)) {
      loadingWrapperElement.style.display = "flex";
    }
  }
  // 隐藏loading
  private hideLoading() {
    const loadingWrapperElement =
      this.options.templateInstance.loadingWrapperElement;
    if (!isUndef(loadingWrapperElement)) {
      loadingWrapperElement.style.display = "";
    }
  }

  private destroy() {
    this.eventManager.removeEventListener();
  }
}

export default VideoLoading;
