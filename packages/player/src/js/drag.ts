import {
  EventManager,
  isFunction,
  isUndef,
  userSelect,
  checkData
} from "@media/utils";
import { HtmlElementProp } from "../types";
import EventEmit from "./event-emit";

interface DragOptions {
  dragElement: HtmlElementProp;
  wrapperElement: HtmlElementProp;
  // 是否节流
  throttle?: boolean;
}

interface WrapperInfo {
  left: number;
  width: number;
}

type MouseFunction = (event: MouseEvent) => void;

const defaultOptions = {
  throttle: true
};

class Drag extends EventEmit {
  // 鼠标是否按下
  private isMousedown = false;
  // 鼠标移动事件
  private _onMousemove: MouseFunction;
  // 鼠标抬起事件
  private _onMouseup: MouseFunction;
  // 已经移动的/总长度的百分比
  private percent = 0;
  // 事件管理器
  private eventManager: EventManager;
  // 参数
  private options: DragOptions;
  // 容器信息
  private wrapperInfo: WrapperInfo;

  constructor(options: DragOptions) {
    super();
    this.options = { ...defaultOptions, ...options };
    // 初始化所需要的变量和数据
    this.initVar();
    this.getWrapperInfo();
    // 初始化拖拽行为
    this.initDrag();
  }

  private initVar() {
    this._onMousemove = this.onMousemove.bind(this);
    this._onMouseup = this.onMouseup.bind(this);
    this.eventManager = new EventManager();
  }
  private getWrapperInfo() {
    let wrapperInfo = { left: 0, width: 0 };
    const wrapperElement = this.options?.wrapperElement;
    if (wrapperElement) {
      const clientRect = wrapperElement.getBoundingClientRect();
      wrapperInfo = {
        left: clientRect.left,
        width: clientRect.width
      };
    }
    this.wrapperInfo = wrapperInfo;
  }
  private initDrag() {
    // 进行拖拽的元素
    const dragElement = this.options?.dragElement;
    // 在那个容器上面进行拖拽
    const wrapperElement = this.options?.wrapperElement;
    if (!isUndef(dragElement)) {
      this.eventManager.addEventListener({
        element: dragElement,
        eventName: "mousedown",
        handler: this.onMousedown.bind(this)
      });
      // 阻止点击事件
      this.eventManager.addEventListener({
        element: dragElement,
        eventName: "click",
        handler: this.onDragElementClick.bind(this)
      });
    }
    if (!isUndef(wrapperElement)) {
      this.eventManager.addEventListener({
        element: wrapperElement,
        eventName: "click",
        handler: this.onWrapperElementClick.bind(this)
      });
    }
  }

  private onDragElementClick(event: MouseEvent) {
    // 阻止拖拽元素的点击事件
    event.stopPropagation();
  }

  // 拖拽容器的点击事件
  private onWrapperElementClick(event: MouseEvent) {
    event.stopPropagation();
    if (!this.options.throttle) {
      this.getWrapperInfo();
    }
    // 获取容器的宽度和记录页面左边的距离
    const { left, width } = this.wrapperInfo;

    // 获取鼠标点击的位置
    const clientX = event.clientX;
    // 拿到点击的位置距离容器左边的距离
    const offsetX = clientX - left;
    // 计算百分比
    const percent = checkData(offsetX / width, 0, 1);
    // 记录一下百分比
    this.percent = percent;
    this.$emit("click", percent);
  }

  // 拖拽元素鼠标点击事件处理
  private onMousedown() {
    // 禁止选中，防止鼠标抬起事件丢失
    userSelect(false);
    // 鼠标按下标志位
    this.isMousedown = true;
    // 全局注册鼠标移动事件和抬起事件
    if (isFunction(this._onMousemove) && isFunction(this._onMouseup)) {
      document.addEventListener("mousemove", this._onMousemove);
      document.addEventListener("mouseup", this._onMouseup);
    }
    // 发射出去让外部处理
    this.$emit("mousedown");
  }

  private removeEventListener() {
    // 移除事件监听
    if (isFunction(this._onMousemove) && isFunction(this._onMouseup)) {
      document.removeEventListener("mouseup", this._onMouseup);
      document.removeEventListener("mousemove", this._onMousemove);
    }
  }

  // 鼠标移动事件处理
  private onMousemove(event: MouseEvent) {
    if (!this.isMousedown) {
      // 一定要鼠标按下才能开始移动
      return;
    }
    if (!this.options.throttle) {
      this.getWrapperInfo();
    }
    // 获取拖拽容器相关信息
    const { left, width } = this.wrapperInfo;

    //   计算移动距离
    let offsetX = event.pageX - left;
    // 越界检查
    offsetX = checkData(offsetX, 0, width);
    // 计算百分比
    const percent = offsetX / width;
    this.percent = percent;

    this.$emit("mousemove", percent);
  }

  // 鼠标抬起事件处理
  private onMouseup() {
    userSelect(true);
    this.isMousedown = false;
    this.removeEventListener();
    this.$emit("mouseup", this.percent);
  }

  // 尺寸发生变化需要重新获取一下数据
  reload() {
    this.getWrapperInfo();
  }

  destroy() {
    this.eventManager.removeEventListener();
    // 销毁的时候记得还要移除一下document上的鼠标事件
    this.removeEventListener();
  }
}

export default Drag;
