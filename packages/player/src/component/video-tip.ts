import { isUndef } from "@lin-media/utils";
import { PlayerEvents } from "../config/event";
import { ComponentOptions } from "../types";

class VideoTip {
  private options: ComponentOptions;
  // 定时器
  private timer: number | null;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.options.instance.$on(PlayerEvents.DESTROY, this.destroy.bind(this));
  }
  // 设置通知
  setNotice(notice: string, time?: number) {
    this.destroyTimer();
    this.showTip(notice);
    // 2秒后隐藏
    this.timer = window.setTimeout(() => {
      this.hideTip();
    }, time || 2000);
  }
  // 销毁定时器
  private destroyTimer() {
    if (!isUndef(this.timer)) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
  // 显示提示
  private showTip(tip: string) {
    const tipElement = this.options.templateInstance.tipElement;
    if (!isUndef(tipElement)) {
      tipElement.innerHTML = tip;
      tipElement.style.opacity = "1";
    }
  }
  // 隐藏提示
  private hideTip() {
    const tipElement = this.options.templateInstance.tipElement;
    if (!isUndef(tipElement)) {
      tipElement.style.opacity = "";
    }
  }

  private destroy() {
    this.destroyTimer();
  }
}

export default VideoTip;
