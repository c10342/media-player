import { EventManager, isUndef } from "@media/utils";
import { ComponentOptions } from "../types";

import { PlayButtonIconEnum } from "../config/enum";
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

  private get instance() {
    return this.options.instance;
  }

  private initVar() {
    this.eventManager = new EventManager();
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
    const instance = this.instance;
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
    this.instance.toggle();
  }

  private showPlayIcon() {
    const playElement = this.options.templateInstance.playElement;
    if (!isUndef(playElement)) {
      if (playElement.classList.contains(PlayButtonIconEnum.Pause)) {
        playElement.classList.remove(PlayButtonIconEnum.Pause);
      }
      playElement.classList.add(PlayButtonIconEnum.Play);
    }
  }

  private showPauseIcon() {
    const playElement = this.options.templateInstance.playElement;
    if (!isUndef(playElement)) {
      if (playElement.classList.contains(PlayButtonIconEnum.Play)) {
        playElement.classList.remove(PlayButtonIconEnum.Play);
      }
      playElement.classList.add(PlayButtonIconEnum.Pause);
    }
  }

  destroy() {
    this.eventManager.removeEventListener();
  }
}

export default VideoPlayButton;
