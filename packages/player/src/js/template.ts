import templateTpl from "../template/layout";

import { HtmlElementProp, PlayerOptions } from "../types/index";

class Template {
  private options: PlayerOptions;

  containerElement: HtmlElementProp;

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
