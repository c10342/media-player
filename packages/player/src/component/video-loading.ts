import { EventManager, isUndef } from "@media/utils";
import { VideoReadyState } from "../config/enum";
import {
  ComponentOptions,
  HtmlElementProp,
  HTMLVideoElementProp
} from "../types";

class VideoLoading {
  private options: ComponentOptions;
  private videoElement: HTMLVideoElementProp;
  private loadingWrapperElement: HtmlElementProp;
  private eventManager: EventManager | null;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initElement();
    this.initVar();
    this.initVideoListener();
  }

  private get videoReadyState() {
    return this.videoElement?.readyState ?? -1;
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initElement() {
    const templateInstance = this.options.templateInstance;
    this.videoElement = templateInstance.videoElement;
    this.loadingWrapperElement = templateInstance.loadingWrapperElement;
  }

  private initVideoListener() {
    const videoElement = this.videoElement;
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
    const loadingWrapperElement = this.loadingWrapperElement;
    if (!isUndef(loadingWrapperElement)) {
      loadingWrapperElement.style.display = "flex";
    }
  }

  private hideLoading() {
    const loadingWrapperElement = this.loadingWrapperElement;
    if (!isUndef(loadingWrapperElement)) {
      loadingWrapperElement.style.display = "";
    }
  }

  resetData() {
    this.videoElement = null;
    this.loadingWrapperElement = null;
    this.eventManager = null;
  }

  destroy() {
    this.eventManager?.removeEventListener();
    this.resetData();
  }
}

export default VideoLoading;
