import { checkData, isUndef, logError, parseHtmlToDom } from "@lin-media/utils";
import { PlayerEvents, VideoEvents } from "../config/event";
import { forEachSource } from "../global-api/source";
import { forEachTech } from "../global-api/tech";
import Player from "../player";
import Tech from "../techs/tech";
import VideoTpl from "../templates/video";
import VideoTagTpl from "../templates/video-tag";
import { SourceItem } from "../types/index";
import { definePlayerMethods, definePlayerProperty } from "../utils/helper";
import Component from "./component";

class VideoPlayer extends Component {
  // 当前正在播放的视频索引
  private currentIndex = -1;

  videoElement: HTMLVideoElement;

  private oldTech: Tech | null = null;

  constructor(
    player: Player,
    slotElement: HTMLElement,
    options = {},
    parentComponent: any
  ) {
    super(player, slotElement, options, parentComponent);

    // 初始化dom
    this.initDom(slotElement);
    // 设置索引，播放的是哪个视频
    this.setCurrentIndex(this.getDefaultIndex());
    // 初始化video标签视频
    this.initPlayer();
    // 添加事件
    this.initPlayerMethods();
    this.triggerReady();
  }
  // 查询元素
  private querySelector<T extends HTMLVideoElement>(selector: string) {
    return this.rootElement.querySelector(selector) as T;
  }
  // 初始化dom
  private initDom(slotElement: HTMLElement) {
    const { options } = this.player;
    const html = VideoTpl(options as any);
    this.rootElement = parseHtmlToDom(html);

    // 将html插入到插槽中
    slotElement.appendChild(this.rootElement);
    this.videoElement = this.querySelector(".player-video");
  }

  // 获取默认播放的视频，有default的就是默认得了
  private getDefaultIndex() {
    const sources = this.player.options.sources;

    if (sources.length > 0) {
      const index = sources.findIndex((video) => video.default);
      if (index > -1) {
        return index;
      }
      return 0;
    }
    return -1;
  }

  // 获取视频
  private getVideoItem() {
    const { sources } = this.player.options;
    const { currentIndex } = this;

    if (sources.length !== 0) {
      return sources[currentIndex];
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
    sourceItem: SourceItem | null
  ) {
    if (isUndef(sourceItem)) {
      return;
    }
    const initTech = (data: SourceItem) => {
      let flag = false;
      forEachTech((name, Tech, options = {}) => {
        if (Tech.canHandleSource(data, this.player.options)) {
          const techs = this.player.options.techs || {};
          const userOptions = techs[name] || {};
          const defaults = options.defaults ?? {};
          const tech = new Tech(this.player, videoElement, data, {
            ...userOptions,
            ...defaults
          });

          this.oldTech = this.player.tech;

          this.player.tech = tech;
          flag = true;
          return true;
        }
        return false;
      }, this.player.options.techsOrder);
      // 先注册和销毁原来的video标签事件，否则可能会触发原来的video标签事件
      this.initVideoEvents(videoElement);
      // 找不到对应的视频资源处理器
      if (!flag && videoElement.readyState === 0) {
        this.destroyOldTech();
        this.player.destroyTech();
        this.player.ready(() => {
          // showError功能是video-error提供的，可能还没初始化完成
          this.player.showError({
            message: this.player.i18n.t("canNotFindTech")
          });
        });
      }
    };
    const chain: Array<{ type: string; handler: Function }> = [];

    forEachSource((type, handler) => {
      chain.push({ type, handler });
    });
    const next = (index: number, si: SourceItem) => {
      if (index === chain.length) {
        initTech(si);
        return;
      }
      const item = chain[index];
      if (item.type === si.type) {
        let called = false;
        item.handler(si, (s: SourceItem) => {
          if (called) {
            logError("next have been called");

            return;
          }
          next(index + 1, s);
          called = true;
        });
      } else {
        next(index + 1, si);
      }
    };
    next(0, sourceItem);
  }

  private destroyOldTech() {
    if (this.oldTech) {
      this.oldTech.destroy();
      this.oldTech = null;
    }
  }

  // 初始化video标签事件
  private initVideoEvents(videoElement: HTMLVideoElement) {
    this.eventManager.removeElementEventListener(this.videoElement);
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

    const props = {
      videoElement: () => {
        return this.videoElement;
      },
      sourceItem: () => {
        return this.getVideoItem();
      },
      videoReadyState: () => {
        return this.videoElement.readyState;
      },
      mediaError: () => {
        return this.videoElement.error;
      }
    };
    definePlayerProperty(this.player, props);
  }

  // 判断能否进行切换,因为可能越界
  private isCanSwitchQuality(index: number) {
    const player = this.player;
    if (index < 0 || index > player.options.sources.length - 1) {
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

  private async switchVideo() {
    const player = this.player;
    // 先获取原来的video标签
    const prevVideoElement = this.videoElement;
    // 获取视频播放地址
    const videoItem = this.getVideoItem();
    // 清晰度切换前
    this.player.$emit(PlayerEvents.SWITCHDEFINITIONSTART, {
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
    await this.initESM(nextVideoElement, videoItem);
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
      // 先销毁，在重新赋值videoElement属性值，否则销毁的是新video标签
      this.destroyOldTech();
      // 切换完记得更新video标签
      this.videoElement = nextVideoElement;
      // 设置通知
      player.setNotice(player.i18n.t("switch", { quality: videoItem?.label }));
      // 清晰度切换完毕
      this.player.$emit(PlayerEvents.SWITCHDEFINITIONEND, {
        ...videoItem,
        index: this.currentIndex
      });
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
    this.destroyOldTech();
    super.destroy();
  }
}

export default VideoPlayer;
