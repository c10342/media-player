import {
  checkData,
  EventManager,
  isFunction,
  isUndef,
  parseHtmlToDom
} from "@lin-media/utils";
import { PlayerEvents, VideoEvents } from "../config/event";
import MediaPlayer from "../index";
import VideoTpl from "../templates/video.art";
import { VideoListItem } from "../types";

class VideoPlayer {
  // 播放器实例
  private _playerInstance: MediaPlayer;
  // dom事件管理器
  private _eventManager = new EventManager();
  // 当前正在播放的视频索引
  private _currentIndex = 0;
  // 组件根元素
  private _compRootElement: HTMLElement;

  $videoElement: HTMLVideoElement;

  get $duration() {
    return this.$videoElement?.duration;
  }

  get $volume() {
    return this.$videoElement?.volume;
  }

  constructor(playerInstance: MediaPlayer, slotElement: HTMLElement) {
    // 播放器实例
    this._playerInstance = playerInstance;
    // 初始化dom
    this._initDom(slotElement);
    // 初始化video标签视频
    this._initPlayer();
    // 初始化事件监听
    this._initListener();
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
  // 初始化时间监听
  private _initListener() {
    this._on(PlayerEvents.DESTROY, () => {
      this._destroy();
    });
  }

  private _destroy() {
    // 清除video的事件监听
    this._eventManager.removeEventListener();
  }

  // 播放
  $play() {
    this.$videoElement.play();
  }
  // 暂停
  $pause() {
    this.$videoElement.pause();
  }
  // 切换播放/暂停状态
  $toggle() {
    if (this.$videoElement.paused) {
      this.$play();
    } else {
      this.$pause();
    }
  }

  $seek(time: number) {
    this.$videoElement.currentTime = time;
  }

  $setVolume(volume: number) {
    volume = checkData(volume, 0, 1);
    this.$videoElement.volume = volume;
  }
}

export default VideoPlayer;
