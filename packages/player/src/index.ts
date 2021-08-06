import "./style/index.scss";
import Template from "./js/template";
import { PlayerOptions } from "./types";
import { isString } from "@media/utils";
import VideoPlayer from "./component/video-player";

class Player {
  private options: PlayerOptions;
  private templateInstance: Template;
  private videoPlayerInstance: VideoPlayer;
  constructor(options: PlayerOptions) {
    this.options = options;
    this.initParmas();
    this.initTemplate();
    this.initVideoPlayer();
  }

  private initParmas() {
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
      options: this.options,
      templateInstance: this.templateInstance
    });
  }
}

export default Player;
