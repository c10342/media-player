import templateTpl from "../template/layout.art";

import { PlayerOptions } from "../types/index";

type ElementProp = HTMLElement | null;

class Template {
  private options: PlayerOptions;

  containerElement: ElementProp;

  constructor(options: PlayerOptions) {
    this.options = options;
    this.initTemplate();
    this.initDom();
  }

  private initTemplate() {
    const el = this.options.el as HTMLElement;
    const html = templateTpl({
      ...this.options
    });
    el.innerHTML = html;
  }

  private initDom() {
    const el = this.options.el as HTMLElement;
    this.containerElement = el.querySelector(".player-container");
  }
}

export default Template;
