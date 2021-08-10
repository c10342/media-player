import { isUndef } from "@media/utils";
import { CustomEvents } from "../js/event";
import { ComponentOptions } from "../types";

class VideoTip {
  private options: ComponentOptions;
  private timer: number | null;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initListener();
  }

  private initListener() {
    const instance = this.options.instance;
    instance.$on(CustomEvents.TIP, this.onTip.bind(this));
  }

  private onTip(tip: string) {
    this.destroyTimer();
    this.showTip(tip);
    this.timer = window.setTimeout(() => {
      this.hideTip();
    }, 4000);
  }

  private destroyTimer() {
    if (!isUndef(this.timer)) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private showTip(tip: string) {
    const tipElement = this.options.templateInstance.tipElement;
    if (!isUndef(tipElement)) {
      tipElement.innerHTML = tip;
      tipElement.style.opacity = "1";
    }
  }

  private hideTip() {
    const tipElement = this.options.templateInstance.tipElement;
    if (!isUndef(tipElement)) {
      tipElement.style.opacity = "";
    }
  }
}

export default VideoTip;
