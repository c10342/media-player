import { isFunction, isString, isUndef } from "./is";

interface EventItem {
  element: HTMLElement | null | Window | Document | undefined;
  eventName: string;
  handler: (event?: any) => void;
}

class EventManager {
  private eventList: Array<EventItem> = [];
  private findIndex(options: EventItem) {
    return this.eventList.findIndex((item) => {
      return (
        item.element === options.element &&
        item.eventName === options.eventName &&
        item.handler === options.handler
      );
    });
  }
  private canReister({ element, eventName, handler }: EventItem) {
    return !isUndef(element) && isString(eventName) && isFunction(handler);
  }
  addEventListener(options: EventItem) {
    const index = this.findIndex(options);
    if (index === -1 && this.canReister(options)) {
      const { element, eventName, handler } = options;
      this.eventList.push(options);
      element?.addEventListener(eventName, handler);
    }
  }

  removeEventListener() {
    this.eventList.forEach(({ element, eventName, handler }) => {
      element?.removeEventListener(eventName, handler);
    });
    this.eventList = [];
  }

  removeElementEventListener(element: HTMLElement | null) {
    const length = this.eventList.length;
    for (let i = length - 1; i >= 0; i--) {
      const eventItem = this.eventList[i];
      if (eventItem.element === element) {
        this.eventList.splice(i, 1);
      }
    }
  }
}

export default EventManager;
