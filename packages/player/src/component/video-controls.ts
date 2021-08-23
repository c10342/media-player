import { EventManager, isFunction, isUndef } from "@media/utils";
import { PlayerEvents, VideoEvents } from "../config/event";
import { ComponentOptions } from "../types";

class VideoControls {
  private options: ComponentOptions;
  private eventManager: EventManager;
  // 是否进入播放器标志位
  private isEnter = false;
  // 定时器
  private timer: number | null;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    this.initWrapperListener();
    this.initListener();
  }

  private get instance() {
    return this.options.instance;
  }

  private get paused() {
    return this.options.templateInstance.videoElement?.paused;
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initWrapperListener() {
    const containerElement = this.options.templateInstance.containerElement;
    this.eventManager.addEventListener({
      element: containerElement,
      eventName: "mouseenter",
      handler: this.onMouseenter.bind(this)
    });
    this.eventManager.addEventListener({
      element: containerElement,
      eventName: "mouseleave",
      handler: this.onMouseleave.bind(this)
    });
  }

  private initListener() {
    this.instance.$on(VideoEvents.PLAY, this.onVideoPlay.bind(this));
    this.instance.$on(VideoEvents.PAUSE, this.onVideoPause.bind(this));
    this.instance.$on(PlayerEvents.DESTROY, this.destroy.bind(this));
  }

  // 鼠标进入容器事件处理
  private onMouseenter() {
    this.isEnter = true;
    this.showControls();
  }
  // 鼠标离开容器事件处理
  private onMouseleave() {
    this.isEnter = false;
    this.hideControls();
  }
  // 视频播放事件处理
  private onVideoPlay() {
    this.hideControls();
  }
  // 视频暂停事件处理
  private onVideoPause() {
    this.showControls();
  }
  // 显示控制条
  private showControls() {
    // 非播放状态，或者鼠标在播放器内，显示出来
    if (this.paused || this.isEnter) {
      this.handleElement((element) => {
        element.style.transform = "";
        this.instance.$emit(PlayerEvents.SHOW_CONTROLS);
      });
    }
  }
  // 隐藏控制条
  private hideControls() {
    // 销毁定时器
    this.destroyTimer();
    // 4秒后隐藏
    this.timer = window.setTimeout(() => {
      if (!this.paused && !this.isEnter) {
        this.handleElement((element) => {
          element.style.transform = "translateY(100%)";
          this.instance.$emit(PlayerEvents.HIDE_CONTROLS);
        });
      }
    }, 4000);
  }

  // 统一在这里判断元素是否存在，然后执行回调
  private handleElement(callback: (element: HTMLElement) => void) {
    const controlsElement = this.options.templateInstance.controlsElement;
    if (!isUndef(controlsElement) && isFunction(callback)) {
      callback(controlsElement);
    }
  }
  // 销毁定时器
  private destroyTimer() {
    if (!isUndef(this.timer)) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private destroy() {
    // 移除事件监听
    this.eventManager.removeEventListener();
    // 销毁的时候还要清除一下定时器
    this.destroyTimer();
  }
}

export default VideoControls;
