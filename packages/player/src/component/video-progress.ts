import { EventManager, isNumber, isUndef, secondToTime } from "@media/utils";
import { checkData } from "../js/utils";
import { ComponentOptions } from "../types";

import Drag from "../js/drag";
import AnimationHelper from "../js/animation";
import { CustomEvents, VideoEvents } from "../js/event";

class VideoProgress {
  private options: ComponentOptions;
  private currentTime = 0;
  private totalTime = 0;
  private dragInstance: Drag | null;
  private ballAnimationHelperInstance: AnimationHelper | null;
  private timeAnimationHelperInstance: AnimationHelper | null;
  private processMaskInfo: { left: number; width: number } | null;
  private isMousedown = false;
  private eventManager: EventManager;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    this.initDrag();
    this.initAnimationHelper();
    this.initProgressListener();
    this.initListener();
  }

  private initVar() {
    const clientRect =
      this.options.templateInstance.progressMaskElement?.getBoundingClientRect();
    this.processMaskInfo = {
      left: clientRect?.left || 0,
      width: clientRect?.width || 0
    };
    this.eventManager = new EventManager();
  }

  private initDrag() {
    const { progressMaskElement, progressBallElement } =
      this.options.templateInstance;
    if (!isUndef(progressMaskElement) && !isUndef(progressBallElement)) {
      this.dragInstance = new Drag({
        dragElement: progressBallElement,
        wrapperElement: progressMaskElement
      });
      this.initDragListener();
    }
  }

  private initAnimationHelper() {
    const { progressBallElement, processTimeElement } =
      this.options.templateInstance;

    if (!isUndef(progressBallElement)) {
      this.ballAnimationHelperInstance = new AnimationHelper(
        progressBallElement,
        "player-scale"
      );
    }
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
    const progressMaskElement =
      this.options.templateInstance.progressMaskElement;
    this.eventManager.addEventListener({
      element: progressMaskElement,
      eventName: "mousemove",
      handler: this.onMaskMousemove.bind(this)
    });
    this.eventManager.addEventListener({
      element: progressMaskElement,
      eventName: "mouseleave",
      handler: this.onMaskMouseleave.bind(this)
    });
  }

  private initListener() {
    const instance = this.options.instance;
    instance.$on(CustomEvents.DESTROY, this.destroy.bind(this));
    instance.$on(VideoEvents.TIMEUPDATE, this.onVideoTimeupdate.bind(this));
    instance.$on(
      VideoEvents.LOADEDMETADATA,
      this.onVideoLoadedmetadata.bind(this)
    );
    instance.$on(VideoEvents.PROGRESS, this.onVideoProgress.bind(this));
    instance.$on(VideoEvents.SEEKED, this.onVideoSeeked.bind(this));
  }

  private onMaskMousemove(event: MouseEvent) {
    this.ballAnimationHelperInstance?.show();

    this.showProcessTime(event);
  }
  private onMaskMouseleave() {
    this.ballAnimationHelperInstance?.hide();
    this.hideProcessTime();
  }

  private onVideoLoadedmetadata(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    this.totalTime = videoElement.duration ?? 0;
  }

  private onVideoTimeupdate(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    const currentTime = videoElement.currentTime ?? 0;

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

  private onVideoProgress(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    if (videoElement.buffered?.length !== 0) {
      const preloadTime = videoElement.buffered.end(0) || 0;

      this.setLoadedProgress(preloadTime);
    }
  }

  private onVideoSeeked() {
    this.isMousedown = false;
  }

  private setPlayedProgressByPercent(percent: number) {
    const videoPlayedElement = this.options.templateInstance.videoPlayedElement;
    if (!isUndef(videoPlayedElement)) {
      videoPlayedElement.style.width = `${percent * 100}%`;
    }
  }

  private setPlayedProgress() {
    const videoPlayedElement = this.options.templateInstance.videoPlayedElement;
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
    const videoLoadedElement = this.options.templateInstance.videoLoadedElement;
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
    const videoPlayedElement = this.options.templateInstance.videoPlayedElement;
    if (!isUndef(videoPlayedElement)) {
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
    const offsetTime = time - this.currentTime;
    this.setTip(offsetTime);
    this.videoSeek(time);
  }

  private setTip(offsetTime: number) {
    let tip = "";
    offsetTime = Math.round(offsetTime);
    if (offsetTime > 0) {
      tip = `前进${offsetTime}秒`;
    } else {
      tip = `后退${-offsetTime}秒`;
    }
    this.options.instance.$emit(CustomEvents.TIP, tip);
  }

  private videoSeek(time: number) {
    const videoElement = this.options.templateInstance.videoElement;
    if (!isUndef(videoElement)) {
      videoElement.currentTime = time;
    }
  }

  private showProcessTime(event: MouseEvent) {
    const processTimeElement = this.options.templateInstance.processTimeElement;
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

  destroy() {
    this.dragInstance?.destroy();
    this.ballAnimationHelperInstance?.destroy();
    this.timeAnimationHelperInstance?.destroy();
    this.eventManager.removeEventListener();
  }
}

export default VideoProgress;
