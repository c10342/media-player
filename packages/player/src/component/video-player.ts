import { EventManager, isArray, isFunction, isUndef } from "@media/utils";
import { ComponentOptions } from "../types";

class VideoPlayer {
  private options: ComponentOptions | null;
  private currentIndex = 0;
  private eventManager: EventManager | null;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    this.initPlayer();
    this.initMaskListener();
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private get paused() {
    const videoElement = this.options?.templateInstance.videoElement;
    return videoElement?.paused;
  }

  private initPlayer() {
    const { customType } = this.options ?? {};
    const { videoElement } = this.options?.templateInstance ?? {};
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
    const { videoList } = this.options ?? {};
    const { currentIndex } = this;
    if (
      isArray(videoList) &&
      videoList.length !== 0 &&
      currentIndex < videoList.length &&
      currentIndex >= 0
    ) {
      return videoList[currentIndex];
    }
    return null;
  }

  private initMaskListener() {
    const videoMaskElement = this.options?.templateInstance.videoMaskElement;
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
    const videoElement = this.options?.templateInstance.videoElement;
    videoElement?.pause();
  }

  private playVideo() {
    const videoElement = this.options?.templateInstance.videoElement;
    videoElement?.play();
  }

  private resetData() {
    this.currentIndex = 0;
    this.eventManager = null;
    this.options = null;
  }

  destroy() {
    this.eventManager?.removeEventListener();
    this.resetData();
  }
}

export default VideoPlayer;
