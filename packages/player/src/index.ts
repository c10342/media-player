import Template from "./js/template";
import { PlayerOptions } from "./types";
import { isString } from "@media/utils";

class VideoPlayer {
  private options: PlayerOptions;
  private templateInstance: Template;
  constructor(options: PlayerOptions) {
    this.options = options;
    this.initParmas();
    this.initTemplate();
  }

  initParmas() {
    let { el } = this.options;
    if (isString(el)) {
      el = document.querySelector(el) as HTMLElement;
    }
    if (!el) {
      throw new TypeError("找不到 el");
    }
    this.options.el = el;
  }

  initTemplate() {
    this.templateInstance = new Template(this.options);
  }
}

export default VideoPlayer;
