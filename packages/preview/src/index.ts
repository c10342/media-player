import pointListTpl from "./template/preview-list";
import "./style/index.scss";
import {
  isArray,
  isUndef,
  checkData,
  getBoundingClientRect,
  updateStyle
} from "@lin-media/utils";
import { PreviewList, PreviewOptions } from "./types";
import Player from "@lin-media/player";
import { PreviewEvents } from "./config/event";
import { barViewImageWidth } from "./config/constant";

const defaultOptions = {
  barPreview: false
};

const Component = Player.getComponent<PreviewOptions>("Component");

class Preview extends Component {
  // 自定义事件
  static customEvents = PreviewEvents;
  // 是否正在加载标志位
  private load = true;
  // 预览点的dom元素
  private element: HTMLElement | null;
  // 进度条预览图片元素
  private barViewElement: HTMLElement | null;
  // 进度条容器
  private progressElement: HTMLElement | null;

  constructor(
    player: Player,
    slotElement: HTMLElement,
    options: PreviewOptions = {}
  ) {
    super(player, slotElement, { ...defaultOptions, ...options });
    // 开始初始化
    this.initList();
    // 挂载方法给外部使用
    this.initMethods();
    this.triggerReady();
  }

  private get duration() {
    return this.player.duration || 0;
  }

  private initMethods() {
    Object.defineProperty(this.player, "preview", {
      get: () => {
        return {
          // 设置预览点列表
          setPreview: (list: PreviewList) => {
            this.setPreview(list);
          },
          // 销毁预览点列表
          destroyPreview: () => {
            this.destroyPreview();
          },
          // 设置进度条预览
          setBarView: (barPreviewUrl: string) => {
            this.setBarView(barPreviewUrl);
          },
          // 销毁进度条预览
          destroyBarView: () => {
            this.destroyBarView();
          }
        };
      }
    });
  }

  // 初始化
  private initList() {
    // 预览点需要获取总时长，计算出预览点的位置
    if (this.duration && this.duration > 0) {
      // 总时长存在并且大于0，说明视频已经加载好了
      this.load = true;
      this.initElement();
      this.initBarView();
    } else {
      // 获取不到总时长说明视频没有加载完成，需要等待加载完成在执行下一步操作
      this.player.$once(Player.Events.LOADEDMETADATA, () => {
        this.load = true;
        this.initElement();
        this.initBarView();
      });
    }
  }

  private initElement() {
    const previewList = this.options.list;
    if (!this.load || !isArray(previewList) || previewList.length === 0) {
      // 视频没加载完成或者预览点列表为空不做任何操作
      return;
    }
    // 为防止重复设置,每次设置需要销毁上一次的
    this.removePreviewElementAndListener();
    // 找到进度条的dom元素
    const progressBar = this.slotElement.querySelector(".player-process-mask");
    // 开始渲染预览点列表
    const div = document.createElement("div");
    div.innerHTML = pointListTpl({
      // fix:过滤掉那些超出总时长的时间点
      previewList: previewList.filter((item) => item.time <= this.duration),
      duration: this.duration
    });
    // 保存渲染出来的预览点元素
    this.element = div;
    // 插入到进度条中
    progressBar?.appendChild(div);
    // 事件监听
    this.initListener();
    // 调整位置，有些在最右边或者最左边的可能会被隐藏掉
    this.adjustPosition();
  }
  // 调整位置
  private adjustPosition() {
    const imageListElement = this.element?.querySelectorAll(".preview-image");
    const { left, right } = getBoundingClientRect(this.slotElement);
    if (!isUndef(imageListElement)) {
      this.adjustLeft(imageListElement, left);
      this.adjustRight(imageListElement, right);
    }
  }

  // 调整左边的距离
  private adjustLeft(imageListElement: NodeListOf<Element>, left: number) {
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
  private adjustRight(imageListElement: NodeListOf<Element>, right: number) {
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

  private initListener() {
    // 事件委托，不要去监听单个元素的
    this.eventManager?.addEventListener({
      element: this.element,
      eventName: "click",
      handler: this._onClick.bind(this)
    });
  }

  private _onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dataset = target.dataset;
    if (dataset && dataset.index) {
      // 点击的是预览点
      const previewList = this.options.list as PreviewList;
      const item = previewList[dataset.index as any];
      // 发射自定义事件
      this.player.$emit(PreviewEvents.PREVIEWCLICK, item);
    }
  }

  // 初始化进度条的图片预览
  private initBarView() {
    const barPreviewUrl = this.options.barPreviewUrl;
    if (!isUndef(barPreviewUrl)) {
      // 创建一个div出来，图片使用背景图
      const div = this.createBarViewWrapper();
      if (!div) {
        return;
      }
      // 找到进度条容器
      this.progressElement = this.slotElement.querySelector(
        ".player-process-content"
      ) as HTMLElement;
      // 插入到容器中
      this.progressElement?.appendChild(div);
      this.barViewElement = div;
      // 监听移动事件
      this.eventManager?.addEventListener({
        element: this.progressElement,
        eventName: "mousemove",
        handler: this.onMousemove.bind(this)
      });
    }
  }

  // 创建一个进度条预览的div出来
  private createBarViewWrapper() {
    const videoElement = this.player.videoElement;
    if (!videoElement) {
      return;
    }
    const height =
      (videoElement!.videoHeight / videoElement!.videoWidth) *
      barViewImageWidth;
    const div = document.createElement("div");
    div.className = "preview-bar-image";
    updateStyle(div, {
      backgroundImage: `url("${this.options.barPreviewUrl}")`,
      width: `${barViewImageWidth}px`,
      height: `${height}px`
    });
    return div;
  }

  // 鼠标移动事件
  private onMousemove(event: MouseEvent) {
    if (!isUndef(this.barViewElement) && !isUndef(this.progressElement)) {
      const progressInfo = getBoundingClientRect(this.progressElement);
      const containerInfo = getBoundingClientRect(this.slotElement);
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
      updateStyle(this.barViewElement, {
        // 设置图片的位置
        left: `${checkData(left, minLeft, maxLeft) - minLeft}px`,
        // 改变背景图的位置
        backgroundPosition: `-${indexPic * barViewImageWidth}px 0`
      });
    }
  }

  private removeBarViewElementAndListener() {
    this.eventManager?.removeElementEventListener(this.progressElement);
    if (this.barViewElement) {
      this.barViewElement.parentNode?.removeChild(this.barViewElement);
      this.barViewElement = null;
    }
  }

  private removePreviewElementAndListener() {
    this.eventManager?.removeElementEventListener(this.element);
    if (this.element) {
      this.element.parentNode?.removeChild(this.element);
      this.element = null;
    }
  }

  // 设置进度条预览
  private setBarView(barPreviewUrl: string) {
    this.options.barPreviewUrl = barPreviewUrl;
    this.initBarView();
  }

  // 销毁进度条预览
  private destroyBarView() {
    this.options.barPreviewUrl = undefined;
    this.removeBarViewElementAndListener();
  }

  // 设置预览点列表
  private setPreview(list: PreviewList) {
    this.options.list = list;
    this.initElement();
  }

  // 销毁预览点列表
  private destroyPreview() {
    this.options.list = [];
    this.removePreviewElementAndListener();
  }
  destroy() {
    this.destroyPreview();
    this.destroyBarView();
    super.destroy();
  }
}

export default Preview;
