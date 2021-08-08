import "./style/index.scss";
import Template from "./js/template";
import { PlayerOptions } from "./types";
import { isString, isUndef } from "@media/utils";
import VideoPlayer from "./component/video-player";
import VideoPlayButton from "./component/video-play-button";
import VideoTime from "./component/video-time";
import VideoProgress from "./component/video-progress";
import VideoFullscreen from "./component/video-fullscreen";
import VideoLoading from "./component/video-loading";
import VideoVolume from "./component/video-volume";
import EventEmit from "./js/event-emit";

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
  constructor(options: PlayerOptions) {
    super();
    this.options = options;
    this.initParams();
    this.initTemplate();
    this.initVideoPlayer();
    this.initVideoPlayButton();
    this.initVideoTime();
    this.initVideoProgress();
    this.initVideoFullscreen();
    this.initVideoLoading();
    this.initVideoVolume();
  }

  private initParams() {
    let { el } = this.options;
    if (isString(el)) {
      el = document.querySelector(el) as HTMLElement;
    }
    if (!el) {
      throw new TypeError("找不到 el");
    }
    this.options.el = el;
  }

  private initTemplate() {
    this.templateInstance = new Template(this.options);
  }

  private initVideoPlayer() {
    if (!isUndef(this.templateInstance)) {
      this.videoPlayerInstance = new VideoPlayer({
        ...this.options,
        templateInstance: this.templateInstance
      });
    }
  }

  private initVideoPlayButton() {
    if (!isUndef(this.templateInstance)) {
      this.playButtonInstance = new VideoPlayButton({
        ...this.options,
        templateInstance: this.templateInstance
      });
    }
  }

  private initVideoTime() {
    if (!isUndef(this.templateInstance)) {
      this.videoTimeInstance = new VideoTime({
        ...this.options,
        templateInstance: this.templateInstance
      });
    }
  }

  private initVideoProgress() {
    if (!isUndef(this.templateInstance)) {
      this.videoProgressInstance = new VideoProgress({
        ...this.options,
        templateInstance: this.templateInstance
      });
    }
  }

  private initVideoFullscreen() {
    if (!isUndef(this.templateInstance)) {
      this.videoFullscreenInstance = new VideoFullscreen({
        ...this.options,
        templateInstance: this.templateInstance
      });
    }
  }

  private initVideoLoading() {
    if (!isUndef(this.templateInstance)) {
      this.videoLoadingInstance = new VideoLoading({
        ...this.options,
        templateInstance: this.templateInstance
      });
    }
  }

  private initVideoVolume() {
    if (!isUndef(this.templateInstance)) {
      this.videoVolumeInstance = new VideoVolume({
        ...this.options,
        templateInstance: this.templateInstance
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
  }

  destroy() {
    this.$emit("destroy");
    this.videoPlayerInstance?.destroy();
    this.playButtonInstance?.destroy();
    this.videoTimeInstance?.destroy();
    this.videoProgressInstance?.destroy();
    this.videoFullscreenInstance?.destroy();
    this.videoLoadingInstance?.destroy();
    this.videoVolumeInstance?.destroy();
    this.templateInstance?.destroy();
    this.resetData();
  }
}

export default Player;
