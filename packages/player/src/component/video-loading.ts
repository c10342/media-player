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
    instance.$on(
      CustomEvents.SWITCH_DEFINITION_START,
      this.onBeforeSwitchDefinition.bind(this)
    );
    instance.$on(VideoEvents.WAITING, this.onVideoWaiting.bind(this));
    instance.$on(VideoEvents.CANPLAY, this.onVideoCanplay.bind(this));
  }

  private onVideoWaiting() {
    if (this.videoReadyState !== VideoReadyStateEnum.complete) {
      this.showLoading();
    }
  }
  private onVideoCanplay() {
    this.hideLoading();
  }

  private onBeforeSwitchDefinition() {
    this.showLoading();
  }

  private showLoading() {
    const loadingWrapperElement =
      this.options.templateInstance.loadingWrapperElement;
    if (!isUndef(loadingWrapperElement)) {
      loadingWrapperElement.style.display = "flex";
    }
  }

  private hideLoading() {
    const loadingWrapperElement =
      this.options.templateInstance.loadingWrapperElement;
    if (!isUndef(loadingWrapperElement)) {
      loadingWrapperElement.style.display = "";
    }
  }

  destroy() {
    this.eventManager.removeEventListener();
  }
}

export default VideoLoading;
