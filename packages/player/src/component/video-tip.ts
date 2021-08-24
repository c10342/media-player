import { isUndef } from "@lin-media/utils";
import { PlayerEvents } from "../config/event";
import PlayerConstructor from "../constructor";

class VideoTip {
  private playerInstance: PlayerConstructor;
  // 定时器
  private timer: number | null;
  constructor(playerInstance: PlayerConstructor) {
    this.playerInstance = playerInstance;
    this.playerInstance.$on(PlayerEvents.DESTROY, this.destroy.bind(this));
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
    const tipElement = this.playerInstance.templateInstance.tipElement;
    if (!isUndef(tipElement)) {
      tipElement.innerHTML = tip;
      tipElement.style.opacity = "1";
    }
  }
  // 隐藏提示
  private hideTip() {
    const tipElement = this.playerInstance.templateInstance.tipElement;
    if (!isUndef(tipElement)) {
      tipElement.style.opacity = "";
    }
  }

  private destroy() {
    this.destroyTimer();
  }
}

export default VideoTip;
