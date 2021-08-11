import Template from "./js/template";
import { PlayerOptions } from "./types";
import { isArray, isString, isUndef } from "@media/utils";
import VideoPlayer from "./component/video-player";
import VideoPlayButton from "./component/video-play-button";
import VideoTime from "./component/video-time";
import VideoProgress from "./component/video-progress";
import VideoFullscreen from "./component/video-fullscreen";
import VideoLoading from "./component/video-loading";
import VideoVolume from "./component/video-volume";
import VideoSpeed from "./component/video-speed";
import VideoTip from "./component/video-tip";
import VideoControls from "./component/video-controls";
import EventEmit from "./js/event-emit";
import { CustomEvents } from "./js/event";
import ShortcutKey from "./js/shortcut-key";
import { checkData } from "./js/utils";
import { FullScreenTypeEnum } from "./config/enum";

class Player extends EventEmit {
  private options: PlayerOptions;
  private templateInstance: Template | null;
  private videoPlayerInstance: VideoPlayer | null;
  private playButtonInstance: VideoPlayButton | null;
  private videoTimeInstance: VideoTime | null;
  private videoProgressInstance: VideoProgress | null;
  private videoFullscreenInstance: VideoFullscreen | null;
  private videoLoadingInstance: VideoLoading | null;
  private videoVolumeInstance: VideoVolume | null;
  private videoSpeedInstance: VideoSpeed | null;
  private videoTipInstance: VideoTip | null;
  private videoControlsInstance: VideoControls | null;
  private shortcutKeyInstance: ShortcutKey | null;
  constructor(options: PlayerOptions) {
    super();
    this.options = options;
    this.initTemplate();
    this.initVideoTip();
    this.initVideoPlayer();
    this.initVideoPlayButton();
    this.initVideoTime();
    this.initVideoProgress();
    this.initVideoFullscreen();
    this.initVideoLoading();
    this.initVideoVolume();
    this.initVideoSpeed();
    this.initVideoControls();
    this.initShortcutKey();
  }

  get isLive() {
    return this.options.live;
  }

  private initTemplate() {
    this.templateInstance = new Template({
      ...this.options,
      instance: this
    });
  }

  private initVideoTip() {
    const templateInstance = this.templateInstance;
    if (!isUndef(templateInstance)) {
      this.videoTipInstance = new VideoTip({
        ...this.options,
        templateInstance,
        instance: this
      });
    }
  }

  private initVideoPlayer() {
    const templateInstance = this.templateInstance;
    if (!isUndef(templateInstance)) {
      this.videoPlayerInstance = new VideoPlayer({
        ...this.options,
        templateInstance,
        instance: this
      });
    }
  }

  private initVideoPlayButton() {
    const templateInstance = this.templateInstance;
    if (!isUndef(templateInstance)) {
      this.playButtonInstance = new VideoPlayButton({
        ...this.options,
        templateInstance,
        instance: this
      });
    }
  }

  private initVideoTime() {
    const templateInstance = this.templateInstance;
    if (!isUndef(templateInstance) && !this.isLive) {
      this.videoTimeInstance = new VideoTime({
        ...this.options,
        templateInstance,
        instance: this
      });
    }
  }

  private initVideoProgress() {
    const templateInstance = this.templateInstance;
    if (!isUndef(templateInstance) && !this.isLive) {
      this.videoProgressInstance = new VideoProgress({
        ...this.options,
        templateInstance,
        instance: this
      });
    }
  }

  private initVideoFullscreen() {
    const templateInstance = this.templateInstance;
    if (!isUndef(templateInstance)) {
      this.videoFullscreenInstance = new VideoFullscreen({
        ...this.options,
        templateInstance,
        instance: this
      });
    }
  }

  private initVideoLoading() {
    const templateInstance = this.templateInstance;
    if (!isUndef(templateInstance)) {
      this.videoLoadingInstance = new VideoLoading({
        ...this.options,
        templateInstance,
        instance: this
      });
    }
  }

  private initVideoVolume() {
    const templateInstance = this.templateInstance;
    if (!isUndef(templateInstance)) {
      this.videoVolumeInstance = new VideoVolume({
        ...this.options,
        templateInstance,
        instance: this
      });
    }
  }

  private initVideoSpeed() {
    const speedList = this.options.speedList;
    if (!this.isLive && isArray(speedList) && speedList.length > 0) {
      const templateInstance = this.templateInstance;
      if (!isUndef(templateInstance)) {
        this.videoSpeedInstance = new VideoSpeed({
          ...this.options,
          speedList,
          templateInstance,
          instance: this
        });
      }
    }
  }

  private initVideoControls() {
    const templateInstance = this.templateInstance;
    if (!isUndef(templateInstance)) {
      this.videoControlsInstance = new VideoControls({
        ...this.options,
        templateInstance,
        instance: this
      });
    }
  }

  private initShortcutKey() {
    const templateInstance = this.templateInstance;
    const { hotkey } = this.options;
    if (!isUndef(templateInstance) && hotkey) {
      this.shortcutKeyInstance = new ShortcutKey({
        ...this.options,
        templateInstance,
        instance: this
      });
    }
  }

  private resetData() {
    this.videoPlayerInstance = null;
    this.playButtonInstance = null;
    this.videoTimeInstance = null;
    this.videoProgressInstance = null;
    this.videoFullscreenInstance = null;
    this.videoLoadingInstance = null;
    this.videoVolumeInstance = null;
    this.templateInstance = null;
    this.videoSpeedInstance = null;
  }

  private removeElement() {
    const containerElement = this.templateInstance?.containerElement;
    if (!isUndef(containerElement)) {
      (this.options.el as HTMLElement).removeChild(containerElement);
    }
  }

  play() {
    this.videoElement?.play();
  }

  pause() {
    this.videoElement?.pause();
  }

  seek(time: number) {
    if (!this.isLive) {
      const videoElement = this.videoElement;
      if (!isUndef(time) && !isUndef(videoElement)) {
        videoElement.currentTime = time;
      }
    }
  }

  setNotice(text: string, time?: number) {
    this.videoTipInstance?.setNotice(text, time);
  }

  switchDefinition(index: number) {
    this.videoPlayerInstance?.switchDefinition(index);
  }

  setSpeed(playbackRate: number) {
    const videoElement = this.videoElement;
    if (!isUndef(videoElement)) {
      playbackRate = checkData(playbackRate, 0, 2);
      videoElement.playbackRate = playbackRate;
    }
  }

  setVolume(volume: number) {
    const videoElement = this.videoElement;
    if (!isUndef(videoElement)) {
      volume = checkData(volume, 0, 1);
      videoElement.volume = volume;
    }
  }

  toggle() {
    if (this.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  get videoElement() {
    return this.templateInstance?.videoElement;
  }

  get paused() {
    return this.videoElement?.paused;
  }

  get currentTime() {
    return this.videoElement?.currentTime ?? 0;
  }

  get duration() {
    return this.videoElement?.duration ?? 0;
  }

  get volume() {
    return this.videoElement?.volume ?? 1;
  }

  // 全屏
  get fullScreen() {
    return {
      request: (type: string) => {
        if (type === FullScreenTypeEnum.web) {
          this.videoFullscreenInstance?.enterWebFullscreen();
        } else if (type === FullScreenTypeEnum.browser) {
          this.videoFullscreenInstance?.enterBrowserFullScreen();
        }
      },
      cancel: (type: string) => {
        if (type === FullScreenTypeEnum.web) {
          this.videoFullscreenInstance?.exitWebFullscreen();
        } else if (type === FullScreenTypeEnum.browser) {
          this.videoFullscreenInstance?.exitBrowserFullscreen();
        }
      }
    };
  }

  destroy() {
    this.$emit(CustomEvents.DESTROY);
    this.clear();
    this.removeElement();
    this.resetData();
  }
}

export default Player;
