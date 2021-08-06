import { userSelect } from "@media/utils";
import { HtmlElementProp } from "../types";
import EventEmit from "./event-emit";
import { checkData } from "./utils";

interface DragOptions {
  dragElement: HtmlElementProp;
  wrapperElement: HtmlElementProp;
}

type MouseFunction = (event: MouseEvent) => void;

interface WrapperElementInfo {
  left: number;
  width: number;
}

class Drag extends EventEmit {
  private isMousedown = false;
  private dragElement: HtmlElementProp;
  private wrapperElement: HtmlElementProp;
  private _onMousemove: MouseFunction;
  private _onMouseup: MouseFunction;
  private wrapperElementInfo: WrapperElementInfo = {
    left: 0,
    width: 0
  };

  constructor(options: DragOptions) {
    super();
    this.dragElement = options.dragElement;
    this.wrapperElement = options.wrapperElement;
    this.initVar();
    this.init();
  }

  private initVar() {
    this._onMousemove = this.onMousemove.bind(this);
    this._onMouseup = this.onMouseup.bind(this);

    const wrapperElement = this.wrapperElement;
    if (wrapperElement) {
      const clientRect = wrapperElement.getBoundingClientRect();
      this.wrapperElementInfo = {
        left: clientRect.left,
        width: clientRect.width
      };
    }
  }
  private init() {
    this.dragElement?.addEventListener("mousedown", () => this.onMousedown());
    this.dragElement?.addEventListener("click", (event) =>
      this.onDragElementClick(event)
    );
    this.wrapperElement?.addEventListener("click", (event) =>
      this.onWrapperElementClick(event)
    );
  }

  private onDragElementClick(event: MouseEvent) {
    event.stopPropagation();
  }

  private onWrapperElementClick(event: MouseEvent) {
    event.stopPropagation();
    const { left, width } = this.wrapperElementInfo;
    const clientX = event.clientX;
    const offsetX = clientX - left;
    // 计算百分比
    const percent = checkData(offsetX / width, 0, 1);
    this.$emit("click", percent);
  }

  private onMousedown() {
    // 禁止选中
    userSelect(false);
    // 鼠标按下标志位
    this.isMousedown = true;
    document.addEventListener("mousemove", this._onMousemove);
    document.addEventListener("mouseup", this._onMouseup);
    this.$emit("mousedown");
  }

  private removeEventListener() {
    document.removeEventListener("mouseup", this._onMouseup);
    document.removeEventListener("mousemove", this._onMousemove);
  }

  private onMousemove(event: MouseEvent) {
    if (!this.isMousedown) {
      // 一定要鼠标按下才能开始移动
      return;
    }
    const { left, width } = this.wrapperElementInfo;
    //   计算移动距离
    let offsetX = event.pageX - left;
    // 越界检查
    offsetX = checkData(offsetX, 0, width);
    const percent = offsetX / width;
    this.$emit("mousemove", percent);
  }

  private onMouseup() {
    userSelect(true);
    this.isMousedown = false;
    this.removeEventListener();
    this.$emit("mouseup");
  }

  destroy() {
    this.removeEventListener();
  }
}

export default Drag;
