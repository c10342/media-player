import { EventManager, isUndef } from "@media/utils";
import { VideoReadyState } from "../config/enum";
import { CustomEvents } from "../js/event";
import { ComponentOptions } from "../types";

class VideoLoading {
  private options: ComponentOptions;
  private eventManager: EventManager;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    this.initVideoListener();
    this.initListener();
  }

  private get videoReadyState() {
    const videoElement = this.options.templateInstance.videoElement;
    return videoElement?.readyState ?? -1;
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initVideoListener() {
    const videoElement = this.options.templateInstance.videoElement;
    this.eventManager.addEventListener({
      element: videoElement,
      eventName: "waiting",
      handler: this.onVideoWaiting.bind(this)
    });
    this.eventManager.addEventListener({
      element: videoElement,
      eventName: "canplay",
      handler: this.onCanplay.bind(this)
    });
  }

  private initListener() {
    const instance = this.options.instance;
    instance.$on(CustomEvents.DESTROY, () => this.destroy());
    instance.$on(CustomEvents.SWITCH_DEFINITION_START, () =>
      this.onBeforeSwitchDefinition()
    );
  }

  private onVideoWaiting() {
    if (this.videoReadyState !== VideoReadyState.complete) {
      this.showLoading();
    }
  }
  private onCanplay() {
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
