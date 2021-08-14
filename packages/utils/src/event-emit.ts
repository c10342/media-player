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
  $emit(eventName: string, data?: any) {
    const eventList = this.eventMap[eventName] || [];
    const length = eventList.length;
    if (length > 0) {
      // 从最后一个开始执行，防止数组塌陷
      for (let i = length - 1; i >= 0; i--) {
        const fn = eventList[i];
        fn.call(this, data);
      }
    }
    return this;
  }

  //   监听一次
  $once(eventName: string, handler: Function) {
    if (!isFunction(handler)) {
      logError("第二个参数不是函数");
      return;
    }
    const fn = (...args: any) => {
      handler.call(this, ...args);
      this.$off(eventName, fn);
    };
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
      const index = this.eventMap[eventName].findIndex((fn) => fn === handler);
      if (index > -1) {
        this.eventMap[eventName].splice(index, 1);
      }
    }
    return this;
  }
  // 移除所有事件
  protected clear() {
    this.eventMap = {};
  }
}

export default EventEmit;
