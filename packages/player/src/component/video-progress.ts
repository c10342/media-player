import { EventManager, isNumber, isUndef, secondToTime } from "@media/utils";
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
  private ballAnimationHelperInstance: AnimationHelper | null;
  private timeAnimationHelperInstance: AnimationHelper | null;
  private progressMaskElement: HtmlElementProp;
  private progressBallElement: HtmlElementProp;
  private processTimeElement: HtmlElementProp;
  private processMaskInfo: { left: number; width: number } | null;
  private isMousedown = false;
  private eventManager: EventManager | null;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initElement();
    this.initVar();
    this.initVideoListener();
    this.initDrag();
    this.initAnimationHelper();
    this.initProgressListener();
  }

  private initVar() {
    const clientRect = this.progressMaskElement?.getBoundingClientRect();
    this.processMaskInfo = {
      left: clientRect?.left || 0,
      width: clientRect?.width || 0
    };
    this.eventManager = new EventManager();
  }

  private initElement() {
    const templateInstance = this.options.templateInstance;
    this.videoElement = templateInstance.videoElement;
    this.videoLoadedElement = templateInstance.videoLoadedElement;
    this.videoPlayedElement = templateInstance.videoPlayedElement;
    this.progressMaskElement = templateInstance.progressMaskElement;
    this.progressBallElement = templateInstance.progressBallElement;
    this.processTimeElement = templateInstance.processTimeElement;
  }

  private initVideoListener() {
    const videoElement = this.videoElement;
    this.eventManager?.addEventListener({
      element: videoElement,
      eventName: "timeupdate",
      handler: this.onVideoTimeupdate.bind(this)
    });
    this.eventManager?.addEventListener({
      element: videoElement,
      eventName: "loadedmetadata",
      handler: this.onVideoLoadedmetadata.bind(this)
    });
    this.eventManager?.addEventListener({
      element: videoElement,
      eventName: "progress",
      handler: this.onVideoProgress.bind(this)
    });
    this.eventManager?.addEventListener({
      element: videoElement,
      eventName: "seeked",
      handler: this.onVideoSeeked.bind(this)
    });
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
      this.ballAnimationHelperInstance = new AnimationHelper(
        progressBallElement,
        "player-scale"
      );
    }

    const processTimeElement = this.processTimeElement;
    if (!isUndef(processTimeElement)) {
      this.timeAnimationHelperInstance = new AnimationHelper(
        processTimeElement,
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
    this.eventManager?.addEventListener({
      element: progressMaskElement,
      eventName: "mousemove",
      handler: this.onMaskMousemove.bind(this)
    });
    this.eventManager?.addEventListener({
      element: progressMaskElement,
      eventName: "mouseleave",
      handler: this.onMaskMouseleave.bind(this)
    });
  }

  private onMaskMousemove(event: MouseEvent) {
    this.ballAnimationHelperInstance?.show();

    this.showProcessTime(event);
  }
  private onMaskMouseleave() {
    this.ballAnimationHelperInstance?.hide();
    this.hideProcessTime();
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

  private showProcessTime(event: MouseEvent) {
    const processTimeElement = this.processTimeElement;
    if (!isUndef(processTimeElement) && !isUndef(this.processMaskInfo)) {
      const { left, width } = this.processMaskInfo;
      let offsetX = event.pageX - left;
      offsetX = checkData(offsetX, 0, width);
      processTimeElement.style.left = `${offsetX}px`;
      const time = this.totalTime * (offsetX / width);
      processTimeElement.innerHTML = secondToTime(time);
      this.timeAnimationHelperInstance?.show();
    }
  }

  private hideProcessTime() {
    this.timeAnimationHelperInstance?.hide();
  }

  private resetData() {
    this.videoElement = null;
    this.videoLoadedElement = null;
    this.videoPlayedElement = null;
    this.currentTime = 0;
    this.totalTime = 0;
    this.dragInstance = null;
    this.ballAnimationHelperInstance = null;
    this.timeAnimationHelperInstance = null;
    this.progressMaskElement = null;
    this.progressBallElement = null;
    this.processTimeElement = null;
    this.processMaskInfo = null;
    this.isMousedown = false;
    this.eventManager = null;
  }

  destroy() {
    this.dragInstance?.destroy();
    this.eventManager?.removeEventListener();
    this.resetData();
  }
}

export default VideoProgress;
