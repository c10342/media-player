import { isUndef, parseHtmlToDom, updateStyle } from "@lin-media/utils";
import Player from "../player";
import TipTpl from "../templates/tip";
import { definePlayerMethods } from "../utils/helper";
import Component from "./component";
class VideoTip extends Component {
  static componentName = "VideoTip";

  // 定时器
  private timer: number | null;
  constructor(player: Player, slotElement: HTMLElement, options = {}) {
    super(player, slotElement, options);
    this.initDom(slotElement);
    this.initPlayerMethods();
    this.initComponent(VideoTip.componentName);
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
    super.destroy();
  }
}

export default VideoTip;
