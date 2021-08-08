import { EventManager, isFunction, isUndef, userSelect } from "@media/utils";
import { HtmlElementProp } from "../types";
import EventEmit from "./event-emit";
import { checkData } from "./utils";

interface DragOptions {
  dragElement: HtmlElementProp;
  wrapperElement: HtmlElementProp;
}

interface WrapperInfo {
  left: number;
  width: number;
}

type MouseFunction = (event: MouseEvent) => void;

class Drag extends EventEmit {
  private isMousedown = false;
  private _onMousemove: MouseFunction | null;
  private _onMouseup: MouseFunction | null;
  private percent = 0;
  private eventManager: EventManager | null;
  private wrapperInfo: WrapperInfo | null;
  private options: DragOptions | null;

  constructor(options: DragOptions) {
    super();
    this.options = options;
    this.initVar();
    this.init();
  }

  private initVar() {
    this._onMousemove = this.onMousemove.bind(this);
    this._onMouseup = this.onMouseup.bind(this);
    this.eventManager = new EventManager();
  }
  private getWrapperInfo(): WrapperInfo {
    if (this.wrapperInfo) {
      return this.wrapperInfo;
    }
    this.wrapperInfo = { left: 0, width: 0 };
    const wrapperElement = this.options?.wrapperElement;
    if (wrapperElement) {
      const clientRect = wrapperElement.getBoundingClientRect();
      this.wrapperInfo = {
        left: clientRect.left,
        width: clientRect.width
      };
    }
    return this.wrapperInfo;
  }
  private init() {
    const dragElement = this.options?.dragElement;
    const wrapperElement = this.options?.wrapperElement;
    if (!isUndef(dragElement)) {
      this.eventManager?.addEventListener({
        element: dragElement,
        eventName: "mousedown",
        handler: this.onMousedown.bind(this)
      });
      this.eventManager?.addEventListener({
        element: dragElement,
        eventName: "click",
        handler: this.onDragElementClick.bind(this)
      });
    }
    if (!isUndef(wrapperElement)) {
      this.eventManager?.addEventListener({
        element: wrapperElement,
        eventName: "click",
        handler: this.onWrapperElementClick.bind(this)
      });
    }
  }

  private onDragElementClick(event: MouseEvent) {
    event.stopPropagation();
  }

  private onWrapperElementClick(event: MouseEvent) {
    event.stopPropagation();

    const { left, width } = this.getWrapperInfo();
    const clientX = event.clientX;
    const offsetX = clientX - left;
    // 计算百分比
    const percent = checkData(offsetX / width, 0, 1);
    this.percent = percent;
    this.$emit("click", percent);
  }

  private onMousedown() {
    // 禁止选中
    userSelect(false);
    // 鼠标按下标志位
    this.isMousedown = true;
    if (isFunction(this._onMousemove) && isFunction(this._onMouseup)) {
      document.addEventListener("mousemove", this._onMousemove);
      document.addEventListener("mouseup", this._onMouseup);
    }
    this.$emit("mousedown");
  }

  private removeEventListener() {
    if (isFunction(this._onMousemove) && isFunction(this._onMouseup)) {
      document.removeEventListener("mouseup", this._onMouseup);
      document.removeEventListener("mousemove", this._onMousemove);
    }
  }

  private onMousemove(event: MouseEvent) {
    if (!this.isMousedown) {
      // 一定要鼠标按下才能开始移动
      return;
    }
    const { left, width } = this.getWrapperInfo();

    //   计算移动距离
    let offsetX = event.pageX - left;
    // 越界检查
    offsetX = checkData(offsetX, 0, width);
    const percent = offsetX / width;
    this.percent = percent;

    this.$emit("mousemove", percent);
  }

  private onMouseup() {
    userSelect(true);
    this.isMousedown = false;
    this.removeEventListener();
    this.$emit("mouseup", this.percent);
  }

  private resetData() {
    this.isMousedown = false;
    this._onMousemove = null;
    this._onMouseup = null;
    this.percent = 0;
    this.options = null;
    this.eventManager = null;
  }

  destroy() {
    this.eventManager?.removeEventListener();
    this.removeEventListener();
    this.resetData();
  }
}

export default Drag;
