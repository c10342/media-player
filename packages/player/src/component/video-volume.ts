import { EventManager, isUndef } from "@media/utils";
import {
  ComponentOptions,
  HtmlElementProp,
  HTMLVideoElementProp
} from "../types";
import Drag from "../js/drag";
import { VolumeButtonIcon } from "../config/enum";

class VideoVolume {
  private options: ComponentOptions;
  private eventManager: EventManager | null;
  private volumeMaskElement: HtmlElementProp;
  private volumeBallElement: HtmlElementProp;
  private volumeButtonElement: HtmlElementProp;
  private volumeProcessElement: HtmlElementProp;
  private volumeContainerElement: HtmlElementProp;
  private videoElement: HTMLVideoElementProp;
  private volumeAnimationElement: HtmlElementProp;
  private dragInstance: Drag | null;
  private prevVolume = 1;
  private isMove = false;
  private isEnter = false;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initElement();
    this.initVar();
    this.initVolumeProgress();
    this.initDrag();
    this.initVideoListener();
    this.initVolumeListener();
  }

  private get volume() {
    return this.videoElement?.volume ?? 1;
  }

  private initElement() {
    const templateInstance = this.options.templateInstance;
    this.volumeMaskElement = templateInstance.volumeMaskElement;
    this.volumeBallElement = templateInstance.volumeBallElement;
    this.volumeButtonElement = templateInstance.volumeButtonElement;
    this.videoElement = templateInstance.videoElement;
    this.volumeProcessElement = templateInstance.volumeProcessElement;
    this.volumeContainerElement = templateInstance.volumeContainerElement;
    this.volumeAnimationElement = templateInstance.volumeAnimationElement;
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initDrag() {
    this.dragInstance = new Drag({
      dragElement: this.volumeBallElement,
      wrapperElement: this.volumeMaskElement
    });
    this.dragInstance.$on("mousemove", (percent: number) => {
      this.setVolume(percent);
      this.isMove = true;
      this.toggleAnimation();
    });
    this.dragInstance.$on("click", (percent: number) => {
      this.setPrevVolume(percent);
      this.setVolume(percent);
    });
    this.dragInstance.$on("mouseup", (percent: number) => {
      this.setPrevVolume(percent);
      this.isMove = false;
      this.toggleAnimation();
    });
  }

  private initVolumeListener() {
    const volumeButtonElement = this.volumeButtonElement;
    if (!isUndef(volumeButtonElement)) {
      this.eventManager?.addEventListener({
        element: volumeButtonElement,
        eventName: "click",
        handler: this.onVolumeButtonClick.bind(this)
      });
    }

    const volumeContainerElement = this.volumeContainerElement;
    if (!isUndef(volumeContainerElement)) {
      this.eventManager?.addEventListener({
        element: volumeContainerElement,
        eventName: "mouseenter",
        handler: this.onMouseenter.bind(this)
      });
      this.eventManager?.addEventListener({
        element: volumeContainerElement,
        eventName: "mouseleave",
        handler: this.onMouseleave.bind(this)
      });
    }
  }

  private initVolumeProgress() {
    this.prevVolume = this.volume;
    this.setProgressWidth(this.volume);
  }

  private initVideoListener() {
    const videoElement = this.videoElement;
    if (!isUndef(videoElement)) {
      this.eventManager?.addEventListener({
        element: videoElement,
        eventName: "volumechange",
        handler: this.onVideoVolumechange.bind(this)
      });
    }
  }

  private onVolumeButtonClick() {
    if (this.volume === 0) {
      this.setVolume(this.prevVolume);
    } else {
      this.setVolume(0);
    }
  }

  private onVideoVolumechange() {
    this.setProgressWidth(this.volume);
  }

  private onMouseenter() {
    this.isEnter = true;
    this.toggleAnimation();
  }

  private onMouseleave() {
    this.isEnter = false;
    this.toggleAnimation();
  }

  private toggleAnimation() {
    const volumeAnimationElement = this.volumeAnimationElement;
    if (isUndef(volumeAnimationElement)) {
      return;
    }
    if (this.isEnter || this.isMove) {
      volumeAnimationElement.style.width = "70px";
    } else {
      volumeAnimationElement.style.width = "";
    }
  }

  setVolume(volume: number) {
    const videoElement = this.videoElement;
    if (!isUndef(videoElement)) {
      videoElement.volume = volume;
    }
  }

  private setProgressWidth(volume: number) {
    const volumeProcessElement = this.volumeProcessElement;
    if (!isUndef(volumeProcessElement)) {
      volumeProcessElement.style.width = `${volume * 100}%`;
    }
    if (volume === 0) {
      //   静音
      this.showMuteIcon();
    } else {
      this.showVolumeIcon();
    }
  }

  private showMuteIcon() {
    const volumeButtonElement = this.volumeButtonElement;
    if (volumeButtonElement) {
      if (volumeButtonElement.classList.contains(VolumeButtonIcon.volume)) {
        volumeButtonElement.classList.remove(VolumeButtonIcon.volume);
      }
      if (!volumeButtonElement.classList.contains(VolumeButtonIcon.mute)) {
        volumeButtonElement.classList.add(VolumeButtonIcon.mute);
      }
    }
  }

  private showVolumeIcon() {
    const volumeButtonElement = this.volumeButtonElement;
    if (volumeButtonElement) {
      if (volumeButtonElement.classList.contains(VolumeButtonIcon.mute)) {
        volumeButtonElement.classList.remove(VolumeButtonIcon.mute);
      }
      if (!volumeButtonElement.classList.contains(VolumeButtonIcon.volume)) {
        volumeButtonElement.classList.add(VolumeButtonIcon.volume);
      }
    }
  }

  private setPrevVolume(volume: number) {
    if (volume !== 0) {
      this.prevVolume = volume;
    }
  }

  private resetData() {
    this.eventManager = null;
    this.volumeMaskElement = null;
    this.volumeBallElement = null;
    this.volumeButtonElement = null;
    this.volumeProcessElement = null;
    this.volumeContainerElement = null;
    this.videoElement = null;
    this.volumeAnimationElement = null;
    this.dragInstance = null;
  }

  destroy() {
    this.eventManager?.removeEventListener();
    this.resetData();
  }
}

export default VideoVolume;
