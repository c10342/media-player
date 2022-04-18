import { isUndef, Drag, updateStyle } from "@lin-media/utils";
import { ClassNameEnum, CursorEnum } from "./config/enum";
import { Events } from "./config/event";
import "./style/index.scss";
import { ZoomData, ZoomOptions } from "./types";
import Player from "@lin-media/player";
import defaultOptions from "./config/default-options";

const Component = Player.getComponent<ZoomOptions>("Component");

class Zoom extends Component {
  // 自定义事件
  static customEvents = Events;

  //   父级元素
  private parentElement: HTMLElement;
  //   拖拽的元素
  private dragElement: HTMLElement | null;

  // 拖拽实例
  private dragInstance: Drag | null;
  // 记录上一个位置
  private prevPosition: ZoomData = { width: -1, height: -1 };
  constructor(
    player: Player,
    slotElement: HTMLElement,
    options: ZoomOptions = {}
  ) {
    super(player, slotElement, { ...defaultOptions, ...options });
    this.parentElement = player.options.el;
    this.init();
    this.initDrag();
  }

  // 初始化拖拽行为
  private initDrag() {
    this.dragInstance = new Drag({
      dragElement: this.dragElement,
      wrapperElement: this.parentElement
    });
    // 拖拽
    this.dragInstance.$on("mousemove", this.onMousemove.bind(this));
  }

  // 判断当前宽高跟上一个宽高是否相同
  private isChange(data: ZoomData) {
    if (
      data.width === this.prevPosition.width &&
      data.height === this.prevPosition.height
    ) {
      return false;
    }
    return true;
  }

  private init() {
    // 往父容器中添加类名
    this.addClassNameToParent();
    // 生成拖拽的元素
    this.dragElement = this.createElement();
    // 插入拖拽元素到父容器中
    this.parentElement.appendChild(this.dragElement);
  }

  // 移除拖拽的元素
  private removeDragElement() {
    if (!isUndef(this.dragElement)) {
      this.dragElement.parentElement?.removeChild(this.dragElement);
    }
  }

  // 鼠标移动事件处理,也就是拖拽事件
  private onMousemove(data: { offsetX: number; offsetY: number }) {
    const result = this.checkData({
      width: data.offsetX,
      height: data.offsetY
    });
    // 判断一下宽高是否改变了
    if (this.isChange(result)) {
      // 记录当前的宽高
      this.prevPosition = result;
      // 设置父容器的宽高
      this.setParentStyle(result);
      this.player.$emit(Events.ZOOM, result);
    }
  }

  // 添加类名到父容器中
  private addClassNameToParent() {
    if (!this.parentElement.classList.contains(ClassNameEnum.ZOOMRELATIVE)) {
      this.parentElement.classList.add(ClassNameEnum.ZOOMRELATIVE);
    }
  }
  // 移除父容器类名
  private removeClassNameToParent() {
    if (this.parentElement.classList.contains(ClassNameEnum.ZOOMRELATIVE)) {
      this.parentElement.classList.remove(ClassNameEnum.ZOOMRELATIVE);
    }
  }
  // 检查宽高是否越界，符合要求等
  private checkData({ width, height }: ZoomData) {
    const { minHeight, minWidth, maxHeight, maxWidth, x, y } = this.options;
    if (x) {
      if (!isUndef(minWidth)) {
        width = width <= minWidth ? minWidth : width;
      }
      if (!isUndef(maxWidth)) {
        width = width >= maxWidth ? maxWidth : width;
      }
    }
    if (y) {
      if (!isUndef(minHeight)) {
        height = height <= minHeight ? minHeight : height;
      }
      if (!isUndef(maxHeight)) {
        height = height >= maxHeight ? maxHeight : height;
      }
    }

    return { width, height };
  }

  // 创建拖拽元素
  private createElement() {
    const { x, y } = this.options;
    const div = document.createElement("div");
    div.className = ClassNameEnum.ZOOMDRAG;
    let cursor;
    if (x && y) {
      cursor = CursorEnum.default;
    } else if (x) {
      cursor = CursorEnum.x;
    } else if (y) {
      cursor = CursorEnum.y;
    }
    if (cursor) {
      updateStyle(div, {
        cursor
      });
    }
    return div;
  }

  // 设置父容器的宽高样式
  private setParentStyle(style?: { width: number; height: number }) {
    if (!isUndef(style)) {
      const { x, y } = this.options;
      updateStyle(this.parentElement, {
        // 开启横向拖拽才设置
        width: x ? `${style.width}px` : undefined,
        // 开始纵向拖拽才设置
        height: y ? `${style.height}px` : undefined
      });
    } else {
      // 宽高样式不存在就重置样式
      updateStyle(this.parentElement, {
        // 开启横向拖拽才设置
        width: "",
        // 开始纵向拖拽才设置
        height: ""
      });
    }
  }

  destroy() {
    this.removeClassNameToParent();
    this.setParentStyle();
    this.removeDragElement();
    this.dragInstance?.destroy();
    super.destroy();
  }
}

export default Zoom;
