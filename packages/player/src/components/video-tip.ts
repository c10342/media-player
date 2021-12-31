import { isUndef, parseHtmlToDom, updateStyle } from "@lin-media/utils";
import { PlayerEvents } from "../config/event";
import MediaPlayer from "../index";
import TipTpl from "../templates/tip";
class VideoTip {
  // 播放器实例
  private _playerInstance: MediaPlayer;
  // 组件根元素
  private _compRootElement: HTMLElement;
  // 定时器
  private timer: number | null;
  constructor(playerInstance: MediaPlayer, slotElement: HTMLElement) {
    // 播放器实例
    this._playerInstance = playerInstance;
    this._initDom(slotElement);
    this._initListener();
  }

  private _initListener() {
    this._on(PlayerEvents.DESTROY, this._destroy.bind(this));
  }

  private _initDom(slotElement: HTMLElement) {
    const html = TipTpl();
    this._compRootElement = parseHtmlToDom(html);
    slotElement.appendChild(this._compRootElement);
  }

  // 设置通知
  $setNotice(notice: string, time?: number) {
    this._destroyTimer();
    this._showTip(notice);
    // 2秒后隐藏
    this.timer = window.setTimeout(() => {
      this._hideTip();
    }, time || 2000);
  }
  // 销毁定时器
  private _destroyTimer() {
    if (!isUndef(this.timer)) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
  // 显示提示
  private _showTip(tip: string) {
    this._compRootElement.innerHTML = tip;
    updateStyle(this._compRootElement, {
      opacity: "1"
    });
  }
  // 隐藏提示
  private _hideTip() {
    updateStyle(this._compRootElement, {
      opacity: ""
    });
  }

  // 事件监听
  private _on(eventName: string, handler: Function) {
    this._playerInstance.$eventBus.$on(eventName, handler);
  }

  private _destroy() {
    this._destroyTimer();
  }
}

export default VideoTip;
