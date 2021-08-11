import { EventManager, isFunction, isUndef } from "@media/utils";
import { LISTACTIVECLASSNAME } from "../config/constant";
import { CustomEvents } from "../js/event";
import { ComponentOptions, SpeedItem } from "../types";

interface OptionsParams extends ComponentOptions {
  speedList: Array<SpeedItem>;
}

class VideoSpeed {
  private options: OptionsParams;
  private eventManager: EventManager;
  private currentIndex = 0;
  constructor(options: OptionsParams) {
    this.options = options;
    this.initVar();
    this.initCurrentIndex();
    this.initDefaultRate();
    this.initSpeedListener();
    this.initListener();
  }

  private get instance() {
    return this.options.instance;
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initListener() {
    this.instance.$on(CustomEvents.DESTROY, () => this.destroy());
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
      this.setCurrentInfo(index);
    }
  }

  private onSpeedWrapperClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    let index = target.dataset?.index ?? -1;
    index = Number(index);
    if (index !== -1 && index !== this.currentIndex) {
      const speedList = this.options.speedList;
      const speed = speedList[index];
      this.instance.setSpeed(speed.value);
      this.instance.setNotice(speed.label);
      this.setCurrentInfo(index);
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

  private setCurrentLabel() {
    const speedLabelElement = this.options.templateInstance.speedLabelElement;
    if (!isUndef(speedLabelElement)) {
      const speedList = this.options.speedList;
      if (speedList.length > 0) {
        const text = speedList[this.currentIndex].label;
        speedLabelElement.innerHTML = text;
      }
    }
  }

  private initDefaultRate() {
    const speedList = this.options.speedList;
    if (speedList.length > 0) {
      this.instance.setSpeed(speedList[this.currentIndex].value);
    }
  }

  private delElementActive(element: Element) {
    if (element.classList.contains(LISTACTIVECLASSNAME)) {
      element.classList.remove(LISTACTIVECLASSNAME);
    }
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

  destroy() {
    this.eventManager.removeEventListener();
  }
}

export default VideoSpeed;
