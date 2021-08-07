import { EventManager, isUndef, secondToTime } from "@media/utils";
import {
  ComponentOptions,
  HtmlElementProp,
  HTMLVideoElementProp
} from "../types";

class VideoTime {
  private options: ComponentOptions;
  private currentTimeElement: HtmlElementProp;
  private totalTimeElement: HtmlElementProp;
  private videoElement: HTMLVideoElementProp;
  private currentTime = 0;
  private eventManager: EventManager | null;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initElement();
    this.initVar();
    this.initVideoListener();
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initElement() {
    const templateInstance = this.options.templateInstance;
    this.currentTimeElement = templateInstance.currentTimeElement;
    this.totalTimeElement = templateInstance.totalTimeElement;
    this.videoElement = templateInstance.videoElement;
  }

  private initVideoListener() {
    const videoElement = this.videoElement;
    this.eventManager?.addEventListener({
      element: videoElement,
      eventName: "loadedmetadata",
      handler: this.onVideoLoadedmetadata.bind(this)
    });
    this.eventManager?.addEventListener({
      element: videoElement,
      eventName: "timeupdate",
      handler: this.onVideoTimeupdate.bind(this)
    });
  }

  private onVideoLoadedmetadata() {
    const duration = this.videoElement?.duration || 0;
    this.setTotalTime(duration);
  }

  private onVideoTimeupdate() {
    const currentTime = this.videoElement?.currentTime || 0;

    const intCurrentTime = Math.floor(currentTime);
    const intPrevTime = Math.floor(this.currentTime);

    if (intCurrentTime === intPrevTime) {
      return;
    }

    this.currentTime = currentTime;

    this.setCurrentTime(currentTime);
  }

  private setTotalTime(duration: number) {
    const totalTimeElement = this.totalTimeElement;
    if (!isUndef(totalTimeElement)) {
      totalTimeElement.innerHTML = secondToTime(duration);
    }
  }

  private setCurrentTime(currentTime: number) {
    const currentTimeElement = this.currentTimeElement;
    if (!isUndef(currentTimeElement)) {
      currentTimeElement.innerHTML = secondToTime(currentTime);
    }
  }

  private resetData() {
    this.currentTimeElement = null;
    this.totalTimeElement = null;
    this.videoElement = null;
    this.currentTime = 0;
    this.eventManager = null;
  }

  destroy() {
    this.eventManager?.removeEventListener();
    this.resetData();
  }
}

export default VideoTime;
