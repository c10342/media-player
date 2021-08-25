import { EventManager, isFunction } from "@lin-media/utils";
import { LISTACTIVECLASSNAME } from "../config/constant";
import { PlayerEvents, VideoEvents } from "../config/event";
import PlayerConstructor from "../constructor";

class VideoSpeed {
  private playerInstance: PlayerConstructor;
  private eventManager: EventManager;
  // 倍数索引，当前是那个倍数
  private currentIndex = 0;
  constructor(playerInstance: PlayerConstructor) {
    this.playerInstance = playerInstance;
    this.initVar();
    // 初始化索引，即是那个倍数
    this.initCurrentIndex();
    // 设置video标签倍数
    this.initDefaultRate();
    this.initListener();
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initListener() {
    this.playerInstance.$on(PlayerEvents.DESTROY, () => this.destroy());
    this.playerInstance.$on(
      VideoEvents.RATECHANGE,
      this.onRatechange.bind(this)
    );
    this.eventManager.addEventListener({
      element: this.playerInstance.templateInstance.speedWrapperElement,
      eventName: "click",
      handler: this.onSpeedWrapperClick.bind(this)
    });
  }

  // 找出默认的倍数，default，然后设置
  private initCurrentIndex() {
    const speedList = this.playerInstance.options.speedList;
    const index = speedList!.findIndex((speed) => speed.default);
    if (index > -1) {
      this.setCurrentInfo(index);
    }
  }
  // 点击倍数事件处理
  private onSpeedWrapperClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    let index = target.dataset?.index ?? -1;
    index = Number(index);
    if (index !== -1 && index !== this.currentIndex) {
      // 找到对应的倍数
      const speedList = this.playerInstance.options.speedList;
      const speed = speedList![index];
      // 设置倍数
      this.playerInstance.setSpeed(speed.value);
      // 显示通知
      this.playerInstance.setNotice(speed.label);
      // 设置索引信息
      this.setCurrentInfo(index);
    }
  }

  private onRatechange(event: MouseEvent) {
    const target = event.target as HTMLVideoElement;
    const rate = target.playbackRate;
    const speedList = this.playerInstance.options.speedList ?? [];
    const index = speedList.findIndex((item) => item.value === rate);
    if (index > -1 && index !== this.currentIndex) {
      this.setCurrentInfo(index);
      // 显示通知
      this.playerInstance.setNotice(speedList[index].label);
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
  // 切换元素的活跃类名
  private setElementActive(element: Element, isActive: boolean) {
    if (isActive) {
      this.addElementActive(element);
    } else {
      this.delElementActive(element);
    }
  }

  private setCurrentInfo(index: number) {
    this.setCurrentIndex(index);
    this.setCurrentLabel();
  }
  // 设置标签文本
  private setCurrentLabel() {
    const speedLabelElement =
      this.playerInstance.templateInstance.speedLabelElement;
    const speedList = this.playerInstance.options.speedList;
    if (speedList!.length > 0) {
      const text = speedList![this.currentIndex].label;
      speedLabelElement.innerHTML = text;
    }
  }
  // 一开始的时候初始化倍数
  private initDefaultRate() {
    const speedList = this.playerInstance.options.speedList;
    if (speedList!.length > 0) {
      this.playerInstance.setSpeed(speedList![this.currentIndex].value);
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
  // 统一在这里进行元素判空，然后执行回调
  private handelSpeedItemsElement(
    callback: (element: Element, index: number) => void
  ) {
    if (isFunction(callback)) {
      const speedItemsElement =
        this.playerInstance.templateInstance.speedItemsElement;
      const length = speedItemsElement?.length ?? 0;
      if (speedItemsElement && length > 0) {
        for (let i = 0; i < speedItemsElement.length; i++) {
          const element = speedItemsElement[i];
          callback(element, i);
        }
      }
    }
  }

  private destroy() {
    this.eventManager.removeEventListener();
  }
}

export default VideoSpeed;
