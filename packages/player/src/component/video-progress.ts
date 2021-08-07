import { isNumber, isUndef } from "@media/utils";
import { checkData } from "../js/utils";
import {
  ComponentOptions,
  HtmlElementProp,
  HTMLVideoElementProp
} from "../types";

import Drag from "../js/drag";
import AnimationHelper from "../js/animation";

class VideoProgress {
  private options: ComponentOptions;
  private videoElement: HTMLVideoElementProp;
  private videoLoadedElement: HtmlElementProp;
  private videoPlayedElement: HtmlElementProp;
  private currentTime = 0;
  private totalTime = 0;
  private dragInstance: Drag | null;
  private animationHelperInstance: AnimationHelper | null;
  private progressMaskElement: HtmlElementProp;
  private progressBallElement: HtmlElementProp;
  private isMousedown = false;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initElement();
    this.initVideoListener();
    this.initDrag();
    this.initAnimationHelper();
    this.initProgressListener();
  }

  private initElement() {
    const templateInstance = this.options.templateInstance;
    this.videoElement = templateInstance.videoElement;
    this.videoLoadedElement = templateInstance.videoLoadedElement;
    this.videoPlayedElement = templateInstance.videoPlayedElement;
    this.progressMaskElement = templateInstance.progressMaskElement;
    this.progressBallElement = templateInstance.progressBallElement;
  }

  private initVideoListener() {
    const videoElement = this.videoElement;
    if (!isUndef(videoElement)) {
      videoElement.addEventListener("timeupdate", () =>
        this.onVideoTimeupdate()
      );
      videoElement.addEventListener("loadedmetadata", () =>
        this.onVideoLoadedmetadata()
      );
      videoElement.addEventListener("progress", () => this.onVideoProgress());
      videoElement.addEventListener("seeked", () => this.onVideoSeeked());
    }
  }

  private initDrag() {
    this.dragInstance = new Drag({
      dragElement: this.progressBallElement,
      wrapperElement: this.progressMaskElement
    });
    this.initDragListener();
  }

  private initAnimationHelper() {
    const progressBallElement = this.progressBallElement;
    if (!isUndef(progressBallElement)) {
      this.animationHelperInstance = new AnimationHelper(
        progressBallElement,
        "player-fade"
      );
    }
  }

  private initDragListener() {
    this.dragInstance?.$on("mousemove", (percent: number) => {
      this.setPlayedProgressByPercent(percent);
    });
    this.dragInstance?.$on("mousedown", () => {
      this.isMousedown = true;
      this.setTransitionDuration(0);
    });
    this.dragInstance?.$on("mouseup", (percent: number) => {
      this.setTransitionDuration();
      this.seekByPercent(percent);
    });
    this.dragInstance?.$on("click", (percent: number) => {
      this.seekByPercent(percent);
    });
  }

  private initProgressListener() {
    const progressMaskElement = this.progressMaskElement;
    if (!isUndef(progressMaskElement)) {
      progressMaskElement.addEventListener("mousemove", () =>
        this.onMaskMousemove()
      );
      progressMaskElement.addEventListener("mouseleave", () =>
        this.onMaskMouseleave()
      );
    }
  }

  private onMaskMousemove() {
    this.animationHelperInstance?.show();
  }
  private onMaskMouseleave() {
    this.animationHelperInstance?.hide();
  }

  private onVideoLoadedmetadata() {
    this.totalTime = this.videoElement?.duration || 0;
  }

  private onVideoTimeupdate() {
    const currentTime = this.videoElement?.currentTime || 0;

    const intCurrentTime = Math.floor(currentTime);
    const intPrevTime = Math.floor(this.currentTime);

    if (intCurrentTime === intPrevTime) {
      return;
    }

    this.currentTime = currentTime;
    if (!this.isMousedown) {
      this.setPlayedProgress();
    }
  }

  private onVideoProgress() {
    const videoElement = this.videoElement;
    if (!isUndef(videoElement) && videoElement.buffered?.length !== 0) {
      const preloadTime = videoElement.buffered.end(0) || 0;
      this.setLoadedProgress(preloadTime);
    }
  }

  private onVideoSeeked() {
    this.isMousedown = false;
  }

  private setPlayedProgressByPercent(percent: number) {
    const videoPlayedElement = this.videoPlayedElement;
    if (!isUndef(videoPlayedElement)) {
      videoPlayedElement.style.width = `${percent * 100}%`;
    }
  }

  private setPlayedProgress() {
    const videoPlayedElement = this.videoPlayedElement;
    if (!isUndef(videoPlayedElement)) {
      const totalTime = this.totalTime;
      const currentTime = this.currentTime;
      if (totalTime > 0 && currentTime > 0) {
        let percent = currentTime / totalTime;
        percent = checkData(percent, 0, 1);
        videoPlayedElement.style.width = `${percent * 100}%`;
      }
    }
  }

  private setLoadedProgress(preloadTime: number) {
    const videoLoadedElement = this.videoLoadedElement;
    if (!isUndef(videoLoadedElement)) {
      const totalTime = this.totalTime;
      if (totalTime > 0) {
        let percent = preloadTime / totalTime;
        percent = checkData(percent, 0, 1);
        videoLoadedElement.style.width = `${percent * 100}%`;
      }
    }
  }

  private setTransitionDuration(duration?: number) {
    const videoPlayedElement = this.videoPlayedElement;
    if (videoPlayedElement) {
      if (isNumber(duration)) {
        videoPlayedElement.style.transitionDuration = `${duration}ms`;
      } else {
        videoPlayedElement.style.transitionDuration = "";
      }
    }
  }

  private seekByPercent(percent: number) {
    percent = checkData(percent, 0, 1);
    const time = this.totalTime * percent;
    this.videoSeek(time);
  }

  private videoSeek(time: number) {
    const videoElement = this.videoElement;
    if (videoElement) {
      videoElement.currentTime = time;
    }
  }

  private resetData() {
    this.videoElement = null;
    this.videoLoadedElement = null;
    this.videoPlayedElement = null;
    this.currentTime = 0;
    this.totalTime = 0;
    this.dragInstance = null;
    this.animationHelperInstance = null;
    this.progressMaskElement = null;
    this.progressBallElement = null;
    this.isMousedown = false;
  }

  destroy() {
    this.dragInstance?.destroy();
    this.resetData();
  }
}

export default VideoProgress;
