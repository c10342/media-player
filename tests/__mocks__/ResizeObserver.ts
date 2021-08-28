interface Window {
  ResizeObserver: any;
}

// @ts-ignore
class ResizeObserver {
  callback: Function;
  elementList: Array<HTMLElement>;
  constructor(callback: Function) {
    this.callback = callback;
    this.elementList = [];
  }

  observe(element: HTMLElement) {
    this.elementList.push(element);
  }

  disconnect() {
    // todo
  }
}

global.window.ResizeObserver = ResizeObserver;
