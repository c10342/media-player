import { EventManager, parseHtmlToDom, PLUGINNAME } from "@lin-media/utils";
import { VIDEOMASK } from "../config/constant";
import { PlayerEvents } from "../config/event";
import MediaPlayer from "../index";
import MaskTpl from "../templates/mask";
class VideoMask {
  static [PLUGINNAME] = VIDEOMASK;
  // 播放器实例
  private _playerInstance: MediaPlayer;
  // dom事件管理器
  private _eventManager = new EventManager();
  // 组件根元素
  private _compRootElement: HTMLElement;

  constructor(playerInstance: MediaPlayer, slotElement: HTMLElement) {
    // 播放器实例
    this._playerInstance = playerInstance;
    // 初始化dom
    this._initDom(slotElement);
    this._initListener();
  }

  private _initDom(slotElement: HTMLElement) {
    const html = MaskTpl();
    this._compRootElement = parseHtmlToDom(html);
    slotElement.appendChild(this._compRootElement);
  }

  private _initListener() {
    this._eventManager.addEventListener({
      element: this._compRootElement,
      eventName: "click",
      handler: this._onMaskClick.bind(this)
    });

    this._on(PlayerEvents.DESTROY, this._destroy.bind(this));
  }
  //   点击遮罩层
  private _onMaskClick() {
    if (this._playerInstance.$isMobile) {
      this._playerInstance.toggleControls();
    } else {
      // pc端处理方式
      this._playerInstance.toggle();
    }
  }

  // 事件监听
  private _on(eventName: string, handler: Function) {
    this._playerInstance.$eventBus.$on(eventName, handler);
  }
  // 销毁
  private _destroy() {
    this._eventManager.removeEventListener();
  }
}

export default VideoMask;
