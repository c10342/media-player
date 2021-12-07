import {
  checkData,
  Drag,
  EventManager,
  getBoundingClientRect,
  isNumber,
  parseHtmlToDom,
  secondToTime
} from "@lin-media/utils";
import { PlayerEvents, VideoEvents } from "../config/event";
import MediaPlayer from "../index";
import ProgressTpl from "../templates/progress.art";
import { DragDataInfo } from "../types";

class VideoProgress {
  // 播放器实例
  private _playerInstance: MediaPlayer;
  // dom事件管理器
  private _eventManager = new EventManager();
  // 组件根元素
  private _compRootElement: HTMLElement;

  private _progressMaskElement: HTMLElement;

  private _videoPlayedElement: HTMLElement;

  private _videoLoadedElement: HTMLElement;

  private _processTimeElement: HTMLElement;

  private _dragInstance: Drag;

  private _isMousedown = false;

  private _currentTime = 0;

  constructor(playerInstance: MediaPlayer, slotElement: HTMLElement) {
    // 播放器实例
    this._playerInstance = playerInstance;
    // 初始化dom
    this._initDom(slotElement);
    // 初始化拖拽事件
    this._initDrag();
    this._initListener();
  }

  // 查询元素
  private _querySelector<T extends HTMLElement>(selector: string) {
    return this._compRootElement.querySelector(selector) as T;
  }

  private _initDom(slotElement: HTMLElement) {
    const html = ProgressTpl({
      ...this._playerInstance.$options
    });
    this._compRootElement = parseHtmlToDom(html);
    slotElement.appendChild(this._compRootElement);
    this._progressMaskElement = this._querySelector(".player-process-mask");
    this._videoPlayedElement = this._querySelector(".player-process-played");
    this._videoLoadedElement = this._querySelector(".player-process-loaded");
    this._processTimeElement = this._querySelector(".player-process-time");
  }

  // 获取进度条容器信息
  private _getProcessMaskInfo() {
    const clientRect = getBoundingClientRect(this._progressMaskElement);
    return {
      left: clientRect.left || 0,
      width: clientRect.width || 0
    };
  }

  private _initDrag() {
    this._dragInstance = new Drag({
      dragElement: this._querySelector(".player-process-ball"),
      wrapperElement: this._progressMaskElement
    });
    // 鼠标移动
    this._dragInstance?.$on("mousemove", (data: DragDataInfo) => {
      // 设置进度条
      this._setPlayedProgressByPercent(data.percentX);
    });
    // 鼠标按下
    this._dragInstance?.$on("mousedown", () => {
      this._isMousedown = true;
      // 禁止进行过渡动画
      this._setTransitionDuration(0);
    });
    // 鼠标抬起
    this._dragInstance?.$on("mouseup", (data: DragDataInfo) => {
      // 回复过度动画
      this._setTransitionDuration();
      // 跳转到时间
      this._seekByPercent(data.percentX);
    });
    // 点击事件
    this._dragInstance?.$on("click", (data: DragDataInfo) => {
      this._isMousedown = true;
      this._setPlayedProgressByPercent(data.percentX);
      // 跳转时间
      this._seekByPercent(data.percentX);
    });
  }

  // 根据百分比设置已播放的长度
  private _setPlayedProgressByPercent(percent: number) {
    this._videoPlayedElement.style.width = `${percent * 100}%`;
  }

  // 设置过度时长
  private _setTransitionDuration(duration?: number) {
    if (isNumber(duration)) {
      this._videoPlayedElement.style.transitionDuration = `${duration}ms`;
    } else {
      this._videoPlayedElement.style.transitionDuration = "";
    }
  }

  // 根据百分比跳转到指定时间
  private _seekByPercent(percent: number) {
    const duration = this._playerInstance.duration;
    if (duration > 0) {
      percent = checkData(percent, 0, 1);
      // 时间点
      const time = duration * percent;
      // 计算前进或者后退了多少秒
      const offsetTime = time - this._currentTime;
      this._setTip(offsetTime);
      // 跳转
      this._playerInstance.seek(time);
    }
  }

  // 显示通知
  private _setTip(offsetTime: number) {
    const i18n = this._playerInstance.$i18n;
    offsetTime = Math.round(offsetTime);
    let tip = "";
    if (offsetTime > 0) {
      tip = i18n.t("fastForward", { time: offsetTime });
    } else {
      tip = i18n.t("goBack", { time: -offsetTime });
    }
    this._playerInstance.setNotice(tip);
  }

  private _on(eventName: string, handler: Function) {
    this._playerInstance.$eventBus.$on(eventName, handler);
  }

  private _initListener() {
    this._on(PlayerEvents.DESTROY, this._destroy.bind(this));
    this._on(VideoEvents.TIMEUPDATE, this._onVideoTimeupdate.bind(this));
    this._on(VideoEvents.PROGRESS, this._onVideoProgress.bind(this));
    this._on(VideoEvents.SEEKED, this._onVideoSeeked.bind(this));
    if (!this._playerInstance.$options.isMobile) {
      this._eventManager.addEventListener({
        element: this._progressMaskElement,
        eventName: "mousemove",
        handler: this._onMaskMousemove.bind(this)
      });
      this._eventManager.addEventListener({
        element: this._progressMaskElement,
        eventName: "mouseleave",
        handler: this._onMaskMouseleave.bind(this)
      });
    }
  }

  // 视频正在播放
  private _onVideoTimeupdate(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    const currentTime = videoElement.currentTime || 0;
    const intCurrentTime = Math.floor(currentTime);
    const intPrevTime = Math.floor(this._currentTime);
    // 保证每一秒触发一次，防抖
    if (intCurrentTime === intPrevTime) {
      return;
    }
    this._currentTime = currentTime;
    if (!this._isMousedown) {
      // 不是在拖拽进度条的时候需要更新进度条
      this._setPlayedProgress();
    }
  }

  // 视频缓冲事件
  private _onVideoProgress(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    if (videoElement.buffered?.length !== 0) {
      const preloadTime = videoElement.buffered.end(0) || 0;
      this._setLoadedProgress(preloadTime);
    }
  }

  // 设置已播放的进度
  private _setPlayedProgress() {
    const duration = this._playerInstance.duration;
    const currentTime = this._currentTime;
    if (duration > 0 && currentTime > 0) {
      // 计算出百分比
      let percent = currentTime / duration;
      percent = checkData(percent, 0, 1);
      this._videoPlayedElement.style.width = `${percent * 100}%`;
    }
  }

  // 设置缓冲的进度
  private _setLoadedProgress(preloadTime: number) {
    const duration = this._playerInstance.duration;
    if (duration > 0) {
      let percent = preloadTime / duration;
      percent = checkData(percent, 0, 1);
      this._videoLoadedElement.style.width = `${percent * 100}%`;
    }
  }

  // 鼠标进入进度条容器
  private _onMaskMousemove(event: MouseEvent) {
    // 显示时间提示
    this._showProcessTime(event);
  }

  // 视频完成跳转，seek的时候
  private _onVideoSeeked() {
    this._isMousedown = false;
  }

  // 显示时间提示，鼠标悬浮在进度条容器时
  private _showProcessTime(event: MouseEvent) {
    const processTimeElement = this._processTimeElement;
    const { left, width } = this._getProcessMaskInfo();
    let offsetX = event.pageX - left;
    offsetX = checkData(offsetX, 0, width);
    processTimeElement.style.left = `${offsetX}px`;
    const time = this._playerInstance.duration * (offsetX / width);
    processTimeElement.innerHTML = secondToTime(time);
    processTimeElement.style.opacity = "1";
  }

  // 鼠标离开进度条容器
  private _onMaskMouseleave() {
    // 隐藏时间提示
    this._hideProcessTime();
  }

  // 隐藏时间提示，鼠标离开进度条容器
  private _hideProcessTime() {
    this._processTimeElement.style.opacity = "";
  }

  private _destroy() {
    this._dragInstance.destroy();
    this._eventManager.removeEventListener();
  }
}

export default VideoProgress;
