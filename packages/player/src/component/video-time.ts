import { isUndef, secondToTime } from "@media/utils";
import { VideoEvents } from "../js/event";
import { ComponentOptions } from "../types";

class VideoTime {
  private options: ComponentOptions;
  // 当前播放时间
  private currentTime = 0;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initListener();
  }

  private get instance() {
    return this.options.instance;
  }

  private initListener() {
    this.instance.$on(
      VideoEvents.LOADEDMETADATA,
      this.onVideoLoadedmetadata.bind(this)
    );
    this.instance.$on(
      VideoEvents.TIMEUPDATE,
      this.onVideoTimeupdate.bind(this)
    );
  }
  // video标签获取媒体数据事件
  private onVideoLoadedmetadata(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    const duration = videoElement.duration ?? 0;
    // 设置总时长
    this.setTotalTime(duration);
  }
  // video标签正在播放事件
  private onVideoTimeupdate(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    const currentTime = videoElement.currentTime ?? 0;

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
    const totalTimeElement = this.options.templateInstance.totalTimeElement;
    if (!isUndef(totalTimeElement)) {
      totalTimeElement.innerHTML = secondToTime(duration);
    }
  }
  // 设置当前时长
  private setCurrentTime(currentTime: number) {
    const currentTimeElement = this.options.templateInstance.currentTimeElement;
    if (!isUndef(currentTimeElement)) {
      currentTimeElement.innerHTML = secondToTime(currentTime);
    }
  }
}

export default VideoTime;
