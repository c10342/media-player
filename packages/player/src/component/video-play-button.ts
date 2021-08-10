import { EventManager, isUndef } from "@media/utils";
import { ComponentOptions } from "../types";

import { PlayButtonIcon } from "../config/enum";
import { CustomEvents, VideoEvents } from "../js/event";

class VideoPlayButton {
  private options: ComponentOptions;
  private eventManager: EventManager;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    this.initPlayButtonListener();
    this.initListener();
  }

  private initVar() {
    this.eventManager = new EventManager();
  }
  private get paused() {
    const videoElement = this.options.templateInstance.videoElement;
    return videoElement?.paused;
  }

  private initPlayButtonListener() {
    const playElement = this.options.templateInstance.playElement;
    this.eventManager.addEventListener({
      element: playElement,
      eventName: "click",
      handler: this.onPlayButtonClick.bind(this)
    });
  }

  private initListener() {
    const instance = this.options.instance;
    instance.$on(CustomEvents.DESTROY, this.destroy.bind(this));
    instance.$on(VideoEvents.PLAY, this.onVideoPlay.bind(this));
    instance.$on(VideoEvents.PAUSE, this.onVideoPause.bind(this));
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
    const videoElement = this.options.templateInstance.videoElement;
    videoElement?.pause();
  }

  private playVideo() {
    const videoElement = this.options.templateInstance.videoElement;
    videoElement?.play();
  }

  private showPlayIcon() {
    const playElement = this.options.templateInstance.playElement;
    if (!isUndef(playElement)) {
      if (playElement.classList.contains(PlayButtonIcon.Pause)) {
        playElement.classList.remove(PlayButtonIcon.Pause);
      }
      playElement.classList.add(PlayButtonIcon.Play);
    }
  }

  private showPauseIcon() {
    const playElement = this.options.templateInstance.playElement;
    if (!isUndef(playElement)) {
      if (playElement.classList.contains(PlayButtonIcon.Play)) {
        playElement.classList.remove(PlayButtonIcon.Play);
      }
      playElement.classList.add(PlayButtonIcon.Pause);
    }
  }

  destroy() {
    this.eventManager.removeEventListener();
  }
}

export default VideoPlayButton;
