import pointListTpl from "./template/preview-list";
import "./style/index.scss";
import {
  EventManager,
  isArray,
  isUndef,
  checkData,
  getBoundingClientRect,
  updateStyle,
  PLUGINNAME,
  MOBILEPLUGIN
} from "@lin-media/utils";
import { PreviewList, PreviewOptions } from "./types";
import MediaPlayer from "@lin-media/player";
import { PreviewEvents } from "./config/event";
import { barViewImageWidth, pluginName } from "./config/constant";

const defaultOptions = {
  barPreview: false
};

class Preview {
  // 自定义事件
  static customEvents = PreviewEvents;
  // 插件名称.
  static [PLUGINNAME] = pluginName;
  static [MOBILEPLUGIN] = false;
  // 播放器的dom
  private _el: HTMLElement;
  // 播放器实例
  private _playerInstance: MediaPlayer;
  // 是否正在加载标志位
  private _load = true;
  // 预览点的dom元素
  private _element: HTMLElement | null;
  // 事件管理器
  private _eventManager = new EventManager();
  // 参数
  private _options: PreviewOptions;
  // 进度条预览图片元素
  private _barViewElement: HTMLElement | null;
  // 进度条容器
  private _progressElement: HTMLElement | null;

  constructor(playerInstance: MediaPlayer, el: HTMLElement) {
    // 保存一下播放器给来的参数
    this._el = el;
    this._playerInstance = playerInstance;
    // 参数
    const options = playerInstance.$options[pluginName] ?? {};
    this._options = { ...defaultOptions, ...options };
    // 开始初始化
    this._initList();
    this._initInstanceListener();
    // 挂载方法给外部使用
    this._initMethods();
  }

  private get duration() {
    return this._playerInstance.duration || 0;
  }

  private _initMethods() {
    Object.defineProperty(this._playerInstance, "preview", {
      get: () => {
        return {
          // 设置预览点列表
          setPreview: (list: PreviewList) => {
            this._setPreview(list);
          },
          // 销毁预览点列表
          destroyPreview: () => {
            this._destroyPreview();
          },
          // 设置进度条预览
          setBarView: (barPreviewUrl: string) => {
            this._setBarView(barPreviewUrl);
          },
          // 销毁进度条预览
          destroyBarView: () => {
            this._destroyBarView();
          }
        };
      }
    });
  }

  private _initInstanceListener() {
    // 销毁
    this._playerInstance.$on(MediaPlayer.PlayerEvents.DESTROY, () => {
      this._destroyPreview();
      this._destroyBarView();
    });
  }
  // 初始化
  private _initList() {
    // 预览点需要获取总时长，计算出预览点的位置
    if (this.duration && this.duration > 0) {
      // 总时长存在并且大于0，说明视频已经加载好了
      this._load = true;
      this._initElement();
      this._initBarView();
    } else {
      // 获取不到总时长说明视频没有加载完成，需要等待加载完成在执行下一步操作
      this._playerInstance.$once(MediaPlayer.VideoEvents.LOADEDMETADATA, () => {
        this._load = true;
        this._initElement();
        this._initBarView();
      });
    }
  }

  private _initElement() {
    const previewList = this._options.list;
    if (!this._load || !isArray(previewList) || previewList.length === 0) {
      // 视频没加载完成或者预览点列表为空不做任何操作
      return;
    }
    // 为防止重复设置,每次设置需要销毁上一次的
    this._removePreviewElementAndListener();
    // 找到进度条的dom元素
    const progressBar = this._el.querySelector(".player-process-mask");
    // 开始渲染预览点列表
    const div = document.createElement("div");
    div.innerHTML = pointListTpl({
      previewList,
      duration: this.duration
    });
    // 保存渲染出来的预览点元素
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
    const imageListElement = this._element?.querySelectorAll(".preview-image");
    const { left, right } = getBoundingClientRect(this._el);
    if (!isUndef(imageListElement)) {
      this._adjustLeft(imageListElement, left);
      this._adjustRight(imageListElement, right);
    }
  }

  // 调整左边的距离
  private _adjustLeft(imageListElement: NodeListOf<Element>, left: number) {
    const length = imageListElement.length;
    for (let i = 0; i < length; i++) {
      const element = imageListElement[i] as HTMLElement;
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
  private _adjustRight(imageListElement: NodeListOf<Element>, right: number) {
    const length = imageListElement.length;
    for (let i = length - 1; i >= 0; i--) {
      const element = imageListElement[i] as HTMLElement;
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
    const target = event.target as HTMLElement;
    const dataset = target.dataset;
    if (dataset && dataset.index) {
      // 点击的是预览点
      const previewList = this._options.list as PreviewList;
      const item = previewList[dataset.index as any];
      // 发射自定义事件
      this._playerInstance.$emit(PreviewEvents.PREVIEWCLICK, item);
    }
  }

  // 初始化进度条的图片预览
  private _initBarView() {
    const barPreviewUrl = this._options.barPreviewUrl;
    if (!isUndef(barPreviewUrl)) {
      // 创建一个div出来，图片使用背景图
      const div = this._createBarViewWrapper();
      // 找到进度条容器
      this._progressElement = this._el.querySelector(
        ".player-process-content"
      ) as HTMLElement;
      // 插入到容器中
      this._progressElement?.appendChild(div);
      this._barViewElement = div;
      // 监听移动事件
      this._eventManager?.addEventListener({
        element: this._progressElement,
        eventName: "mousemove",
        handler: this.onMousemove.bind(this)
      });
    }
  }

  // 创建一个进度条预览的div出来
  private _createBarViewWrapper() {
    const videoElement = this._playerInstance.videoElement;
    const height =
      (videoElement!.videoHeight / videoElement!.videoWidth) *
      barViewImageWidth;
    const div = document.createElement("div");
    div.className = "preview-bar-image";
    updateStyle(div, {
      backgroundImage: `url("${this._options.barPreviewUrl}")`,
      width: `${barViewImageWidth}px`,
      height: `${height}px`
    });
    return div;
  }

  // 鼠标移动事件
  private onMousemove(event: MouseEvent) {
    if (!isUndef(this._barViewElement) && !isUndef(this._progressElement)) {
      const progressInfo = getBoundingClientRect(this._progressElement);
      const containerInfo = getBoundingClientRect(this._el);
      // 鼠标距离左边最小的距离
      const minLeft = barViewImageWidth / 2;
      // 鼠标距离最左边的最大距离
      const maxLeft = progressInfo.right - containerInfo.left - minLeft;
      // 鼠标距离容器左边的距离
      const left = event.pageX - progressInfo.left;
      // 找到第几张背景图
      const indexPic = Math.floor(
        (checkData(left, 0, progressInfo.width) / progressInfo.width) *
          this.duration
      );
      updateStyle(this._barViewElement, {
        // 设置图片的位置
        left: `${checkData(left, minLeft, maxLeft) - minLeft}px`,
        // 改变背景图的位置
        backgroundPosition: `-${indexPic * barViewImageWidth}px 0`
      });
    }
  }

  private _removeBarViewElementAndListener() {
    this._eventManager?.removeElementEventListener(this._progressElement);
    if (this._barViewElement) {
      this._barViewElement.parentNode?.removeChild(this._barViewElement);
      this._barViewElement = null;
    }
  }

  private _removePreviewElementAndListener() {
    this._eventManager?.removeElementEventListener(this._element);
    if (this._element) {
      this._element.parentNode?.removeChild(this._element);
      this._element = null;
    }
  }

  // 设置进度条预览
  private _setBarView(barPreviewUrl: string) {
    this._options.barPreviewUrl = barPreviewUrl;
    this._initBarView();
  }

  // 销毁进度条预览
  private _destroyBarView() {
    this._options.barPreviewUrl = undefined;
    this._removeBarViewElementAndListener();
  }

  // 设置预览点列表
  private _setPreview(list: PreviewList) {
    this._options.list = list;
    this._initElement();
  }

  // 销毁预览点列表
  private _destroyPreview() {
    this._options.list = [];
    this._removePreviewElementAndListener();
  }
}

export default Preview;
