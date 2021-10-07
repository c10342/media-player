import { isUndef, Drag } from "@lin-media/utils";
import { pluginName } from "./config/constant";
import { ClassNameEnum, CursorEnum } from "./config/enum";
import { ZoomEvents } from "./config/event";
import "./style/index.scss";
import { ZoomData, ZoomOptions } from "./types";
import MediaPlayer from "@lin-media/player";

const defaultOptions = {
  x: true,
  y: true,
  minHeight: 0,
  minWidth: 0
};
class Zoom {
  // 自定义事件
  static customEvents = ZoomEvents;
  // 插件名称.
  static pluginName = pluginName;
  // 播放器实例
  private instance: MediaPlayer;
  //   父级元素
  private parentElement: HTMLElement;
  //   拖拽的元素
  private dragElement: HTMLElement | null;
  // 参数
  private options: ZoomOptions;
  // 拖拽实例
  private dragInstance: Drag | null;
  // 记录上一个位置
  private prevPosition: ZoomData = { width: -1, height: -1 };
  constructor(el: HTMLElement, instance: MediaPlayer) {
    this.instance = instance;
    this.parentElement = instance.options.el as HTMLElement;
    const options = instance.options[pluginName] ?? {};
    this.options = { ...defaultOptions, ...options };
    this.init();
    this.initDrag();
    this.initListener();
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
      this.instance.$emit(ZoomEvents.ZOOM, result);
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
    if (x && y) {
      div.style.cursor = CursorEnum.default;
    } else if (x) {
      div.style.cursor = CursorEnum.x;
    } else if (y) {
      div.style.cursor = CursorEnum.y;
    }
    return div;
  }

  // 设置父容器的宽高样式
  private setParentStyle(style?: { width: number; height: number }) {
    if (!isUndef(style)) {
      const { x, y } = this.options;
      if (x) {
        // 开启横向拖拽才设置
        this.parentElement.style.width = `${style.width}px`;
      }
      if (y) {
        // 开始纵向拖拽才设置
        this.parentElement.style.height = `${style.height}px`;
      }
    } else {
      // 宽高样式不存在就重置样式
      this.parentElement.style.width = "";
      this.parentElement.style.height = "";
    }
  }

  private initListener() {
    this.instance.$on(MediaPlayer.PlayerEvents.DESTROY, () => {
      this.removeClassNameToParent();
      this.setParentStyle();
      this.removeDragElement();
      this.dragInstance?.destroy();
    });
  }
}

export default Zoom;
