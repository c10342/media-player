import { isUndef } from "@media/utils";
import { PlayerEvents } from "./config/enum";
import BulletChat from "./js/bullet-chat";
import { DanmakuOptions, PushData } from "./types";
import "./style/index.scss";

class Danmaku {
  private options: DanmakuOptions;
  // 播放器的dom
  private _el: HTMLElement;
  // 播放器实例
  private _instance: any;
  private _bulletChat: BulletChat | null;
  private _danmukuWrapperElement: HTMLElement | null;
  constructor(el: HTMLElement, instance: any) {
    this._el = el;
    this._instance = instance;
    const options = instance.options?.danmakuOptions ?? {};
    this.options = options;
    this._initElement();
    this._initDanmaku();
    this._extendMethods();
    this._initListener();
  }

  private _initElement() {
    const div = document.createElement("div");
    div.className = "danmaku-container";
    this._el.appendChild(div);
    this._danmukuWrapperElement = div;
  }

  private _initDanmaku() {
    if (!isUndef(this._danmukuWrapperElement)) {
      this._bulletChat = new BulletChat({
        ...this.options,
        container: this._danmukuWrapperElement
      });
    }
  }

  private _extendMethods() {
    this._instance.extend({
      // 发送弹幕
      send: (data: string | PushData | Array<PushData>) =>
        this._bulletChat?.add(data),
      // 开始弹幕
      play: () => this._bulletChat?.play(),
      // 暂停弹幕
      pause: () => this._bulletChat?.pause(),
      // 容器发生变化
      resize: () => this._bulletChat?.resize(),
      // 清屏
      clearScreen: () => this._bulletChat?.clearScreen()
    });
  }

  private _initListener() {
    this._instance.$on(PlayerEvents.DESTROY, () => {
      this._destroy();
    });
  }

  private _destroy() {
    this._bulletChat = null;
    this._danmukuWrapperElement?.remove();
    this._danmukuWrapperElement = null;
  }
}

export default Danmaku;
