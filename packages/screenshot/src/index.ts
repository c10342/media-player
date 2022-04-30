import "./style/index.scss";
import { isUndef, logError } from "@lin-media/utils";
import { ScreenshotOptions } from "./types";
import { downloadBase64 } from "./js/utils";
import { downloadPicName } from "./config/constant";
import Player from "@lin-media/player";
import { Events } from "./config/event";

const defaultOptions = {
  download: true
};

const Component = Player.getComponent<ScreenshotOptions>("Component");

class Screenshot extends Component {
  // 自定义事件
  static customEvents = Events;

  // dom元素
  private element: HTMLElement | null;

  constructor(
    player: Player,
    slotElement: HTMLElement,
    options: ScreenshotOptions
  ) {
    super(player, slotElement, { ...defaultOptions, ...options });

    // 初始化
    this.handleInit();
    // 挂载方法给外部使用
    this.initPlayerMethods();
    this.triggerReady();
  }

  private handleInit() {
    // 初始化dom
    this.initElement();
  }

  private initPlayerMethods() {
    Object.defineProperty(this, "screenshot", {
      get: () => {
        return {
          snapshot: () => {
            this.onClick();
          }
        };
      }
    });
  }

  // 渲染小图标
  private initElement() {
    const span = document.createElement("span");
    span.className =
      "screenshot-icon-screenshot player-icon-item screenshot-icon-item";
    const parentNode = this.slotElement.querySelector(".player-controls-right");
    parentNode?.insertBefore(span, parentNode?.firstElementChild);
    this.element = span;
    // 监听事件
    this.initListener();
  }

  private initListener() {
    this.eventManager?.addEventListener({
      element: this.element,
      eventName: "click",
      handler: this.onClick.bind(this)
    });
  }

  private removeListener() {
    this.eventManager?.removeEventListener();
  }

  private onClick() {
    const imageSrc = this.getVideoImage();
    // 广播事件
    this.player.$emit(Events.SCREENSHOT, imageSrc);
    if (this.options.download && !isUndef(imageSrc)) {
      // 下载图片
      this.downloadImage(imageSrc);
    }
  }

  private downloadImage(imageSrc: string) {
    downloadBase64(this.options.picName || downloadPicName, imageSrc);
  }

  private getVideoImage() {
    const videoElement = this.player.rootElement.querySelector(
      ".player-video"
    ) as HTMLVideoElement;
    try {
      // 截图视频
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      // 获取视频宽高
      const videoInfo = this.getVideoInfo(videoElement);
      canvas.width = videoInfo.width;
      canvas.height = videoInfo.height;
      ctx?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL() || null;
    } catch (error) {
      logError(error);
      return null;
    }
  }

  // 获取视频宽高，视频的真实宽高不一定等于容器的宽高，需要通过公式计算出来
  private getVideoInfo(videoElement: HTMLVideoElement) {
    const videoRatio = videoElement.videoWidth / videoElement.videoHeight;
    let width = videoElement.offsetWidth;
    let height = videoElement.offsetHeight;
    const elementRatio = width / height;
    if (elementRatio > videoRatio) width = height * videoRatio;
    else height = width / videoRatio;
    return {
      width: width,
      height: height
    };
  }

  destroy() {
    this.removeListener();
    super.destroy();
  }
}

export default Screenshot;
