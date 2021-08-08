import { EventManager, isUndef } from "@media/utils";
import { VideoReadyState } from "../config/enum";
import { ComponentOptions } from "../types";

class VideoLoading {
  private options: ComponentOptions | null;
  private eventManager: EventManager | null;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    this.initVideoListener();
  }

  private get videoReadyState() {
    const videoElement = this.options?.templateInstance.videoElement;
    return videoElement?.readyState ?? -1;
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initVideoListener() {
    const videoElement = this.options?.templateInstance.videoElement;
    this.eventManager?.addEventListener({
      element: videoElement,
      eventName: "waiting",
      handler: this.onVideoWaiting.bind(this)
    });
    this.eventManager?.addEventListener({
      element: videoElement,
      eventName: "canplay",
      handler: this.onCanplay.bind(this)
    });
  }

  private onVideoWaiting() {
    if (this.videoReadyState !== VideoReadyState.complete) {
      this.showLoading();
    }
  }
  private onCanplay() {
    this.hideLoading();
  }

  private showLoading() {
    const loadingWrapperElement =
      this.options?.templateInstance.loadingWrapperElement;
    if (!isUndef(loadingWrapperElement)) {
      loadingWrapperElement.style.display = "flex";
    }
  }

  private hideLoading() {
    const loadingWrapperElement =
      this.options?.templateInstance.loadingWrapperElement;
    if (!isUndef(loadingWrapperElement)) {
      loadingWrapperElement.style.display = "";
    }
  }

  resetData() {
    this.eventManager = null;
    this.options = null;
  }

  destroy() {
    this.eventManager?.removeEventListener();
    this.resetData();
  }
}

export default VideoLoading;
