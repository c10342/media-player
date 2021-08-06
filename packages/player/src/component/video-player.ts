import { isFunction } from "@media/utils";
import Template from "../js/template";
import { PlayerOptions } from "../types";

interface VideoPlayerOptions {
  options: PlayerOptions;
  templateInstance: Template;
}

class VideoPlayer {
  private options: PlayerOptions;
  private videoElement: HTMLVideoElement | null;
  private currentIndex = 0;
  constructor(params: VideoPlayerOptions) {
    this.options = params.options;
    this.initElement(params.templateInstance);
    this.initPlayer();
  }

  private initElement(templateInstance: Template) {
    this.videoElement = templateInstance.videoElement;
  }

  private initPlayer() {
    const { customType } = this.options;
    const { videoElement } = this;
    const videoItem = this.getVideoItem();

    if (videoElement && videoItem) {
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
}

export default VideoPlayer;
