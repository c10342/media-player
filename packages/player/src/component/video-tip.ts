import { isUndef } from "@media/utils";
import { ComponentOptions } from "../types";

class VideoTip {
  private options: ComponentOptions;
  private timer: number | null;
  constructor(options: ComponentOptions) {
    this.options = options;
  }

  setNotice(notice: string, time?: number) {
    this.destroyTimer();
    this.showTip(notice);
    this.timer = window.setTimeout(() => {
      this.hideTip();
    }, time || 2000);
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
