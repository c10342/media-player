import { EventManager, isFunction, isUndef } from "@media/utils";
import { LISTACTIVECLASSNAME } from "../config/constant";
import { CustomEvents } from "../js/event";
import { ComponentOptions, VideoListItem } from "../types";
import { VideoEvents } from "../js/event";
import videoTpl from "../template/video.art";

class VideoPlayer {
  private options: ComponentOptions;
  private currentIndex = 0;
  private eventManager: EventManager;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    this.initCurrentIndex();
    this.setCurrentInfo(this.currentIndex);
    this.initPlayer();
    this.initVideoEvents();
    this.initDefinitionListener();
    this.initMaskListener();
    this.initListener();
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private get paused() {
    const videoElement = this.options.templateInstance.videoElement;
    return videoElement?.paused;
  }

  private initPlayer() {
    const { videoElement } = this.options.templateInstance;
    const videoItem = this.getVideoItem();
    this.initESM(videoElement, videoItem);
  }

  private initESM(
    videoElement: HTMLVideoElement | null,
    videoItem: VideoListItem | null
  ) {
    if (!isUndef(videoElement) && videoItem) {
      const { customType } = this.options;
      if (isFunction(customType)) {
        customType(videoElement, videoItem);
      } else {
        videoElement.src = videoItem.url;
      }
      this.initVideoEvents(videoElement);
    }
  }

  private initVideoEvents(videoElement?: HTMLVideoElement) {
    for (const key in VideoEvents) {
      const eventName = (VideoEvents as any)[key];
      videoElement?.addEventListener(eventName, (event) => {
        this.options.instance.$emit(eventName, event);
      });
    }
  }

  private initListener() {
    const instance = this.options.instance;
    instance.$on(CustomEvents.DESTROY, () => this.destroy());
  }

  private initCurrentIndex() {
    const videoList = this.options.videoList;
    if (videoList.length > 0) {
      const index = videoList.findIndex((video) => video.default);
      if (index > -1) {
        this.currentIndex = index;
      }
    }
  }

  private initDefinitionListener() {
    const definitionWrapperElement =
      this.options.templateInstance.definitionWrapperElement;
    this.eventManager.addEventListener({
      element: definitionWrapperElement,
      eventName: "click",
      handler: this.onWrapperClick.bind(this)
    });
  }

  private destroyPlayer() {
    const videoElement = this.options.templateInstance.videoElement;
    if (!isUndef(videoElement)) {
      videoElement.src = "";
    }
  }

  private getVideoItem() {
    const { videoList } = this.options;
    const { currentIndex } = this;
    if (videoList.length !== 0) {
      return videoList[currentIndex];
    }
    return null;
  }

  private initMaskListener() {
    const videoMaskElement = this.options.templateInstance.videoMaskElement;
    this.eventManager.addEventListener({
      element: videoMaskElement,
      eventName: "click",
      handler: this.onVideoMaskClick.bind(this)
    });
  }

  private onVideoMaskClick() {
    this.togglePlay();
  }

  private onWrapperClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    let index = target.dataset?.index ?? -1;
    index = Number(index);
    if (index !== -1 && index !== this.currentIndex) {
      this.setCurrentInfo(index);
      this.switchDefinition();
    }
  }

  private switchDefinition() {
    const { videoElement: prevVideoElement, containerElement } =
      this.options.templateInstance;
    const instance = this.options.instance;
    if (!isUndef(prevVideoElement)) {
      const videoItem = this.getVideoItem();
      instance.$emit(CustomEvents.SWITCH_DEFINITION_START, videoItem);
      const prevStatus = {
        currentTime: prevVideoElement.currentTime,
        paused: prevVideoElement.paused,
        playbackRate: prevVideoElement.playbackRate,
        volume: prevVideoElement.volume
      };
      const videoHtml = videoTpl({
        ...this.options
      });
      const nextVideoElement = new DOMParser().parseFromString(
        videoHtml,
        "text/html"
      ).body.firstChild as HTMLVideoElement;
      prevVideoElement.pause();
      containerElement?.insertBefore(nextVideoElement, prevVideoElement);
      this.initESM(nextVideoElement, videoItem);
      nextVideoElement.currentTime = prevStatus.currentTime;
      nextVideoElement.volume = prevStatus.volume;
      nextVideoElement.playbackRate = prevStatus.playbackRate;
      if (!prevStatus.paused) {
        nextVideoElement.play();
      }
      this.options.instance.$once(VideoEvents.CANPLAY, () => {
        containerElement?.removeChild(prevVideoElement);
        instance.$emit(CustomEvents.SWITCH_DEFINITION_END, videoItem);
      });
    }
  }

  private togglePlay() {
    if (this.paused) {
      this.playVideo();
    } else {
      this.pauseVideo();
    }
  }

  private pauseVideo() {
    const videoElement = this.options.templateInstance.videoElement;
    videoElement?.pause();
  }

  private playVideo() {
    const videoElement = this.options.templateInstance.videoElement;
    videoElement?.play();
  }

  private setCurrentInfo(index: number) {
    this.setCurrentIndex(index);
    this.setCurrentLabel();
  }

  private setCurrentIndex(index: number) {
    this.currentIndex = index;
    this.handelDefinitionItemsElement((element, i) => {
      this.setElementActive(element, i === index);
    });
  }

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
      this.addElementActive(element);
    } else {
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

  destroy() {
    this.eventManager.removeEventListener();
    this.destroyPlayer();
  }
}

export default VideoPlayer;
