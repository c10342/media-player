import { isFunction, parseHtmlToDom } from "@lin-media/utils";
import { LISTACTIVECLASSNAME } from "../config/constant";
import { VideoEvents } from "../config/event";
import Player from "../player";
import SpeedTpl from "../templates/speed";
import { PlayerConfig } from "../types/player";
import Component from "./component";
class VideoSpeed extends Component {
  static shouldInit(options: PlayerConfig) {
    return !!(
      !options.live &&
      options.speedList &&
      options.speedList.length > 0
    );
  }

  // 倍数索引，当前是那个倍数
  private currentIndex = 0;
  private speedItemsElement: NodeListOf<Element>;
  private speedLabelElement: HTMLElement;

  constructor(
    player: Player,
    slotElement: HTMLElement,
    options = {},
    parentComponent: any
  ) {
    super(player, slotElement, options, parentComponent);

    // 初始化dom
    this.initDom(slotElement);
    // 初始化索引，即是那个倍数
    this.initCurrentIndex();
    // 设置video标签倍数
    this.initDefaultRate();
    this.initListener();
    this.triggerReady();
  }

  // 查询元素
  private querySelector<T extends HTMLElement>(selector: string) {
    return this.rootElement.querySelector(selector) as T;
  }
  private querySelectorAll(selector: string) {
    return this.rootElement.querySelectorAll(selector) as NodeListOf<Element>;
  }

  private initDom(slotElement: HTMLElement) {
    const parentElement = slotElement.querySelector(".player-controls-right")!;
    const html = SpeedTpl({
      speedList: this.player.options.speedList
    });

    this.rootElement = parseHtmlToDom(html);
    parentElement.appendChild(this.rootElement);
    this.speedItemsElement = this.querySelectorAll(".player-speed-item");
    this.speedLabelElement = this.querySelector(".player-speed-label");
  }

  // 找出默认的倍数，default，然后设置
  private initCurrentIndex() {
    const speedList = this.player.options.speedList;
    const index = speedList!.findIndex((speed) => speed.default);
    if (index > -1) {
      this.setCurrentInfo(index);
    }
  }

  // 一开始的时候初始化倍数
  private initDefaultRate() {
    const speedList = this.player.options.speedList;
    if (speedList!.length > 0) {
      this.player.setSpeed(speedList![this.currentIndex].value);
    }
  }

  private initListener() {
    this.player.$on(VideoEvents.RATECHANGE, this.onRatechange.bind(this));

    this.eventManager.addEventListener({
      element: this.querySelector(".player-speed-wrapper"),
      eventName: "click",
      handler: this.onSpeedWrapperClick.bind(this)
    });
  }

  private setCurrentInfo(index: number) {
    this.setCurrentIndex(index);
    this.setCurrentLabel();
  }

  private onRatechange(event: MouseEvent) {
    const target = event.target as HTMLVideoElement;
    const rate = target.playbackRate;
    const speedList = this.player.options.speedList ?? [];
    const index = speedList.findIndex((item) => item.value === rate);
    if (index > -1 && index !== this.currentIndex) {
      this.setCurrentInfo(index);
      // 显示通知
      this.player.setNotice(speedList[index].label);
    }
  }

  // 点击倍数事件处理
  private onSpeedWrapperClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    let index = target.dataset?.index ?? -1;
    index = Number(index);
    if (index !== -1 && index !== this.currentIndex) {
      // 找到对应的倍数
      const speedList = this.player.options.speedList;
      const speed = speedList![index];
      // 设置倍数
      this.player.setSpeed(speed.value);
      // 显示通知
      this.player.setNotice(speed.label);
      // 设置索引信息
      this.setCurrentInfo(index);
    }
  }

  // 设置标签文本
  private setCurrentLabel() {
    const speedList = this.player.options.speedList;
    if (speedList!.length > 0) {
      const text = speedList![this.currentIndex].label;

      this.speedLabelElement.innerHTML = text;
    }
  }

  // 设置索引
  private setCurrentIndex(index: number) {
    this.currentIndex = index;
    // 设置高亮的元素
    this.handelSpeedItemsElement((element, i) => {
      this.setElementActive(element, i === index);
    });
  }

  // 统一在这里进行元素判空，然后执行回调
  private handelSpeedItemsElement(
    callback: (element: Element, index: number) => void
  ) {
    if (isFunction(callback)) {
      const speedItemsElement = this.speedItemsElement;
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
  private setElementActive(element: Element, isActive: boolean) {
    if (isActive) {
      this.addElementActive(element);
    } else {
      this.delElementActive(element);
    }
  }

  // 删除元素的活跃类名
  private delElementActive(element: Element) {
    if (element.classList.contains(LISTACTIVECLASSNAME)) {
      element.classList.remove(LISTACTIVECLASSNAME);
    }
  }
  // 添加元素的活跃类名
  private addElementActive(element: Element) {
    if (!element.classList.contains(LISTACTIVECLASSNAME)) {
      element.classList.add(LISTACTIVECLASSNAME);
    }
  }
}

export default VideoSpeed;
