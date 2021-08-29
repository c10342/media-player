import { EventManager, isUndef } from "@lin-media/utils";
import { PlayerEvents, VideoEvents } from "../config/event";
import PlayerConstructor from "../constructor";

class VideoControls {
  private playerInstance: PlayerConstructor;
  private eventManager: EventManager;
  // 是否进入播放器标志位
  private isEnter = false;
  // 定时器
  private timer: number | null;
  constructor(playerInstance: PlayerConstructor) {
    this.playerInstance = playerInstance;
    this.initVar();
    this.initListener();
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initListener() {
    this.playerInstance.$on(PlayerEvents.DESTROY, this.destroy.bind(this));
    if (!this.playerInstance.isMobile) {
      this.playerInstance.$on(VideoEvents.PLAY, this.onVideoPlay.bind(this));
      this.playerInstance.$on(VideoEvents.PAUSE, this.onVideoPause.bind(this));
      const containerElement =
        this.playerInstance.templateInstance.containerElement;
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
    } else {
      this.eventManager.addEventListener({
        element: this.playerInstance.templateInstance.mobilePlayButton,
        eventName: "click",
        handler: () => {
          this.playerInstance.toggle();
        }
      });
    }
    this.eventManager.addEventListener({
      element: this.playerInstance.templateInstance.videoMaskElement,
      eventName: "click",
      handler: this.onVideoMaskClick.bind(this)
    });
  }

  private onVideoMaskClick() {
    if (this.playerInstance.isMobile) {
      // 点击遮罩层移动端处理方式
      this.toggleMobileControls();
    } else {
      // pc端处理方式
      this.playerInstance.toggle();
    }
  }

  private toggleMobileControls() {
    this.isEnter = !this.isEnter;
    if (this.isEnter) {
      this.hide();
    } else {
      this.show();
    }
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
    if (this.playerInstance.paused || this.isEnter) {
      this.show();
    }
  }
  // 隐藏控制条
  private hideControls(time = 4000) {
    // 销毁定时器
    this.destroyTimer();
    // 4秒后隐藏
    this.timer = window.setTimeout(() => {
      if (!this.playerInstance.paused && !this.isEnter) {
        this.hide();
      }
    }, time);
  }

  private show() {
    this.playerInstance.templateInstance.controlsElement.style.transform = "";
    this.playerInstance.$emit(PlayerEvents.SHOW_CONTROLS);
  }

  private hide() {
    this.playerInstance.templateInstance.controlsElement.style.transform =
      "translateY(100%)";
    this.playerInstance.$emit(PlayerEvents.HIDE_CONTROLS);
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
