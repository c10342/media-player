import { EventManager, isUndef } from "@media/utils";
import { ComponentOptions } from "../types";
import Drag from "../js/drag";
import { VolumeButtonIconEnum } from "../config/enum";
import { CustomEvents, VideoEvents } from "../js/event";
import { t } from "../locale";

class VideoVolume {
  private options: ComponentOptions;
  private eventManager: EventManager;
  private dragInstance: Drag;
  private prevVolume = 1;
  private isMove = false;
  private isEnter = false;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    this.initAutoplay();
    this.initVolumeProgress();
    this.initDrag();
    this.initVolumeListener();
    this.initListener();
  }

  get instance() {
    return this.options.instance;
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initAutoplay() {
    const { autoplay, muted } = this.options;
    if (autoplay && muted) {
      this.instance.setVolume(0);
    }
  }

  private initDrag() {
    const { volumeMaskElement, volumeBallElement } =
      this.options.templateInstance;
    if (!isUndef(volumeMaskElement) && !isUndef(volumeBallElement)) {
      this.dragInstance = new Drag({
        dragElement: volumeBallElement,
        wrapperElement: volumeMaskElement
      });
      this.dragInstance.$on("mousemove", (percent: number) => {
        this.instance.setVolume(percent);
        this.isMove = true;
        this.toggleAnimation();
        this.setNotice();
      });
      this.dragInstance.$on("click", (percent: number) => {
        this.setPrevVolume(percent);
        this.instance.setVolume(percent);
        this.setNotice();
      });
      this.dragInstance.$on("mouseup", (percent: number) => {
        this.setPrevVolume(percent);
        this.isMove = false;
        this.toggleAnimation();
        this.setNotice();
      });
    }
  }

  private initVolumeListener() {
    const { volumeButtonElement, volumeContainerElement } =
      this.options.templateInstance;
    this.eventManager.addEventListener({
      element: volumeButtonElement,
      eventName: "click",
      handler: this.onVolumeButtonClick.bind(this)
    });

    this.eventManager.addEventListener({
      element: volumeContainerElement,
      eventName: "mouseenter",
      handler: this.onMouseenter.bind(this)
    });
    this.eventManager.addEventListener({
      element: volumeContainerElement,
      eventName: "mouseleave",
      handler: this.onMouseleave.bind(this)
    });
  }

  private initVolumeProgress() {
    this.prevVolume = this.instance.volume || 1;
    this.setProgressWidth(this.instance.volume);
  }

  private initListener() {
    const instance = this.options.instance;
    instance.$on(CustomEvents.DESTROY, () => this.destroy());
    instance.$on(VideoEvents.VOLUMECHANGE, this.onVideoVolumechange.bind(this));
  }

  private onVolumeButtonClick() {
    if (this.instance.volume === 0) {
      this.instance.setVolume(this.prevVolume);
    } else {
      this.instance.setVolume(0);
    }
    this.setNotice();
  }

  private onVideoVolumechange() {
    this.setProgressWidth(this.instance.volume);
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
      this.options.templateInstance.volumeAnimationElement;
    if (isUndef(volumeAnimationElement)) {
      return;
    }
    if (this.isEnter || this.isMove) {
      volumeAnimationElement.style.width = "70px";
    } else {
      volumeAnimationElement.style.width = "";
    }
  }

  private setNotice() {
    this.instance.setNotice(
      t("volume", { volume: `${Math.round(this.instance.volume * 100)}%` })
    );
  }

  private setProgressWidth(volume: number) {
    const volumeProcessElement =
      this.options.templateInstance.volumeProcessElement;
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
      this.options.templateInstance.volumeButtonElement;
    if (!isUndef(volumeButtonElement)) {
      if (volumeButtonElement.classList.contains(VolumeButtonIconEnum.volume)) {
        volumeButtonElement.classList.remove(VolumeButtonIconEnum.volume);
      }
      if (!volumeButtonElement.classList.contains(VolumeButtonIconEnum.mute)) {
        volumeButtonElement.classList.add(VolumeButtonIconEnum.mute);
      }
    }
  }

  private showVolumeIcon() {
    const volumeButtonElement =
      this.options.templateInstance.volumeButtonElement;
    if (!isUndef(volumeButtonElement)) {
      if (volumeButtonElement.classList.contains(VolumeButtonIconEnum.mute)) {
        volumeButtonElement.classList.remove(VolumeButtonIconEnum.mute);
      }
      if (
        !volumeButtonElement.classList.contains(VolumeButtonIconEnum.volume)
      ) {
        volumeButtonElement.classList.add(VolumeButtonIconEnum.volume);
      }
    }
  }

  private setPrevVolume(volume: number) {
    if (volume !== 0) {
      this.prevVolume = volume;
    }
  }

  destroy() {
    this.eventManager.removeEventListener();
    this.dragInstance.destroy();
  }
}

export default VideoVolume;
