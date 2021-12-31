import { parseHtmlToDom, secondToTime } from "@lin-media/utils";
import { VideoEvents } from "../config/event";
import MediaPlayer from "../index";
import TimeTpl from "../templates/time";

class VideoTime {
  // 播放器实例
  private _playerInstance: MediaPlayer;
  // 组件根元素
  private _compRootElement: HTMLElement;
  // 当前播放时间
  private _currentTime = 0;

  private _totalTimeElement: HTMLElement;

  private _currentTimeElement: HTMLElement;

  constructor(playerInstance: MediaPlayer, slotElement: HTMLElement) {
    // 播放器实例
    this._playerInstance = playerInstance;
    // 初始化dom
    this._initDom(slotElement);
    // 初始化事件
    this._initListener();
  }
  // 查询元素
  private _querySelector<T extends HTMLElement>(selector: string) {
    return this._compRootElement.querySelector(selector) as T;
  }

  private _initDom(slotElement: HTMLElement) {
    const html = TimeTpl({
      isMobile: this._playerInstance.$isMobile
    });
    this._compRootElement = parseHtmlToDom(html);
    slotElement.appendChild(this._compRootElement);
    this._totalTimeElement = this._querySelector(".player-totalTime");
    this._currentTimeElement = this._querySelector(".player-currentTime");
  }

  // 事件监听
  private _on(eventName: string, handler: Function) {
    this._playerInstance.$eventBus.$on(eventName, handler);
  }

  private _initListener() {
    this._on(
      VideoEvents.LOADEDMETADATA,
      this._onVideoLoadedmetadata.bind(this)
    );
    this._on(VideoEvents.TIMEUPDATE, this._onVideoTimeupdate.bind(this));
  }
  // video标签获取媒体数据事件
  private _onVideoLoadedmetadata(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    const duration = videoElement.duration || 0;
    // 设置总时长
    this._setTotalTime(duration);
  }
  // video标签正在播放事件
  private _onVideoTimeupdate(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    const currentTime = videoElement.currentTime || 0;

    const intCurrentTime = Math.floor(currentTime);
    const intPrevTime = Math.floor(this._currentTime);
    // 保证每一秒执行一次
    if (intCurrentTime === intPrevTime) {
      return;
    }

    this._currentTime = currentTime;
    // 设置当前时间
    this._setCurrentTime(currentTime);
  }
  // 设置总时长
  private _setTotalTime(duration: number) {
    this._totalTimeElement.innerHTML = secondToTime(duration);
  }
  // 设置当前时长
  private _setCurrentTime(currentTime: number) {
    this._currentTimeElement.innerHTML = secondToTime(currentTime);
  }
}

export default VideoTime;
