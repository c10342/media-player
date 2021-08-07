import "./style/index.scss";
import Template from "./js/template";
import { PlayerOptions } from "./types";
import { isString } from "@media/utils";
import VideoPlayer from "./component/video-player";
import VideoPlayButton from "./component/video-play-button";
import VideoTime from "./component/video-time";
import VideoProgress from "./component/video-progress";
import VideoFullscreen from "./component/video-fullscreen";
import VideoLoading from "./component/video-loading";

class Player {
  private options: PlayerOptions;
  private templateInstance: Template;
  private videoPlayerInstance: VideoPlayer | null;
  private playButtonInstance: VideoPlayButton | null;
  private videoTimeInstance: VideoTime | null;
  private videoProgressInstance: VideoProgress | null;
  private videoFullscreenInstance: VideoFullscreen | null;
  private videoLoadingInstance: VideoLoading | null;
  constructor(options: PlayerOptions) {
    this.options = options;
    this.initParams();
    this.initTemplate();
    this.initVideoPlayer();
    this.initVideoPlayButton();
    this.initVideoTime();
    this.initVideoProgress();
    this.initVideoFullscreen();
    this.initVideoLoading();
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
    this.videoPlayerInstance = new VideoPlayer({
      ...this.options,
      templateInstance: this.templateInstance
    });
  }

  private initVideoPlayButton() {
    this.playButtonInstance = new VideoPlayButton({
      ...this.options,
      templateInstance: this.templateInstance
    });
  }

  private initVideoTime() {
    this.videoTimeInstance = new VideoTime({
      ...this.options,
      templateInstance: this.templateInstance
    });
  }

  private initVideoProgress() {
    this.videoProgressInstance = new VideoProgress({
      ...this.options,
      templateInstance: this.templateInstance
    });
  }

  private initVideoFullscreen() {
    this.videoFullscreenInstance = new VideoFullscreen({
      ...this.options,
      templateInstance: this.templateInstance
    });
  }

  private initVideoLoading() {
    this.videoLoadingInstance = new VideoLoading({
      ...this.options,
      templateInstance: this.templateInstance
    });
  }

  destroy() {
    this.videoPlayerInstance?.destroy();
    this.playButtonInstance?.destroy();
    this.videoTimeInstance?.destroy();
    this.videoProgressInstance?.destroy();
    this.videoFullscreenInstance?.destroy();
    this.videoLoadingInstance?.destroy();
  }
}

export default Player;
