import { EventManager, isFunction, isUndef } from "@media/utils";
import { LISTACTIVECLASSNAME } from "../config/constant";
import { ComponentOptions, VideoListItem } from "../types";
import videoTpl from "../template/video.art";
import { t } from "../locale";
import { PlayerEvents, VideoEvents } from "../config/event";

class VideoPlayer {
  private options: ComponentOptions;
  // 当前正在播放的视频索引
  private currentIndex = -1;
  private eventManager: EventManager;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    // 设置索引，播放的是哪个视频
    this.setCurrentIndex(this.getDefaultIndex());
    // 初始化video标签视频
    this.initPlayer();
    // 初始化清晰度事件监听
    this.initDefinitionListener();
    // 遮罩层事件监听
    this.initMaskListener();
    this.initListener();
  }

  private get instance() {
    return this.options.instance;
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initPlayer() {
    // 获取video标签和播放的视频
    const videoElement = this.instance.videoElement;
    const videoItem = this.getVideoItem();
    // 初始化视频
    this.initESM(videoElement, videoItem);
  }

  private initESM(
    videoElement: HTMLVideoElement | null | undefined,
    videoItem: VideoListItem | null
  ) {
    if (!isUndef(videoElement) && videoItem) {
      // 自定义ems
      const { customType } = this.options;
      if (isFunction(customType)) {
        customType(videoElement, videoItem);
      } else {
        // 其他的直接赋值
        videoElement.src = videoItem.url;
      }
      this.initVideoEvents(videoElement);
    }
  }

  // 初始化video标签事件
  private initVideoEvents(videoElement?: HTMLVideoElement) {
    // 外部统一使用$on来进行监听，因为切换清晰度之后，video标签会被替换掉，所有事件需要重新监听
    for (const key in VideoEvents) {
      const eventName = (VideoEvents as any)[key];
      videoElement?.addEventListener(eventName, (event) => {
        this.instance.$emit(eventName, event);
      });
    }
  }

  private initListener() {
    this.instance.$on(PlayerEvents.DESTROY, () => this.destroy());
  }

  // 获取默认播放的视频，有default的就是默认得了
  private getDefaultIndex() {
    const videoList = this.options.videoList;
    if (videoList.length > 0) {
      const index = videoList.findIndex((video) => video.default);
      if (index > -1) {
        return index;
      }
      return 0;
    }
    return -1;
  }

  // 清晰度点击事件处理
  private initDefinitionListener() {
    const definitionWrapperElement =
      this.options.templateInstance.definitionWrapperElement;
    this.eventManager.addEventListener({
      element: definitionWrapperElement,
      eventName: "click",
      handler: this.onWrapperClick.bind(this)
    });
  }
  // 销毁播放器
  private destroyPlayer() {
    const videoElement = this.instance.videoElement;
    if (!isUndef(videoElement)) {
      videoElement.src = "";
    }
  }
  // 获取视频
  private getVideoItem() {
    const { videoList } = this.options;
    const { currentIndex } = this;
    if (videoList.length !== 0) {
      return videoList[currentIndex];
    }
    return null;
  }
  // 遮罩层事件处理
  private initMaskListener() {
    const videoMaskElement = this.options.templateInstance.videoMaskElement;
    this.eventManager.addEventListener({
      element: videoMaskElement,
      eventName: "click",
      handler: this.onVideoMaskClick.bind(this)
    });
  }

  private onVideoMaskClick() {
    // 点击遮罩层的时候切换播放状态
    this.instance.toggle();
  }
  // 清晰度切换事件处理
  private onWrapperClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    let index = target.dataset?.index ?? -1;
    index = Number(index);
    this.switchDefinition(index);
  }

  // 判断能否进行切换,因为可能越界
  private isCanSwitchQuality(index: number) {
    if (index < 0 || index > this.options.videoList.length - 1) {
      this.instance.setNotice(t("invalidDefinition"));
      return false;
    }
    return true;
  }

  switchDefinition(index: number) {
    if (index !== this.currentIndex && this.isCanSwitchQuality(index)) {
      // 设置当前视频索引
      this.setCurrentIndex(index);
      // 切换video标签
      this.switchVideo();
    }
  }

  private switchVideo() {
    // 先获取原来的video标签
    const { videoElement: prevVideoElement, containerElement } =
      this.options.templateInstance;
    const instance = this.instance;
    if (!isUndef(prevVideoElement)) {
      // 获取视频播放地址
      const videoItem = this.getVideoItem();
      // 清晰度切换前
      instance.$emit(PlayerEvents.SWITCH_DEFINITION_START, videoItem);
      // video原来的状态
      const prevStatus = {
        currentTime: prevVideoElement.currentTime,
        paused: prevVideoElement.paused,
        playbackRate: prevVideoElement.playbackRate,
        volume: prevVideoElement.volume
      };
      // 获取video的html
      const videoHtml = videoTpl({
        ...this.options
      });
      // 将字符串转化为dom
      const nextVideoElement = new DOMParser().parseFromString(
        videoHtml,
        "text/html"
      ).body.firstChild as HTMLVideoElement;
      // 旧的video标签暂停播放
      prevVideoElement.pause();
      // 新的video标签插入到旧的video标签前，也就是新的video标签在旧的video标签下方
      containerElement?.insertBefore(nextVideoElement, prevVideoElement);
      // 初始化新的video标签视频
      this.initESM(nextVideoElement, videoItem);
      // 设置新video标签的状态
      nextVideoElement.currentTime = prevStatus.currentTime;
      nextVideoElement.volume = prevStatus.volume;
      nextVideoElement.playbackRate = prevStatus.playbackRate;
      if (!prevStatus.paused) {
        nextVideoElement.play();
      }
      // 监听新的video标签的canplay事件
      instance.$once(VideoEvents.CANPLAY, () => {
        // 这个时候说明新的video标签已经准备好了，可以移除旧的video标签了，这样子就可以完美解决切换清晰度闪屏的问题了
        containerElement?.removeChild(prevVideoElement);
        // 清晰度切换完毕
        instance.$emit(PlayerEvents.SWITCH_DEFINITION_END, videoItem);
        // 设置通知
        this.instance.setNotice(t("switch", { quality: videoItem?.label }));
      });
    }
  }

  private setCurrentIndex(index: number) {
    if (index !== this.currentIndex && this.isCanSwitchQuality(index)) {
      this.currentIndex = index;
      // 设置当前活跃的清晰度标签样式
      this.handelDefinitionItemsElement((element, i) => {
        this.setElementActive(element, i === index);
      });
      // 设置标签文本
      this.setCurrentLabel();
    }
  }

  // 设置标签文本
  private setCurrentLabel() {
    const definitionLabelElement =
      this.options.templateInstance.definitionLabelElement;
    if (!isUndef(definitionLabelElement)) {
      const videoList = this.options.videoList;
      if (videoList.length > 0) {
        definitionLabelElement.innerHTML = videoList[this.currentIndex].label;
      }
    }
  }

  private setElementActive(element: Element, isActive: boolean) {
    if (isActive) {
      // 添加活跃状态的类名
      this.addElementActive(element);
    } else {
      // 移除活跃状态的类名
      this.delElementActive(element);
    }
  }

  private delElementActive(element: Element) {
    if (element.classList.contains(LISTACTIVECLASSNAME)) {
      element.classList.remove(LISTACTIVECLASSNAME);
    }
  }

  private addElementActive(element: Element) {
    if (!element.classList.contains(LISTACTIVECLASSNAME)) {
      element.classList.add(LISTACTIVECLASSNAME);
    }
  }

  // 这里对元素进行判断是否为空，然后执行回调函数
  private handelDefinitionItemsElement(
    callback: (element: Element, index: number) => void
  ) {
    if (isFunction(callback)) {
      const definitionItemsElement =
        this.options.templateInstance.definitionItemsElement;
      const length = definitionItemsElement?.length ?? 0;
      if (definitionItemsElement && length > 0) {
        for (let i = 0; i < definitionItemsElement.length; i++) {
          const element = definitionItemsElement[i];
          callback(element, i);
        }
      }
    }
  }

  private destroy() {
    this.eventManager.removeEventListener();
    this.destroyPlayer();
  }
}

export default VideoPlayer;
