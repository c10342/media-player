import { isUndef, parseHtmlToDom, updateStyle } from "@lin-media/utils";
import Player from "../player";
import TipTpl from "../templates/tip";
import { ComponentApi } from "../types/component";
import { definePlayerMethods } from "../utils/helper";
class VideoTip implements ComponentApi {
  // 播放器实例
  private player: Player;
  // 组件根元素
  private rootElement: HTMLElement;
  // 定时器
  private timer: number | null;
  constructor(player: Player, slotElement: HTMLElement) {
    // 播放器实例
    this.player = player;
    this.initDom(slotElement);
    this.initPlayerMethods();
  }

  private initPlayerMethods() {
    const methods = {
      setNotice: this.setNotice.bind(this)
    };
    definePlayerMethods(this.player, methods);
  }

  private initDom(slotElement: HTMLElement) {
    const html = TipTpl();
    this.rootElement = parseHtmlToDom(html);
    slotElement.appendChild(this.rootElement);
  }

  // 设置通知
  private setNotice(notice: string, time?: number) {
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
    this.rootElement.innerHTML = tip;
    updateStyle(this.rootElement, {
      opacity: "1"
    });
  }
  // 隐藏提示
  private hideTip() {
    updateStyle(this.rootElement, {
      opacity: ""
    });
  }

  destroy() {
    this.destroyTimer();
  }
}

Player.registerComponent("VideoTip", VideoTip, {
  init: true
});

export default VideoTip;
