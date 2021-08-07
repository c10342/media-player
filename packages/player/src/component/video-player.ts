import { isFunction, isUndef } from "@media/utils";
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
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initElement();
    this.initPlayer();
    this.initMaskListener();
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
    if (videoMaskElement) {
      videoMaskElement.addEventListener("click", () => this.onVideoMaskClick());
    }
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
  }

  destroy() {
    this.resetData();
  }
}

export default VideoPlayer;
