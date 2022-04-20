import { isArray, isFunction } from "./is";
import { logError } from "./log";

class EventEmit {
  eventMap: Record<string, Array<Function>> = {};
  //   监听事件
  $on(eventName: string, handler: Function) {
    if (!isFunction(handler)) {
      logError("第二个参数不是函数");
      return;
    }
    if (!isArray(this.eventMap[eventName])) {
      this.eventMap[eventName] = [];
    }

    this.eventMap[eventName].push(handler);
    return this;
  }
  // 发射事件
  $emit(eventName: string, ...data: any) {
    const eventList = (this.eventMap[eventName] || []).slice();
    eventList.forEach((fn) => {
      fn(...data);
    });

    return this;
  }

  //   监听一次
  $once(eventName: string, handler: Function) {
    if (!isFunction(handler)) {
      logError("第二个参数不是函数");
      return;
    }
    const fn = (...args: any) => {
      handler(...args);
      this.$off(eventName, fn);
    };
    // 保存原有的函数，防止在没有触发前，用户取消监听
    fn._fn = handler;
    this.$on(eventName, fn);
    return this;
  }

  //   取消监听自定义事件
  $off(eventName: string, handler?: Function) {
    if (!this.eventMap[eventName]) {
      return;
    }
    if (!isFunction(handler)) {
      delete this.eventMap[eventName];
    } else {
      const index = this.eventMap[eventName].findIndex(
        (fn: any) => fn === handler || fn._fn == handler
      );
      if (index > -1) {
        this.eventMap[eventName].splice(index, 1);
      }
    }
    return this;
  }
  // 移除所有事件
  clear() {
    this.eventMap = {};
  }
}

export default EventEmit;
