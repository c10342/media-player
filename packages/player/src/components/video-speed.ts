import {
  EventManager,
  isFunction,
  parseHtmlToDom,
  PLUGINNAME
} from "@lin-media/utils";
import { LISTACTIVECLASSNAME, VIDEOSPEED } from "../config/constant";
import { PlayerEvents, VideoEvents } from "../config/event";
import MediaPlayer from "../index";
import SpeedTpl from "../templates/speed";
class VideoSpeed {
  static [PLUGINNAME] = VIDEOSPEED;
  // 播放器实例
  private _playerInstance: MediaPlayer;
  // dom事件管理器
  private _eventManager = new EventManager();
  // 组件根元素
  private _compRootElement: HTMLElement;
  // 倍数索引，当前是那个倍数
  private _currentIndex = 0;
  private _speedItemsElement: NodeListOf<Element>;
  private _speedLabelElement: HTMLElement;

  constructor(playerInstance: MediaPlayer, slotElement: HTMLElement) {
    // 播放器实例
    this._playerInstance = playerInstance;
    // 初始化dom
    this._initDom(slotElement);
    // 初始化索引，即是那个倍数
    this._initCurrentIndex();
    // 设置video标签倍数
    this._initDefaultRate();
    this._initListener();
  }

  // 查询元素
  private _querySelector<T extends HTMLElement>(selector: string) {
    return this._compRootElement.querySelector(selector) as T;
  }
  private _querySelectorAll(selector: string) {
    return this._compRootElement.querySelectorAll(
      selector
    ) as NodeListOf<Element>;
  }

  private _initDom(slotElement: HTMLElement) {
    const html = SpeedTpl({
      // ...this._playerInstance.$options
      speedList: this._playerInstance.$options.speedList
    });

    this._compRootElement = parseHtmlToDom(html);
    slotElement.appendChild(this._compRootElement);
    this._speedItemsElement = this._querySelectorAll(".player-speed-item");
    this._speedLabelElement = this._querySelector(".player-speed-label");
  }

  // 找出默认的倍数，default，然后设置
  private _initCurrentIndex() {
    const speedList = this._playerInstance.$options.speedList;
    const index = speedList!.findIndex((speed) => speed.default);
    if (index > -1) {
      this._setCurrentInfo(index);
    }
  }

  // 一开始的时候初始化倍数
  private _initDefaultRate() {
    const speedList = this._playerInstance.$options.speedList;
    if (speedList!.length > 0) {
      this._playerInstance.setSpeed(speedList![this._currentIndex].value);
    }
  }

  private _initListener() {
    this._on(PlayerEvents.DESTROY, this._destroy.bind(this));
    this._on(VideoEvents.RATECHANGE, this._onRatechange.bind(this));

    this._eventManager.addEventListener({
      element: this._querySelector(".player-speed-wrapper"),
      eventName: "click",
      handler: this._onSpeedWrapperClick.bind(this)
    });
  }

  private _setCurrentInfo(index: number) {
    this._setCurrentIndex(index);
    this._setCurrentLabel();
  }

  private _onRatechange(event: MouseEvent) {
    const target = event.target as HTMLVideoElement;
    const rate = target.playbackRate;
    const speedList = this._playerInstance.$options.speedList ?? [];
    const index = speedList.findIndex((item) => item.value === rate);
    if (index > -1 && index !== this._currentIndex) {
      this._setCurrentInfo(index);
      // 显示通知
      this._playerInstance.setNotice(speedList[index].label);
    }
  }

  // 点击倍数事件处理
  private _onSpeedWrapperClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    let index = target.dataset?.index ?? -1;
    index = Number(index);
    if (index !== -1 && index !== this._currentIndex) {
      // 找到对应的倍数
      const speedList = this._playerInstance.$options.speedList;
      const speed = speedList![index];
      // 设置倍数
      this._playerInstance.setSpeed(speed.value);
      // 显示通知
      this._playerInstance.setNotice(speed.label);
      // 设置索引信息
      this._setCurrentInfo(index);
    }
  }

  // 设置标签文本
  private _setCurrentLabel() {
    const speedList = this._playerInstance.$options.speedList;
    if (speedList!.length > 0) {
      const text = speedList![this._currentIndex].label;

      this._speedLabelElement.innerHTML = text;
    }
  }

  // 设置索引
  private _setCurrentIndex(index: number) {
    this._currentIndex = index;
    // 设置高亮的元素
    this._handelSpeedItemsElement((element, i) => {
      this._setElementActive(element, i === index);
    });
  }

  // 统一在这里进行元素判空，然后执行回调
  private _handelSpeedItemsElement(
    callback: (element: Element, index: number) => void
  ) {
    if (isFunction(callback)) {
      const speedItemsElement = this._speedItemsElement;
      const length = speedItemsElement?.length ?? 0;
      if (speedItemsElement && length > 0) {
        for (let i = 0; i < speedItemsElement.length; i++) {
          const element = speedItemsElement[i];
          callback(element, i);
        }
      }
    }
  }

  // 切换元素的活跃类名
  private _setElementActive(element: Element, isActive: boolean) {
    if (isActive) {
      this._addElementActive(element);
    } else {
      this._delElementActive(element);
    }
  }

  // 删除元素的活跃类名
  private _delElementActive(element: Element) {
    if (element.classList.contains(LISTACTIVECLASSNAME)) {
      element.classList.remove(LISTACTIVECLASSNAME);
    }
  }
  // 添加元素的活跃类名
  private _addElementActive(element: Element) {
    if (!element.classList.contains(LISTACTIVECLASSNAME)) {
      element.classList.add(LISTACTIVECLASSNAME);
    }
  }

  // 监听事件
  private _on(eventName: string, handler: Function) {
    this._playerInstance.$eventBus.$on(eventName, handler);
  }

  private _destroy() {
    this._eventManager.removeEventListener();
  }
}

export default VideoSpeed;
