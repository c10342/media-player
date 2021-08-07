import { isUndef } from "@media/utils";
import {
  ComponentOptions,
  HtmlElementProp,
  HTMLVideoElementProp
} from "../types";

import { PlayButtonIcon } from "../config/enum";

class VideoPlayButton {
  private options: ComponentOptions;
  private playElement: HtmlElementProp;
  private videoElement: HTMLVideoElementProp;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initElement();
    this.initVideoListener();
    this.initPlayButtonListener();
  }
  private get paused() {
    return this.videoElement?.paused;
  }

  private initElement() {
    const templateInstance = this.options.templateInstance;
    this.playElement = templateInstance.playElement;
    this.videoElement = templateInstance.videoElement;
  }

  private initVideoListener() {
    const videoElement = this.videoElement;
    if (!isUndef(videoElement)) {
      videoElement.addEventListener("play", () => this.onVideoPlay());
      videoElement.addEventListener("pause", () => this.onVideoPause());
    }
  }

  private initPlayButtonListener() {
    const playElement = this.playElement;
    if (!isUndef(playElement)) {
      playElement.addEventListener("click", (event) =>
        this.onPlayButtonClick(event)
      );
    }
  }

  private onVideoPlay() {
    this.showPlayIcon();
  }

  private onVideoPause() {
    this.showPauseIcon();
  }

  private onPlayButtonClick(event: MouseEvent) {
    event.stopPropagation();
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

  private showPlayIcon() {
    const playElement = this.playElement;
    if (playElement) {
      if (playElement.classList.contains(PlayButtonIcon.Pause)) {
        playElement.classList.remove(PlayButtonIcon.Pause);
      }
      playElement.classList.add(PlayButtonIcon.Play);
    }
  }

  private showPauseIcon() {
    const playElement = this.playElement;
    if (playElement) {
      if (playElement.classList.contains(PlayButtonIcon.Play)) {
        playElement.classList.remove(PlayButtonIcon.Play);
      }
      playElement.classList.add(PlayButtonIcon.Pause);
    }
  }

  private resetData() {
    this.playElement = null;
    this.videoElement = null;
  }

  destroy() {
    this.resetData();
  }
}

export default VideoPlayButton;
