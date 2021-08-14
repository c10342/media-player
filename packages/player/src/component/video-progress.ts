import {
  EventManager,
  isNumber,
  isUndef,
  secondToTime,
  checkData,
  Drag
} from "@media/utils";
import { ComponentOptions, DragDataInfo } from "../types";
import { CustomEvents, VideoEvents } from "../js/event";
import { t } from "../locale";

class VideoProgress {
  private options: ComponentOptions;
  private currentTime = 0;
  private dragInstance: Drag | null;
  private isMousedown = false;
  private eventManager: EventManager;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    // 初始化拖拽事件
    this.initDrag();
    // 初始化进度条事件
    this.initProgressListener();
    this.initListener();
  }

  private get instance() {
    return this.options.instance;
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  // 获取进度条容器信息
  private getProcessMaskInfo() {
    const clientRect =
      this.options.templateInstance.progressMaskElement?.getBoundingClientRect();
    return {
      left: clientRect?.left || 0,
      width: clientRect?.width || 0
    };
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

  private initDragListener() {
    // 鼠标移动
    this.dragInstance?.$on("mousemove", (data: DragDataInfo) => {
      // 设置进度条
      this.setPlayedProgressByPercent(data.percentX);
    });
    // 鼠标按下
    this.dragInstance?.$on("mousedown", () => {
      this.isMousedown = true;
      // 禁止进行过渡动画
      this.setTransitionDuration(0);
    });
    // 鼠标抬起
    this.dragInstance?.$on("mouseup", (data: DragDataInfo) => {
      // 回复过度动画
      this.setTransitionDuration();
      // 跳转到时间
      this.seekByPercent(data.percentX);
    });
    // 点击事件
    this.dragInstance?.$on("click", (data: DragDataInfo) => {
      // 跳转时间
      this.seekByPercent(data.percentX);
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
    const instance = this.instance;
    instance.$on(CustomEvents.DESTROY, this.destroy.bind(this));
    instance.$on(VideoEvents.TIMEUPDATE, this.onVideoTimeupdate.bind(this));
    instance.$on(VideoEvents.PROGRESS, this.onVideoProgress.bind(this));
    instance.$on(VideoEvents.SEEKED, this.onVideoSeeked.bind(this));
  }

  // 鼠标进入进度条容器
  private onMaskMousemove(event: MouseEvent) {
    // 显示时间提示
    this.showProcessTime(event);
  }
  // 鼠标离开进度条容器
  private onMaskMouseleave() {
    // 隐藏时间提示
    this.hideProcessTime();
  }
  // 视频正在播放
  private onVideoTimeupdate(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    const currentTime = videoElement.currentTime || 0;

    const intCurrentTime = Math.floor(currentTime);
    const intPrevTime = Math.floor(this.currentTime);
    // 保证每一秒触发一次，防抖
    if (intCurrentTime === intPrevTime) {
      return;
    }

    this.currentTime = currentTime;
    if (!this.isMousedown) {
      // 不是在拖拽进度条的时候需要更新进度条
      this.setPlayedProgress();
    }
  }
  // 视频缓冲事件
  private onVideoProgress(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    if (videoElement.buffered?.length !== 0) {
      const preloadTime = videoElement.buffered.end(0) || 0;
      this.setLoadedProgress(preloadTime);
    }
  }
  // 视频完成跳转，seek的时候
  private onVideoSeeked() {
    this.isMousedown = false;
  }
  // 根据百分比设置已播放的长度
  private setPlayedProgressByPercent(percent: number) {
    const videoPlayedElement = this.options.templateInstance.videoPlayedElement;
    if (!isUndef(videoPlayedElement)) {
      videoPlayedElement.style.width = `${percent * 100}%`;
    }
  }
  // 设置已播放的进度
  private setPlayedProgress() {
    const videoPlayedElement = this.options.templateInstance.videoPlayedElement;
    if (!isUndef(videoPlayedElement)) {
      const duration = this.instance.duration;
      const currentTime = this.currentTime;
      if (duration > 0 && currentTime > 0) {
        // 计算出百分比
        let percent = currentTime / duration;
        percent = checkData(percent, 0, 1);
        videoPlayedElement.style.width = `${percent * 100}%`;
      }
    }
  }
  // 设置缓冲的进度
  private setLoadedProgress(preloadTime: number) {
    const videoLoadedElement = this.options.templateInstance.videoLoadedElement;
    if (!isUndef(videoLoadedElement)) {
      const duration = this.instance.duration;

      if (duration > 0) {
        let percent = preloadTime / duration;
        percent = checkData(percent, 0, 1);
        videoLoadedElement.style.width = `${percent * 100}%`;
      }
    }
  }
  // 设置过度时长
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

  // 根据百分比跳转到指定时间
  private seekByPercent(percent: number) {
    if (this.instance.duration > 0) {
      percent = checkData(percent, 0, 1);
      // 时间点
      const time = this.instance.duration * percent;
      // 计算前进或者后退了多少秒
      const offsetTime = time - this.currentTime;
      this.setTip(offsetTime);
      // 跳转
      this.instance.seek(time);
    }
  }
  // 显示通知
  private setTip(offsetTime: number) {
    offsetTime = Math.round(offsetTime);
    let tip = "";
    if (offsetTime > 0) {
      tip = t("fastForward", { time: offsetTime });
    } else {
      tip = t("goBack", { time: -offsetTime });
    }
    this.instance.setNotice(tip);
  }
  // 显示时间提示，鼠标悬浮在进度条容器时
  private showProcessTime(event: MouseEvent) {
    const processTimeElement = this.options.templateInstance.processTimeElement;
    if (!isUndef(processTimeElement)) {
      const { left, width } = this.getProcessMaskInfo();
      let offsetX = event.pageX - left;
      offsetX = checkData(offsetX, 0, width);
      processTimeElement.style.left = `${offsetX}px`;
      const time = this.instance.duration * (offsetX / width);
      processTimeElement.innerHTML = secondToTime(time);
      processTimeElement.style.opacity = "1";
    }
  }
  // 隐藏时间提示，鼠标离开进度条容器
  private hideProcessTime() {
    const processTimeElement = this.options.templateInstance.processTimeElement;
    if (processTimeElement) {
      processTimeElement.style.opacity = "";
    }
  }

  private destroy() {
    this.dragInstance?.destroy();
    this.eventManager.removeEventListener();
  }
}

export default VideoProgress;
