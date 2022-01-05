import {
  checkData,
  EventManager,
  isFunction,
  isUndef,
  parseHtmlToDom,
  PLUGINNAME
} from "@lin-media/utils";
import { VIDEOPLAYER } from "../config/constant";
import {
  MessageChannelEvents,
  PlayerEvents,
  VideoEvents
} from "../config/event";
import MediaPlayer from "../index";
import VideoTpl from "../templates/video";
import VideoTagTpl from "../templates/video-tag";
import { VideoListItem } from "../types";

class VideoPlayer {
  static [PLUGINNAME] = VIDEOPLAYER;
  // 播放器实例
  private _playerInstance: MediaPlayer;
  // dom事件管理器
  private _eventManager = new EventManager();
  // 当前正在播放的视频索引
  private _currentIndex = -1;
  // 组件根元素
  private _compRootElement: HTMLElement;

  $videoElement: HTMLVideoElement;

  constructor(playerInstance: MediaPlayer, slotElement: HTMLElement) {
    // 播放器实例
    this._playerInstance = playerInstance;
    // 初始化dom
    this._initDom(slotElement);
    // 设置索引，播放的是哪个视频
    this._setCurrentIndex(this._getDefaultIndex());
    // 初始化video标签视频
    this._initPlayer();
    // 初始化事件监听
    this._initListener();
    // 事件通道
    this._initMessageChannel();
  }
  // 查询元素
  private _querySelector<T extends HTMLVideoElement>(selector: string) {
    return this._compRootElement.querySelector(selector) as T;
  }
  // 初始化dom
  private _initDom(slotElement: HTMLElement) {
    const { $options } = this._playerInstance;
    const html = VideoTpl($options);
    this._compRootElement = parseHtmlToDom(html);

    // 将html插入到插槽中
    slotElement.appendChild(this._compRootElement);
    this.$videoElement = this._querySelector(".player-video");
  }

  // 获取默认播放的视频，有default的就是默认得了
  private _getDefaultIndex() {
    const videoList = this._playerInstance.$options.videoList;
    if (videoList.length > 0) {
      const index = videoList.findIndex((video) => video.default);
      if (index > -1) {
        return index;
      }
      return 0;
    }
    return -1;
  }

  // 获取视频
  private _getVideoItem() {
    const { videoList } = this._playerInstance.$options;
    const { _currentIndex } = this;
    if (videoList.length !== 0) {
      return videoList[_currentIndex];
    }
    return null;
  }
  // 初始化video标签
  private _initPlayer() {
    const videoItem = this._getVideoItem();
    // 初始化视频
    this._initESM(this.$videoElement, videoItem);
  }

  private _initESM(
    videoElement: HTMLVideoElement,
    videoItem: VideoListItem | null
  ) {
    if (!isUndef(videoItem)) {
      // 自定义ems
      const { customType } = this._playerInstance.$options;
      if (isFunction(customType)) {
        customType(videoElement, videoItem);
      } else {
        // 其他的直接赋值
        videoElement.src = videoItem.url;
      }
      this._initVideoEvents(videoElement);
    }
  }

  // 初始化video标签事件
  private _initVideoEvents(videoElement: HTMLVideoElement) {
    // 外部统一使用$on来进行监听，因为切换清晰度之后，video标签会被替换掉，所有事件需要重新监听
    for (const key in VideoEvents) {
      const eventName = (VideoEvents as any)[key];
      this._eventManager.addEventListener({
        element: videoElement,
        eventName,
        handler: (event) => {
          this._emit(eventName, event);
        }
      });
    }
  }
  // 发射事件
  private _emit(eventName: string, data?: any) {
    this._playerInstance.$eventBus.$emit(eventName, data);
  }

  // 监听事件
  private _on(eventName: string, handler: Function) {
    this._playerInstance.$eventBus.$on(eventName, handler);
  }
  private _once(eventName: string, handler: Function) {
    this._playerInstance.$eventBus.$once(eventName, handler);
  }
  // 初始化事件监听
  private _initListener() {
    this._on(PlayerEvents.DESTROY, () => {
      this._destroy();
    });
  }

  private _initMessageChannel() {
    this._on(MessageChannelEvents.SEEK, this._seek.bind(this));
    this._on(MessageChannelEvents.PLAY, this._play.bind(this));
    this._on(MessageChannelEvents.PAUSE, this._pause.bind(this));
    this._on(MessageChannelEvents.TOGGLE, this._toggle.bind(this));
    this._on(MessageChannelEvents.SETVOLUME, this._setVolume.bind(this));
    this._on(
      MessageChannelEvents.SWITCHDEFINITION,
      this._switchDefinition.bind(this)
    );
    this._on(MessageChannelEvents.SETSPEED, this._setSpeed.bind(this));
  }

  private _destroy() {
    // 清除video的事件监听
    this._eventManager.removeEventListener();
  }

  // 判断能否进行切换,因为可能越界
  private _isCanSwitchQuality(index: number) {
    const playerInstance = this._playerInstance;
    if (index < 0 || index > playerInstance.$options.videoList.length - 1) {
      playerInstance.setNotice(playerInstance.$i18n.t("invalidDefinition"));
      return false;
    }
    return true;
  }

  private _setCurrentIndex(index: number) {
    if (index !== this._currentIndex && this._isCanSwitchQuality(index)) {
      this._currentIndex = index;
    }
  }

  private _switchVideo() {
    const playerInstance = this._playerInstance;
    // 先获取原来的video标签
    const prevVideoElement = this.$videoElement;
    // 获取视频播放地址
    const videoItem = this._getVideoItem();
    // 清晰度切换前
    this._emit(PlayerEvents.SWITCH_DEFINITION_START, {
      ...videoItem,
      index: this._currentIndex
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
      ...playerInstance.$options
    });
    // 将字符串转化为dom
    const nextVideoElement = parseHtmlToDom(videoHtml) as HTMLVideoElement;
    // 旧的video标签暂停播放
    prevVideoElement.pause();
    // 新的video标签插入到旧的video标签前，也就是新的video标签在旧的video标签下方
    this._compRootElement.insertBefore(nextVideoElement, prevVideoElement);
    // 初始化新的video标签视频
    this._initESM(nextVideoElement, videoItem);
    // 设置新video标签的状态
    nextVideoElement.currentTime = prevStatus.currentTime;
    nextVideoElement.volume = prevStatus.volume;
    nextVideoElement.playbackRate = prevStatus.playbackRate;
    if (!prevStatus.paused) {
      nextVideoElement.play();
    }
    // 监听新的video标签的canplay事件
    this._once(VideoEvents.CANPLAY, () => {
      // 这个时候说明新的video标签已经准备好了，可以移除旧的video标签了，这样子就可以完美解决切换清晰度闪屏的问题了
      this._compRootElement.removeChild(prevVideoElement);
      // 清晰度切换完毕
      this._emit(PlayerEvents.SWITCH_DEFINITION_END, {
        ...videoItem,
        index: this._currentIndex
      });
      // 切换完记得更新video标签
      this.$videoElement = nextVideoElement;
      // 设置通知
      playerInstance.setNotice(
        playerInstance.$i18n.t("switch", { quality: videoItem?.label })
      );
    });
  }

  // 播放
  private _play() {
    this.$videoElement.play();
  }
  // 暂停
  private _pause() {
    this.$videoElement.pause();
  }
  // 切换播放/暂停状态
  private _toggle() {
    if (this.$videoElement.paused) {
      this._play();
    } else {
      this._pause();
    }
  }

  private _seek(time: number) {
    this.$videoElement.currentTime = time;
  }

  private _setSpeed(playbackRate: number) {
    playbackRate = checkData(playbackRate, 0, 2);
    this.$videoElement.playbackRate = playbackRate;
  }

  private _setVolume(volume: number) {
    volume = checkData(volume, 0, 1);
    this.$videoElement.volume = volume;
  }

  private _switchDefinition(index: number) {
    if (index !== this._currentIndex && this._isCanSwitchQuality(index)) {
      // 设置当前视频索引
      this._setCurrentIndex(index);
      // 切换video标签
      this._switchVideo();
    }
  }
}

export default VideoPlayer;
