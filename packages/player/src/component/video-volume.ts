import { EventManager, isUndef } from "@media/utils";
import { ComponentOptions } from "../types";
import Drag from "../js/drag";
import { VolumeButtonIcon } from "../config/enum";
import { CustomEvents } from "../js/event";

class VideoVolume {
  private options: ComponentOptions | null;
  private eventManager: EventManager | null;
  private dragInstance: Drag | null;
  private prevVolume = 1;
  private isMove = false;
  private isEnter = false;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    this.initAutoplay();
    this.initVolumeProgress();
    this.initDrag();
    this.initVideoListener();
    this.initVolumeListener();
    this.initListener();
  }

  private get volume() {
    const videoElement = this.options?.templateInstance?.videoElement;
    return videoElement?.volume ?? 1;
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initAutoplay() {
    const { autoplay, mute } = this.options ?? {};
    if (autoplay && mute) {
      this.setVolume(0);
    }
  }

  private initDrag() {
    const { volumeMaskElement, volumeBallElement } =
      this.options?.templateInstance ?? {};
    if (!isUndef(volumeMaskElement) && !isUndef(volumeBallElement)) {
      this.dragInstance = new Drag({
        dragElement: volumeBallElement,
        wrapperElement: volumeMaskElement
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
  }

  private initVolumeListener() {
    const { volumeButtonElement, volumeContainerElement } =
      this.options?.templateInstance ?? {};
    this.eventManager?.addEventListener({
      element: volumeButtonElement,
      eventName: "click",
      handler: this.onVolumeButtonClick.bind(this)
    });

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

  private initVolumeProgress() {
    this.prevVolume = this.volume || 1;
    this.setProgressWidth(this.volume);
  }

  private initVideoListener() {
    const videoElement = this.options?.templateInstance?.videoElement;

    this.eventManager?.addEventListener({
      element: videoElement,
      eventName: "volumechange",
      handler: this.onVideoVolumechange.bind(this)
    });
  }

  private initListener() {
    this.options?.instance.$on(CustomEvents.DESTROY, () => this.destroy());
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
    const volumeAnimationElement =
      this.options?.templateInstance?.volumeAnimationElement;
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
    const videoElement = this.options?.templateInstance?.videoElement;
    if (!isUndef(videoElement)) {
      videoElement.volume = volume;
    }
  }

  private setProgressWidth(volume: number) {
    const volumeProcessElement =
      this.options?.templateInstance?.volumeProcessElement;
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
    const volumeButtonElement =
      this.options?.templateInstance?.volumeButtonElement;
    if (!isUndef(volumeButtonElement)) {
      if (volumeButtonElement.classList.contains(VolumeButtonIcon.volume)) {
        volumeButtonElement.classList.remove(VolumeButtonIcon.volume);
      }
      if (!volumeButtonElement.classList.contains(VolumeButtonIcon.mute)) {
        volumeButtonElement.classList.add(VolumeButtonIcon.mute);
      }
    }
  }

  private showVolumeIcon() {
    const volumeButtonElement =
      this.options?.templateInstance?.volumeButtonElement;
    if (!isUndef(volumeButtonElement)) {
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

  destroy() {
    this.eventManager?.removeEventListener();
    this.dragInstance?.destroy();
  }
}

export default VideoVolume;
