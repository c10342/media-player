import { EventManager, isUndef } from "@media/utils";
import { VideoReadyState } from "../config/enum";
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

  private get videoReadyState() {
    const videoElement = this.options.templateInstance.videoElement;
    return videoElement?.readyState ?? -1;
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initListener() {
    const instance = this.options.instance;
    instance.$on(CustomEvents.DESTROY, this.destroy.bind(this));
    instance.$on(
      CustomEvents.SWITCH_DEFINITION_START,
      this.onBeforeSwitchDefinition.bind(this)
    );
    instance.$on(VideoEvents.WAITING, this.onVideoWaiting.bind(this));
    instance.$on(VideoEvents.CANPLAY, this.onVideoCanplay.bind(this));
  }

  private onVideoWaiting() {
    if (this.videoReadyState !== VideoReadyState.complete) {
      this.showLoading();
    }
  }
  private onVideoCanplay() {
    console.log("onVideoCanplay");

    this.hideLoading();
  }

  onBeforeSwitchDefinition() {
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
