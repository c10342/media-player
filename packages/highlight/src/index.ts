import pointListTpl from "./template/point-list";
import "./style/index.scss";
import {
  EventManager,
  getBoundingClientRect,
  isArray,
  PLUGINNAME,
  updateStyle
} from "@lin-media/utils";
import { HighlightList, HighlightOptions } from "./types";
import MediaPlayer from "@lin-media/player";
import { HighlightEvents } from "./config/event";
import { pluginName } from "./config/constant";

const defaultOptions = {
  jump: true,
  showTip: true
};

class Highlight {
  // 自定义事件
  static customEvents = HighlightEvents;
  // 插件名称.
  static [PLUGINNAME] = pluginName;
  // 播放器的dom
  private _el: HTMLElement;
  // 播放器实例
  private _playerInstance: MediaPlayer;
  // 是否正在加载标志位
  private _load = true;
  // 提示点的dom元素
  private _element: HTMLElement | null;
  // 事件管理器
  private _eventManager = new EventManager();
  // 提示点参数
  private _options: HighlightOptions;

  constructor(playerInstance: MediaPlayer, el: HTMLElement) {
    // 保存一下播放器给来的参数
    this._el = el;
    this._playerInstance = playerInstance;
    // 合并默认参数
    const options = playerInstance.$options[pluginName] ?? {};
    this._options = { ...defaultOptions, ...options };
    // 开始初始化
    this._init();
    this._initInstanceListener();
    // 挂载方法给外部用
    this._initMethods();
  }

  private _initMethods() {
    Object.defineProperty(this._playerInstance, "highlight", {
      get: () => {
        return {
          set: (list: HighlightList) => {
            this._setHighlight(list);
          },
          destroy: () => {
            this._destroyHighlight();
          }
        };
      }
    });
  }

  private get duration() {
    return this._playerInstance.duration;
  }

  private _initInstanceListener() {
    // 销毁
    this._playerInstance.$on(
      MediaPlayer.PlayerEvents.DESTROY,
      this._destroyHighlight.bind(this)
    );
  }

  // 初始化
  private _init() {
    // 提示点需要获取总时长，计算出提示点的位置
    if (this.duration && this.duration > 0) {
      // 总时长存在并且大于0，说明视频已经加载好了
      this._load = true;
      this._initElement();
    } else {
      // 获取不到总时长说明视频没有加载完成，需要等待加载完成在执行下一步操作
      this._playerInstance.$once(MediaPlayer.VideoEvents.LOADEDMETADATA, () => {
        this._load = true;
        this._initElement();
      });
    }
  }

  private _initElement() {
    const highlightList = this._options.list;
    if (!this._load || !isArray(highlightList) || highlightList.length === 0) {
      // 视频没加载完成或者提示点列表为空不做任何操作
      return;
    }
    // 为防止重复设置,每次设置需要销毁上一次的
    this._removeElementAndListener();
    // 找到进度条的dom元素
    const progressBar = this._el.querySelector(".player-process-content");
    // 开始渲染提示点列表
    const div = document.createElement("div");
    div.innerHTML = pointListTpl({
      highlightList,
      duration: this.duration
    });
    // 保存渲染出来的提示点元素
    this._element = div;
    // 插入到进度条中
    progressBar?.appendChild(div);
    // 事件监听
    this._initListener();
    // 调整位置，有些在最右边或者最左边的可能会被隐藏掉
    this._adjustPosition();
  }
  // 调整位置
  private _adjustPosition() {
    const pointListElement = this._element!.querySelectorAll(
      ".highlight-point-tip"
    );
    const { left, right } = getBoundingClientRect(this._el);
    this._adjustLeft(pointListElement, left);
    this._adjustRight(pointListElement, right);
  }

  // 调整左边的距离
  private _adjustLeft(pointListElement: NodeListOf<Element>, left: number) {
    const length = pointListElement.length;
    for (let i = 0; i < length; i++) {
      const element = pointListElement[i] as HTMLElement;
      const clientRect = getBoundingClientRect(element);
      if (left > clientRect.left) {
        // 容器距离页面左边的距离大于元素距离页面左边的距离，说明元素被遮挡住了，需要调整一下
        const parentLeft =
          getBoundingClientRect(element.parentElement).left ?? 0;
        const offsetLeft = parentLeft - left;
        updateStyle(element, {
          left: `${-offsetLeft}px`,
          transform: "translate(0,-100%)"
        });
      } else {
        // 找到一个不被遮挡的元素就不用遍历后面的了
        break;
      }
    }
  }

  // 调整右边距离
  private _adjustRight(pointListElement: NodeListOf<Element>, right: number) {
    const length = pointListElement.length;
    for (let i = length - 1; i >= 0; i--) {
      const element = pointListElement[i] as HTMLElement;
      const clientRect = getBoundingClientRect(element);
      if (right < clientRect.right) {
        const parentRight =
          getBoundingClientRect(element.parentElement).right ?? 0;
        const offsetRight = right - parentRight;
        updateStyle(element, {
          left: `${offsetRight}px`,
          transform: "translate(-100%,-100%)"
        });
      } else {
        // 找到一个不被遮挡的元素就不用遍历前面的了
        break;
      }
    }
  }

  private _initListener() {
    // 事件委托，不要去监听单个元素的
    this._eventManager?.addEventListener({
      element: this._element,
      eventName: "click",
      handler: this._onClick.bind(this)
    });
  }

  private _onClick(event: MouseEvent) {
    const { jump, showTip } = this._options;
    const target = event.target as HTMLElement;
    const dataset = target.dataset;

    if (dataset && dataset.index) {
      // 点击的是提示点
      const highlightList = this._options.list as HighlightList;
      const item = highlightList[dataset.index as any];

      if (jump) {
        // 跳转
        this._playerInstance.seek(item.time);
      }
      if (showTip) {
        // 显示提示
        this._playerInstance.setNotice(item.text);
      }
      // 发射自定义事件
      this._playerInstance.$emit(HighlightEvents.HIGHLIGHTCLICK, item);
    }
  }

  private _removeElementAndListener() {
    this._eventManager?.removeEventListener();
    this._element?.remove();
    (this._element as any) = null;
  }

  // 设置提示点列表
  private _setHighlight(list: HighlightList) {
    this._options.list = list;
    this._initElement();
  }

  // 销毁提示点列表
  private _destroyHighlight() {
    this._options.list = [];
    this._removeElementAndListener();
  }
}

export default Highlight;
