import { EventManager, isFunction, isUndef } from "@media/utils";
import {
  ComponentOptions,
  HtmlElementProp,
  HTMLVideoElementProp
} from "../types";

class VideoPlayer {
  private options: ComponentOptions;
  private videoElement: HTMLVideoElementProp;
  private videoMaskElement: HtmlElementProp;
  private currentIndex = 0;
  private eventManager: EventManager | null;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initElement();
    this.initVar();
    this.initPlayer();
    this.initMaskListener();
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private get paused() {
    return this.videoElement?.paused;
  }

  private initElement() {
    const templateInstance = this.options.templateInstance;
    this.videoElement = templateInstance.videoElement;
    this.videoMaskElement = templateInstance.videoMaskElement;
  }

  private initPlayer() {
    const { customType } = this.options;
    const { videoElement } = this;
    const videoItem = this.getVideoItem();

    if (!isUndef(videoElement) && videoItem) {
      if (isFunction(customType)) {
        customType(videoElement, videoItem);
      } else {
        videoElement.src = videoItem.url;
      }
    }
  }

  private getVideoItem() {
    const { videoList } = this.options;
    const { currentIndex } = this;
    if (
      videoList.length !== 0 &&
      currentIndex < videoList.length &&
      currentIndex >= 0
    ) {
      return videoList[currentIndex];
    }
    return null;
  }

  private initMaskListener() {
    const videoMaskElement = this.videoMaskElement;
    this.eventManager?.addEventListener({
      element: videoMaskElement,
      eventName: "click",
      handler: this.onVideoMaskClick.bind(this)
    });
  }

  private onVideoMaskClick() {
    this.togglePlay();
  }

  private togglePlay() {
    if (this.paused) {
      this.playVideo();
    } else {
      this.pauseVideo();
    }
  }

  private pauseVideo() {
    this.videoElement?.pause();
  }

  private playVideo() {
    this.videoElement?.play();
  }

  private resetData() {
    this.videoElement = null;
    this.videoMaskElement = null;
    this.currentIndex = 0;
    this.eventManager = null;
  }

  destroy() {
    this.eventManager?.removeEventListener();
    this.resetData();
  }
}

export default VideoPlayer;
