import { isUndef, Drag, updateStyle } from "@lin-media/utils";
import { pluginName } from "./config/constant";
import { ClassNameEnum, CursorEnum } from "./config/enum";
import { ZoomEvents } from "./config/event";
import "./style/index.scss";
import { ZoomData, ZoomOptions } from "./types";
import MediaPlayer from "@lin-media/player";
import defaultOptions from "./config/default-options";

class Zoom {
  // 自定义事件
  static customEvents = ZoomEvents;
  // 插件名称.
  static pluginName = pluginName;
  // 播放器实例
  private _playerInstance: MediaPlayer;
  //   父级元素
  private _parentElement: HTMLElement;
  //   拖拽的元素
  private _dragElement: HTMLElement | null;
  // 参数
  private _options: ZoomOptions;
  // 拖拽实例
  private _dragInstance: Drag | null;
  // 记录上一个位置
  private _prevPosition: ZoomData = { width: -1, height: -1 };
  constructor(playerInstance: MediaPlayer) {
    this._playerInstance = playerInstance;
    this._parentElement = playerInstance.$options.el;
    const options = playerInstance.$options[pluginName] ?? {};
    this._options = { ...defaultOptions, ...options };
    this._init();
    this._initDrag();
    this._initListener();
  }

  // 初始化拖拽行为
  private _initDrag() {
    this._dragInstance = new Drag({
      dragElement: this._dragElement,
      wrapperElement: this._parentElement
    });
    // 拖拽
    this._dragInstance.$on("mousemove", this._onMousemove.bind(this));
  }

  // 判断当前宽高跟上一个宽高是否相同
  private _isChange(data: ZoomData) {
    if (
      data.width === this._prevPosition.width &&
      data.height === this._prevPosition.height
    ) {
      return false;
    }
    return true;
  }

  private _init() {
    // 往父容器中添加类名
    this._addClassNameToParent();
    // 生成拖拽的元素
    this._dragElement = this._createElement();
    // 插入拖拽元素到父容器中
    this._parentElement.appendChild(this._dragElement);
  }

  // 移除拖拽的元素
  private _removeDragElement() {
    if (!isUndef(this._dragElement)) {
      this._dragElement.parentElement?.removeChild(this._dragElement);
    }
  }

  // 鼠标移动事件处理,也就是拖拽事件
  private _onMousemove(data: { offsetX: number; offsetY: number }) {
    const result = this._checkData({
      width: data.offsetX,
      height: data.offsetY
    });
    // 判断一下宽高是否改变了
    if (this._isChange(result)) {
      // 记录当前的宽高
      this._prevPosition = result;
      // 设置父容器的宽高
      this._setParentStyle(result);
      this._playerInstance.$emit(ZoomEvents.ZOOM, result);
    }
  }

  // 添加类名到父容器中
  private _addClassNameToParent() {
    if (!this._parentElement.classList.contains(ClassNameEnum.ZOOMRELATIVE)) {
      this._parentElement.classList.add(ClassNameEnum.ZOOMRELATIVE);
    }
  }
  // 移除父容器类名
  private _removeClassNameToParent() {
    if (this._parentElement.classList.contains(ClassNameEnum.ZOOMRELATIVE)) {
      this._parentElement.classList.remove(ClassNameEnum.ZOOMRELATIVE);
    }
  }
  // 检查宽高是否越界，符合要求等
  private _checkData({ width, height }: ZoomData) {
    const { minHeight, minWidth, maxHeight, maxWidth, x, y } = this._options;
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
  private _createElement() {
    const { x, y } = this._options;
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
  private _setParentStyle(style?: { width: number; height: number }) {
    if (!isUndef(style)) {
      const { x, y } = this._options;
      updateStyle(this._parentElement, {
        // 开启横向拖拽才设置
        width: x ? `${style.width}px` : undefined,
        // 开始纵向拖拽才设置
        height: y ? `${style.height}px` : undefined
      });
    } else {
      // 宽高样式不存在就重置样式
      updateStyle(this._parentElement, {
        // 开启横向拖拽才设置
        width: "",
        // 开始纵向拖拽才设置
        height: ""
      });
    }
  }

  private _initListener() {
    this._playerInstance.$on(MediaPlayer.PlayerEvents.DESTROY, () => {
      this._removeClassNameToParent();
      this._setParentStyle();
      this._removeDragElement();
      this._dragInstance?.destroy();
    });
  }
}

export default Zoom;
