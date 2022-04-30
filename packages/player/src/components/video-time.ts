import { isMobile, parseHtmlToDom, secondToTime } from "@lin-media/utils";
import { VideoEvents } from "../config/event";
import Player from "../player";
import TimeTpl from "../templates/time";
import { PlayerConfig } from "../types/player";
import Component from "./component";

class VideoTime extends Component {
  static shouldInit(options: PlayerConfig) {
    return !options.live;
  }

  // 当前播放时间
  private currentTime = 0;

  private totalTimeElement: HTMLElement;

  private currentTimeElement: HTMLElement;

  constructor(player: Player, slotElement: HTMLElement, options = {}) {
    super(player, slotElement, options);
    // 初始化dom
    this.initDom(slotElement);
    // 初始化事件
    this.initListener();
    this.triggerReady();
  }
  // 查询元素
  private querySelector<T extends HTMLElement>(selector: string) {
    return this.rootElement.querySelector(selector) as T;
  }

  private initDom(slotElement: HTMLElement) {
    const parentElement = slotElement.querySelector(".player-controls-left")!;
    const html = TimeTpl({
      isMobile: isMobile()
    });
    this.rootElement = parseHtmlToDom(html);
    parentElement.appendChild(this.rootElement);
    this.totalTimeElement = this.querySelector(".player-totalTime");
    this.currentTimeElement = this.querySelector(".player-currentTime");
  }

  private initListener() {
    this.player.$on(
      VideoEvents.LOADEDMETADATA,
      this.onVideoLoadedmetadata.bind(this)
    );
    this.player.$on(VideoEvents.TIMEUPDATE, this.onVideoTimeupdate.bind(this));
  }
  // video标签获取媒体数据事件
  private onVideoLoadedmetadata(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    const duration = videoElement.duration || 0;
    // 设置总时长
    this.setTotalTime(duration);
  }
  // video标签正在播放事件
  private onVideoTimeupdate(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    const currentTime = videoElement.currentTime || 0;

    const intCurrentTime = Math.floor(currentTime);
    const intPrevTime = Math.floor(this.currentTime);
    // 保证每一秒执行一次
    if (intCurrentTime === intPrevTime) {
      return;
    }

    this.currentTime = currentTime;
    // 设置当前时间
    this.setCurrentTime(currentTime);
  }
  // 设置总时长
  private setTotalTime(duration: number) {
    this.totalTimeElement.innerHTML = secondToTime(duration);
  }
  // 设置当前时长
  private setCurrentTime(currentTime: number) {
    this.currentTimeElement.innerHTML = secondToTime(currentTime);
  }
}

export default VideoTime;
