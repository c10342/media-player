import { EventManager, isFunction, isUndef } from "@media/utils";
import { CustomEvents, VideoEvents } from "../js/event";
import { ComponentOptions } from "../types";

class VideoControls {
  private options: ComponentOptions;
  private eventManager: EventManager;
  private isEnter = false;
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
    this.instance.$on(CustomEvents.DESTROY, this.destroy.bind(this));
  }

  private onMouseenter() {
    this.isEnter = true;
    this.showControls();
  }

  private onMouseleave() {
    this.isEnter = false;
    this.hideControls();
  }

  private onVideoPlay() {
    this.hideControls();
  }

  private onVideoPause() {
    this.showControls();
  }

  private showControls() {
    if (this.paused || this.isEnter) {
      this.handleElement((element) => {
        element.style.transform = "";
        this.instance.$emit(CustomEvents.SHOW_CONTROLS);
      });
    }
  }

  private hideControls() {
    this.destroyTimer();
    this.timer = window.setTimeout(() => {
      if (!this.paused && !this.isEnter) {
        this.handleElement((element) => {
          element.style.transform = "translateY(100%)";
          this.instance.$emit(CustomEvents.HIDE_CONTROLS);
        });
      }
    }, 4000);
  }

  private handleElement(callback: (element: HTMLElement) => void) {
    const controlsElement = this.options.templateInstance.controlsElement;
    if (!isUndef(controlsElement) && isFunction(callback)) {
      callback(controlsElement);
    }
  }

  private destroyTimer() {
    if (!isUndef(this.timer)) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  destroy() {
    this.eventManager.removeEventListener();
  }
}

export default VideoControls;
