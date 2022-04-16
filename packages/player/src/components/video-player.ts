import {
  checkData,
  EventManager,
  isUndef,
  parseHtmlToDom
} from "@lin-media/utils";
import { PlayerEvents, VideoEvents } from "../config/event";
import { forEachTech } from "../global-api/tech";
import Player from "../player";
import VideoTpl from "../templates/video";
import VideoTagTpl from "../templates/video-tag";
import { ComponentApi } from "../types/component";
import { SourceItem } from "../types/player";
import { definePlayerMethods } from "../utils/helper";

class VideoPlayer implements ComponentApi {
  // 播放器实例
  private player: Player;
  // dom事件管理器
  private eventManager = new EventManager();
  // 当前正在播放的视频索引
  private currentIndex = -1;
  // 组件根元素
  private rootElement: HTMLElement;

  videoElement: HTMLVideoElement;

  constructor(player: Player, slotElement: HTMLElement) {
    // 播放器实例
    this.player = player;
    // 初始化dom
    this.initDom(slotElement);
    // 设置索引，播放的是哪个视频
    this.setCurrentIndex(this.getDefaultIndex());
    // 初始化video标签视频
    this.initPlayer();
    // 添加事件
    this.initPlayerMethods();
  }
  // 查询元素
  private _querySelector<T extends HTMLVideoElement>(selector: string) {
    return this.rootElement.querySelector(selector) as T;
  }
  // 初始化dom
  private initDom(slotElement: HTMLElement) {
    const { options } = this.player;
    const html = VideoTpl(options as any);
    this.rootElement = parseHtmlToDom(html);

    // 将html插入到插槽中
    slotElement.appendChild(this.rootElement);
    this.videoElement = this._querySelector(".player-video");
  }

  // 获取默认播放的视频，有default的就是默认得了
  private getDefaultIndex() {
    const source = this.player.options.source;

    if (source.length > 0) {
      const index = source.findIndex((video) => video.default);
      if (index > -1) {
        return index;
      }
      return 0;
    }
    return -1;
  }

  // 获取视频
  private getVideoItem() {
    const { source } = this.player.options;
    const { currentIndex } = this;

    if (source.length !== 0) {
      return source[currentIndex];
    }
    return null;
  }
  // 初始化video标签
  private initPlayer() {
    const videoItem = this.getVideoItem();
    // 初始化视频
    this.initESM(this.videoElement, videoItem);
  }

  private initESM(
    videoElement: HTMLVideoElement,
    videoItem: SourceItem | null
  ) {
    if (!isUndef(videoItem)) {
      forEachTech((name, tech) => {
        if (tech.canHandleSource(videoItem, this.player.options)) {
          this.player.tech = new tech(this.player, videoElement, videoItem);
          this.player.$emit(PlayerEvents.TECHCHANGED, this.player.tech);
          return true;
        }
        return false;
      });
      this.initVideoEvents(videoElement);
    }
  }

  // 初始化video标签事件
  private initVideoEvents(videoElement: HTMLVideoElement) {
    // 外部统一使用$on来进行监听，因为切换清晰度之后，video标签会被替换掉，所有事件需要重新监听
    for (const key in VideoEvents) {
      const eventName = (VideoEvents as any)[key];
      this.eventManager.addEventListener({
        element: videoElement,
        eventName,
        handler: (event) => {
          this.player.$emit(eventName, event);
        }
      });
    }
  }

  private initPlayerMethods() {
    const methods: any = {
      play: this.play.bind(this),
      pause: this.pause.bind(this),
      toggle: this.toggle.bind(this),
      seek: this.seek.bind(this),
      setVolume: this.setVolume.bind(this),
      switchDefinition: this.switchDefinition.bind(this),
      setSpeed: this.setSpeed.bind(this),
      requestPictureInPicture: this.requestPictureInPicture.bind(this),
      exitPictureInPicture: this.exitPictureInPicture.bind(this)
    };
    definePlayerMethods(this.player, methods);

    const keys = ["currentTime", "volume", "paused", "duration"];

    keys.forEach((key) => {
      Object.defineProperty(this.player, key, {
        get: () => {
          return this.videoElement[key as keyof HTMLVideoElement];
        }
      });
    });
  }

  // 判断能否进行切换,因为可能越界
  private isCanSwitchQuality(index: number) {
    const player = this.player;
    if (index < 0 || index > player.options.source.length - 1) {
      player.setNotice(player.i18n.t("invalidDefinition"));
      return false;
    }
    return true;
  }

  private setCurrentIndex(index: number) {
    if (index !== this.currentIndex && this.isCanSwitchQuality(index)) {
      this.currentIndex = index;
    }
  }

  private switchVideo() {
    const player = this.player;
    // 先获取原来的video标签
    const prevVideoElement = this.videoElement;
    // 获取视频播放地址
    const videoItem = this.getVideoItem();
    // 清晰度切换前
    this.player.$emit(PlayerEvents.SWITCH_DEFINITION_START, {
      ...videoItem,
      index: this.currentIndex
    });
    // video原来的状态
    const prevStatus = {
      currentTime: prevVideoElement.currentTime,
      paused: prevVideoElement.paused,
      playbackRate: prevVideoElement.playbackRate,
      volume: prevVideoElement.volume
    };
    // 获取video的html
    const videoHtml = VideoTagTpl({
      ...player.options
    } as any);
    // 将字符串转化为dom
    const nextVideoElement = parseHtmlToDom(videoHtml) as HTMLVideoElement;
    // 旧的video标签暂停播放
    prevVideoElement.pause();
    // 新的video标签插入到旧的video标签前，也就是新的video标签在旧的video标签下方
    this.rootElement.insertBefore(nextVideoElement, prevVideoElement);
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
    this.player.$once(VideoEvents.CANPLAY, () => {
      // 这个时候说明新的video标签已经准备好了，可以移除旧的video标签了，这样子就可以完美解决切换清晰度闪屏的问题了
      this.rootElement.removeChild(prevVideoElement);
      // 清晰度切换完毕
      this.player.$emit(PlayerEvents.SWITCH_DEFINITION_END, {
        ...videoItem,
        index: this.currentIndex
      });
      // 切换完记得更新video标签
      this.videoElement = nextVideoElement;
      // 设置通知
      player.setNotice(player.i18n.t("switch", { quality: videoItem?.label }));
    });
  }

  // 播放
  private play() {
    this.videoElement.play();
  }
  // 暂停
  private pause() {
    this.videoElement.pause();
  }
  // 切换播放/暂停状态
  private toggle() {
    if (this.videoElement.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  private seek(time: number) {
    this.videoElement.currentTime = time;
  }

  private setSpeed(playbackRate: number) {
    playbackRate = checkData(playbackRate, 0, 2);
    this.videoElement.playbackRate = playbackRate;
  }

  private setVolume(volume: number) {
    volume = checkData(volume, 0, 1);
    this.videoElement.volume = volume;
  }

  private switchDefinition(index: number) {
    if (index !== this.currentIndex && this.isCanSwitchQuality(index)) {
      // 设置当前视频索引
      this.setCurrentIndex(index);
      // 切换video标签
      this.switchVideo();
    }
  }

  private requestPictureInPicture() {
    this.videoElement
      .requestPictureInPicture()
      .then((pictureInPictureWindow) => {
        pictureInPictureWindow.addEventListener(
          "resize",
          () => {
            this.player.$emit(PlayerEvents.PICTURE_IN_PICTURE_WINDOW_RESIZE);
          },
          false
        );
      });
  }

  private exitPictureInPicture() {
    if (document.pictureInPictureElement) {
      // 存在画中画才能关闭，否则会报错
      document.exitPictureInPicture();
    }
  }

  destroy() {
    // 清除video的事件监听
    this.eventManager.removeEventListener();
  }
}

export default VideoPlayer;
