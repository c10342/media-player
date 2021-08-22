import checkData from "./checkData";
import EventEmit from "./event-emit";
import EventManager from "./event-manager";
import { isFunction, isUndef } from "./is";
import userSelect from "./user-select";

interface DragOptions {
  dragElement: HTMLElement | null | undefined;
  wrapperElement: HTMLElement | null | undefined;
}

type MouseFunction = (event: MouseEvent) => void;

interface DataInfo {
  offsetX: number;
  offsetY: number;
  percentX: number;
  percentY: number;
}

class Drag extends EventEmit {
  // 鼠标是否按下
  private isMousedown = false;
  // 鼠标移动事件
  private _onMousemove: MouseFunction;
  // 鼠标抬起事件
  private _onMouseup: MouseFunction;
  // 事件管理器
  private eventManager: EventManager;
  // 参数
  private options: DragOptions;

  constructor(options: DragOptions) {
    super();
    this.options = options;
    // 初始化所需要的变量和数据
    this.initVar();
    // 初始化拖拽行为
    this.initDrag();
  }

  private initVar() {
    this._onMousemove = this.onMousemove.bind(this);
    this._onMouseup = this.onMouseup.bind(this);
    this.eventManager = new EventManager();
  }
  private getWrapperInfo() {
    const wrapperElement = this.options?.wrapperElement;

    const pos = { left: 0, top: 0 };
    let obj: any = wrapperElement;

    while (obj) {
      pos.left += obj.offsetLeft;
      pos.top += obj.offsetTop;
      obj = obj.offsetParent;
    }

    return {
      left: pos.left,
      top: pos.top,
      width: wrapperElement?.offsetWidth || 0,
      height: wrapperElement?.offsetHeight || 0
    };
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

    const data = this.getInfo(event);
    this.$emit("click", data);
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

    const data = this.getInfo(event);
    this.$emit("mousemove", data);
  }

  // 鼠标抬起事件处理
  private onMouseup(event: MouseEvent) {
    userSelect(true);
    this.isMousedown = false;
    this.removeEventListener();
    const data = this.getInfo(event);
    this.$emit("mouseup", data);
  }

  private getInfo(event: MouseEvent): DataInfo {
    // 获取容器的宽度和记录页面左边的距离
    const { left, width, top, height } = this.getWrapperInfo();

    // 拿到点击的位置距离容器左边的距离
    const offsetX = event.pageX - left;
    const offsetY = event.pageY - top;
    // 计算百分比
    const percentX = checkData(offsetX / width, 0, 1);
    const percentY = checkData(offsetY / height, 0, 1);
    return {
      offsetX,
      offsetY,
      percentX,
      percentY
    };
  }

  destroy() {
    this.eventManager.removeEventListener();
    // 销毁的时候记得还要移除一下document上的鼠标事件
    this.removeEventListener();
  }
}

export default Drag;
