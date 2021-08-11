import { isUndef, secondToTime } from "@media/utils";
import { VideoEvents } from "../js/event";
import { ComponentOptions } from "../types";

class VideoTime {
  private options: ComponentOptions;
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

  private onVideoLoadedmetadata(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    const duration = videoElement.duration ?? 0;
    this.setTotalTime(duration);
  }

  private onVideoTimeupdate(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    const currentTime = videoElement.currentTime ?? 0;

    const intCurrentTime = Math.floor(currentTime);
    const intPrevTime = Math.floor(this.currentTime);
    if (intCurrentTime === intPrevTime) {
      return;
    }

    this.currentTime = currentTime;

    this.setCurrentTime(currentTime);
  }

  private setTotalTime(duration: number) {
    const totalTimeElement = this.options.templateInstance.totalTimeElement;
    if (!isUndef(totalTimeElement)) {
      totalTimeElement.innerHTML = secondToTime(duration);
    }
  }

  private setCurrentTime(currentTime: number) {
    const currentTimeElement = this.options.templateInstance.currentTimeElement;
    if (!isUndef(currentTimeElement)) {
      currentTimeElement.innerHTML = secondToTime(currentTime);
    }
  }
}

export default VideoTime;
