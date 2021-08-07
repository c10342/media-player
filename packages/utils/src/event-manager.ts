interface EventItem {
  element: HTMLElement | null | Window | Document;
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
  addEventListener(options: EventItem) {
    const index = this.findIndex(options);
    if (index === -1) {
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
}

export default EventManager;
