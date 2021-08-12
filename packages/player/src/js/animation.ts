import { EventManager, isUndef } from "@media/utils";
import { AnimationClassName, HtmlElementProp } from "../types";
import EventEmit from "./event-emit";
import {
  getAnimationClassName,
  getElementStyle,
  nextTick,
  setClassName
} from "./utils";

class AnimationHelper extends EventEmit {
  private className: AnimationClassName;
  private element: HtmlElementProp;
  private isShow: boolean;
  private originalDisplay: string;
  private originalClassName: string;
  private eventManager: EventManager;
  constructor(element: HTMLElement, animationName: string) {
    super();
    this.initVar(element, animationName);
    this.initListener();
  }
  private initVar(element: HTMLElement, animationName: string) {
    // 根据动画名得到不同状态所对应的css类名
    this.className = getAnimationClassName(animationName);
    // 事件管理器
    this.eventManager = new EventManager();
    // 获取进行过渡动画的元素
    this.element = element;
    // 获取display的初始值
    const displayStyle = getElementStyle(element, "display") as string;
    // 判断当前是否处于显示状态
    this.isShow = displayStyle !== "none";
    // 初始显示状态
    this.originalDisplay = displayStyle;
    // 原始类名
    this.originalClassName = this.element.className;
  }
  private initListener() {
    // 监听过渡动画结束
    this.eventManager.addEventListener({
      element: this.element,
      eventName: "transitionend",
      handler: this.onAnimationend.bind(this)
    });
    // 接听动画结束
    this.eventManager.addEventListener({
      element: this.element,
      eventName: "animationend",
      handler: this.onAnimationend.bind(this)
    });
  }
  // 显示元素
  show() {
    const element = this.element;
    if (this.isShow || isUndef(element)) {
      // 已经是显示状态的不需要处理
      return;
    }
    // 修改标志位为true，即显示
    this.isShow = true;
    // 初始类名，就是一开始原有的类名
    const originalClassName = this.originalClassName;
    // 发射事件
    this.$emit("before-enter");
    // 准备开始动画
    Promise.resolve()
      .then(() => {
        if (this.isShowStatus) {
          // 隐藏的元素首先需要显示出来才能进行动画
          element.style.display =
            this.originalDisplay === "none" ? "block" : "";
          // 设置enter过度的类名，注意不要遗漏掉原来已经有的类名
          element.className = setClassName(
            originalClassName,
            this.className.enter
          );
          // 发射事件
          this.$emit("enter");
        }
      })
      .then(nextTick()) // 等待一会，准备开始下一个状态
      .then(() => {
        if (this.isShowStatus) {
          // 设置enter-to过度的类名
          element.className = setClassName(
            originalClassName,
            this.className["enter-to"]
          );
        }
      });
  }
  // 隐藏元素，实现思路跟show一样的
  hide() {
    const element = this.element;
    if (!this.isShow || isUndef(element)) {
      return;
    }
    this.isShow = false;
    const originalClassName = this.originalClassName;
    this.$emit("before-leave");
    Promise.resolve()
      .then(() => {
        if (this.isHideStatus) {
          element.className = setClassName(
            originalClassName,
            this.className.leave
          );
          this.$emit("leave");
        }
      })
      .then(nextTick())
      .then(() => {
        if (this.isHideStatus) {
          element.className = setClassName(
            originalClassName,
            this.className["leave-to"]
          );
        }
      });
  }

  private onAfterLeave() {
    const element = this.element;
    if (this.isHideStatus && element) {
      element.className = this.originalClassName;
      // 等待过渡动画结束之后才真正隐藏元素
      element.style.display = "none";
      this.$emit("after-leave");
    }
  }

  private onAfterEnter() {
    const element = this.element;
    if (this.isShowStatus && element) {
      // 重置类名和样式
      element.className = this.originalClassName;
      this.$emit("after-enter");
    }
  }

  private onAnimationend() {
    this.onAfterEnter();
    this.onAfterLeave();
  }

  private get isHideStatus() {
    return this.isShow === false;
  }

  private get isShowStatus() {
    return this.isShow === true;
  }

  destroy() {
    // 销毁的时候取消事件监听
    this.eventManager.removeEventListener();
  }
}

export default AnimationHelper;
