import "./style/index.scss";
import { EventManager, isUndef, logError, PLUGINNAME } from "@lin-media/utils";
import { ScreenshotOptions } from "./types";
import { downloadBase64 } from "./js/utils";
import { downloadPicName, pluginName } from "./config/constant";
import MediaPlayer from "@lin-media/player";
import { ScreenshotEvents } from "./config/event";

const defaultOptions = {
  download: true
};

class Screenshot {
  // 自定义事件
  static customEvents = ScreenshotEvents;
  // 插件名称.
  static [PLUGINNAME] = pluginName;
  // 播放器的dom
  private _el: HTMLElement;
  // 播放器实例
  private _playerInstance: MediaPlayer;
  // dom元素
  private _element: HTMLElement | null;
  // 事件管理器
  private _eventManager = new EventManager();
  // 参数
  private _options: ScreenshotOptions;

  constructor(playerInstance: MediaPlayer, el: HTMLElement) {
    // 保存一下播放器给来的参数
    this._el = el;
    this._playerInstance = playerInstance;
    // 合并默认参数
    const _options = playerInstance.$options[pluginName] ?? {};
    this._options = { ...defaultOptions, ..._options };
    // 初始化
    this._handleInit();
    // 挂载方法给外部使用
    this._initMethods();
  }

  private _handleInit() {
    // 初始化dom
    this._initElement();
    // 销毁
    this._playerInstance.$on(
      MediaPlayer.PlayerEvents.DESTROY,
      this._destroy.bind(this)
    );
  }

  private _initMethods() {
    Object.defineProperty(this, "screenshot", {
      get: () => {
        return {
          snapshot: () => {
            this._onClick();
          }
        };
      }
    });
  }

  // 渲染小图标
  private _initElement() {
    const span = document.createElement("span");
    span.className =
      "screenshot-icon-screenshot player-icon-item screenshot-icon-item";
    const parentNode = this._el.querySelector(".player-controls-right");
    parentNode?.insertBefore(span, parentNode?.firstElementChild);
    this._element = span;
    // 监听事件
    this._initListener();
  }

  private _initListener() {
    this._eventManager?.addEventListener({
      element: this._element,
      eventName: "click",
      handler: this._onClick.bind(this)
    });
  }

  private _removeListener() {
    this._eventManager?.removeEventListener();
  }

  private _onClick() {
    const imageSrc = this._getVideoImage();
    // 广播事件
    this._playerInstance.$emit(ScreenshotEvents.SCREENSHOT, imageSrc);
    if (this._options.download && !isUndef(imageSrc)) {
      // 下载图片
      this._downloadImage(imageSrc);
    }
  }

  private _downloadImage(imageSrc: string) {
    downloadBase64(this._options.picName || downloadPicName, imageSrc);
  }

  private _getVideoImage() {
    const videoElement = this._el.querySelector(
      ".player-video"
    ) as HTMLVideoElement;
    try {
      // 截图视频
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      // 获取视频宽高
      const videoInfo = this._getVideoInfo(videoElement);
      canvas.width = videoInfo.width;
      canvas.height = videoInfo.height;
      ctx?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL() || null;
    } catch (error) {
      logError(error);
      return null;
    }
    return null;
  }

  // 获取视频宽高，视频的真实宽高不一定等于容器的宽高，需要通过公式计算出来
  private _getVideoInfo(videoElement: HTMLVideoElement) {
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

  private _destroy() {
    this._removeListener();
  }
}

export default Screenshot;
