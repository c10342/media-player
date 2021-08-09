import { EventManager, isFunction, isUndef } from "@media/utils";
import { LISTACTIVECLASSNAME } from "../config/constant";
import { CustomEvents } from "../js/event";
import { checkData } from "../js/utils";
import { ComponentOptions, SpeedItem } from "../types";

interface OptionsParams extends ComponentOptions {
  speedList: Array<SpeedItem>;
}

class VideoSpeed {
  private options: OptionsParams;
  private eventManager: EventManager;
  private currentIndex = 0;
  private taskList: Array<Function> = [];
  private isSwitchDefinition = false;
  constructor(options: OptionsParams) {
    this.options = options;
    this.initVar();
    this.initCurrentIndex();
    this.setCurrentInfo(this.currentIndex);
    this.initDefaultRate();
    this.initSpeedListener();
    this.initVideoListener();
    this.initListener();
  }
  private get playbackRate() {
    const videoElement = this.options.templateInstance.videoElement;
    if (!isUndef(videoElement)) {
      return videoElement.playbackRate;
    }
    return null;
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initListener() {
    const instance = this.options.instance;
    instance.$on(CustomEvents.DESTROY, () => this.destroy());
    instance.$on(CustomEvents.SWITCH_DEFINITION_START, () =>
      this.onBeforeSwitchDefinition()
    );
  }

  private initSpeedListener() {
    const speedWrapperElement =
      this.options.templateInstance.speedWrapperElement;
    this.eventManager.addEventListener({
      element: speedWrapperElement,
      eventName: "click",
      handler: this.onSpeedWrapperClick.bind(this)
    });
  }

  private initCurrentIndex() {
    const speedList = this.options.speedList;
    const index = speedList.findIndex((speed) => speed.default);
    if (index > -1) {
      this.currentIndex = index;
    }
  }

  private initVideoListener() {
    const videoElement = this.options.templateInstance.videoElement;
    this.eventManager.addEventListener({
      element: videoElement,
      eventName: "ratechange",
      handler: this.onVideoRatechange.bind(this)
    });
    this.eventManager.addEventListener({
      element: videoElement,
      eventName: "canplay",
      handler: this.onVideoCanplay.bind(this)
    });
  }

  private onVideoRatechange() {
    if (this.isSwitchDefinition) {
      // 防止切换清晰度的时候底部的标签会发生变化
      return;
    }
    const playbackRate = this.playbackRate;
    if (!isUndef(playbackRate)) {
      const speedList = this.options.speedList;
      const index = speedList.findIndex(
        (speed) => speed.value === playbackRate
      );
      if (index === -1) {
        this.setCurrentLabel(`${playbackRate}x`);
        this.delAllElementActive();
      } else {
        this.setCurrentInfo(index);
      }
    }
  }

  private onVideoCanplay() {
    this.runTask();
  }

  private onSpeedWrapperClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    let index = target.dataset?.index ?? -1;
    index = Number(index);
    if (index !== -1 && index !== this.currentIndex) {
      const speedList = this.options.speedList;
      const speed = speedList[index];
      this.setPlaybackRate(speed.value);
    }
  }

  private onBeforeSwitchDefinition() {
    const playbackRate = this.playbackRate;
    this.isSwitchDefinition = true;
    if (!isUndef(playbackRate)) {
      this.taskList.push(() => {
        this.isSwitchDefinition = false;
        this.setPlaybackRate(playbackRate);
      });
    }
  }

  private setCurrentIndex(index: number) {
    this.currentIndex = index;
    this.handelSpeedItemsElement((element, i) => {
      this.setElementActive(element, i === index);
    });
  }

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

  private setCurrentLabel(label?: string) {
    const speedLabelElement = this.options.templateInstance.speedLabelElement;
    if (!isUndef(speedLabelElement)) {
      if (!isUndef(label)) {
        speedLabelElement.innerHTML = label;
        return;
      }
      const speedList = this.options.speedList;
      if (speedList.length > 0) {
        speedLabelElement.innerHTML = speedList[this.currentIndex].label;
      }
    }
  }

  private setPlaybackRate(playbackRate: number) {
    const videoElement = this.options.templateInstance.videoElement;
    if (!isUndef(videoElement)) {
      playbackRate = checkData(playbackRate, 0, 2);
      videoElement.playbackRate = playbackRate;
    }
  }

  private initDefaultRate() {
    const speedList = this.options.speedList;
    if (speedList.length > 0) {
      this.setPlaybackRate(speedList[this.currentIndex].value);
    }
  }

  private delElementActive(element: Element) {
    if (element.classList.contains(LISTACTIVECLASSNAME)) {
      element.classList.remove(LISTACTIVECLASSNAME);
    }
  }

  private delAllElementActive() {
    this.handelSpeedItemsElement((element) => {
      this.delElementActive(element);
    });
  }

  private addElementActive(element: Element) {
    if (!element.classList.contains(LISTACTIVECLASSNAME)) {
      element.classList.add(LISTACTIVECLASSNAME);
    }
  }

  private handelSpeedItemsElement(
    callback: (element: Element, index: number) => void
  ) {
    if (isFunction(callback)) {
      const speedItemsElement = this.options.templateInstance.speedItemsElement;
      const length = speedItemsElement?.length ?? 0;
      if (speedItemsElement && length > 0) {
        for (let i = 0; i < speedItemsElement.length; i++) {
          const element = speedItemsElement[i];
          callback(element, i);
        }
      }
    }
  }

  private runTask() {
    if (this.taskList.length > 0) {
      this.taskList.forEach((task) => task());
      this.taskList = [];
    }
  }

  destroy() {
    this.eventManager.removeEventListener();
  }
}

export default VideoSpeed;
