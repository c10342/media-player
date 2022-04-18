import {
  checkData,
  Drag,
  getBoundingClientRect,
  isMobile,
  isNumber,
  isUndef,
  parseHtmlToDom,
  secondToTime,
  updateStyle
} from "@lin-media/utils";
import { VideoEvents } from "../config/event";
import Player from "../player";
import ProgressTpl from "../templates/progress";
import { DragDataInfo } from "../types";
import { PlayerConfig } from "../types/player";
import Component from "./component";

class VideoProgress extends Component {
  static shouldInit(options: PlayerConfig) {
    return !options.live;
  }
  static componentName = "VideoProgress";

  private progressMaskElement: HTMLElement;

  private videoPlayedElement: HTMLElement;

  private videoLoadedElement: HTMLElement;

  private processTimeElement: HTMLElement;

  private dragInstance: Drag;

  private isMousedown = false;

  private currentTime = 0;

  constructor(
    player: Player,
    slotElement: HTMLElement,
    options: Record<string, any>
  ) {
    super(player, slotElement, options);

    // 初始化dom
    this.initDom(slotElement);
    // 初始化拖拽事件
    this.initDrag();
    this.initListener();
    this.initComponent(VideoProgress.componentName);
  }

  // 查询元素
  private querySelector<T extends HTMLElement>(selector: string) {
    return this.rootElement.querySelector(selector) as T;
  }

  private initDom(slotElement: HTMLElement) {
    const parentElement = slotElement.querySelector(".player-controls-group")!;
    const html = ProgressTpl({
      isMobile: isMobile()
    });
    this.rootElement = parseHtmlToDom(html);
    parentElement.appendChild(this.rootElement);
    this.progressMaskElement = this.querySelector(".player-process-mask");
    this.videoPlayedElement = this.querySelector(".player-process-played");
    this.videoLoadedElement = this.querySelector(".player-process-loaded");
    this.processTimeElement = this.querySelector(".player-process-time");
  }

  // 获取进度条容器信息
  private getProcessMaskInfo() {
    const clientRect = getBoundingClientRect(this.progressMaskElement);
    return {
      left: clientRect.left || 0,
      width: clientRect.width || 0
    };
  }

  private initDrag() {
    this.dragInstance = new Drag({
      dragElement: this.querySelector(".player-process-ball"),
      wrapperElement: this.progressMaskElement
    });
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
      this.isMousedown = true;
      this.setPlayedProgressByPercent(data.percentX);
      // 跳转时间
      this.seekByPercent(data.percentX);
    });
  }

  // 根据百分比设置已播放的长度
  private setPlayedProgressByPercent(percent: number) {
    updateStyle(this.videoPlayedElement, {
      width: `${percent * 100}%`
    });
  }

  // 设置过度时长
  private setTransitionDuration(duration?: number) {
    updateStyle(this.videoPlayedElement, {
      transitionDuration: isNumber(duration) ? `${duration}ms` : ""
    });
  }

  // 根据百分比跳转到指定时间
  private seekByPercent(percent: number) {
    const duration = this.player.duration;
    if (duration > 0) {
      percent = checkData(percent, 0, 1);
      // 时间点
      const time = duration * percent;
      // 计算前进或者后退了多少秒
      const offsetTime = time - this.currentTime;
      this.setTip(offsetTime);
      // 跳转
      this.player.seek(time);
    }
  }

  // 显示通知
  private setTip(offsetTime: number) {
    const i18n = this.player.i18n;
    offsetTime = Math.round(offsetTime);
    let tip = "";
    if (offsetTime > 0) {
      tip = i18n.t("fastForward", { time: offsetTime });
    } else {
      tip = i18n.t("goBack", { time: -offsetTime });
    }
    this.player.setNotice(tip);
  }

  private initListener() {
    this.player.$on(VideoEvents.TIMEUPDATE, this.onVideoTimeupdate.bind(this));
    this.player.$on(VideoEvents.PROGRESS, this.onVideoProgress.bind(this));
    this.player.$on(VideoEvents.SEEKED, this.onVideoSeeked.bind(this));
    this.player.$on(VideoEvents.ENDED, this.onVideoEnd.bind(this));
    if (!isMobile()) {
      this.eventManager.addEventListener({
        element: this.progressMaskElement,
        eventName: "mousemove",
        handler: this.onMaskMousemove.bind(this)
      });
      this.eventManager.addEventListener({
        element: this.progressMaskElement,
        eventName: "mouseleave",
        handler: this.onMaskMouseleave.bind(this)
      });
    }
  }

  // 视频播放完成
  private onVideoEnd(event: Event) {
    if (!this.isMousedown) {
      // 不是在拖拽进度条的时候需要更新进度条
      const videoElement = event.target as HTMLVideoElement;
      const currentTime = videoElement.currentTime || 0;
      this.setPlayedProgress(currentTime);
    }
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

  // 设置已播放的进度
  private setPlayedProgress(currentTime?: number) {
    const duration = this.player.duration;

    if (isUndef(currentTime)) {
      currentTime = this.currentTime;
    }
    if (duration > 0 && currentTime > 0) {
      // 计算出百分比
      let percent = currentTime / duration;
      percent = checkData(percent, 0, 1);
      updateStyle(this.videoPlayedElement, {
        width: `${percent * 100}%`
      });
    }
  }

  // 设置缓冲的进度
  private setLoadedProgress(preloadTime: number) {
    const duration = this.player.duration;
    if (duration > 0) {
      let percent = preloadTime / duration;
      percent = checkData(percent, 0, 1);
      updateStyle(this.videoLoadedElement, {
        width: `${percent * 100}%`
      });
    }
  }

  // 鼠标进入进度条容器
  private onMaskMousemove(event: MouseEvent) {
    // 显示时间提示
    this.showProcessTime(event);
  }

  // 视频完成跳转，seek的时候
  private onVideoSeeked() {
    // fix:修复调用seek方法跳转到0时刻的时候进度条显示不正确
    if (this.currentTime === 0) {
      this.setPlayedProgressByPercent(0);
    }

    this.isMousedown = false;
  }

  // 显示时间提示，鼠标悬浮在进度条容器时
  private showProcessTime(event: MouseEvent) {
    const processTimeElement = this.processTimeElement;
    const { left, width } = this.getProcessMaskInfo();
    let offsetX = event.pageX - left;
    offsetX = checkData(offsetX, 0, width);
    const time = this.player.duration * (offsetX / width);
    processTimeElement.innerHTML = secondToTime(time);
    updateStyle(processTimeElement, {
      left: `${offsetX}px`,
      opacity: "1"
    });
  }

  // 鼠标离开进度条容器
  private onMaskMouseleave() {
    // 隐藏时间提示
    this.hideProcessTime();
  }

  // 隐藏时间提示，鼠标离开进度条容器
  private hideProcessTime() {
    updateStyle(this.processTimeElement, {
      opacity: ""
    });
  }

  destroy() {
    this.dragInstance.destroy();
    super.destroy();
  }
}

export default VideoProgress;
