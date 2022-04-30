import { EventEmit, isFunction } from "@lin-media/utils";
import Player from "../player";

class Plugin<Options = any> extends EventEmit {
  static id = "Plugin";
  player: Player;
  options: Options = {} as Options;
  private isReady = false;
  private readyCallback: Array<Function> = [];
  constructor(player: Player, options: Options = {} as Options) {
    super();
    this.player = player;
    this.options = options;
    this.player.ready(this.onPlayerReady.bind(this));
  }

  onPlayerReady() {
    // todo
  }

  ready(fn: Function) {
    if (this.isReady) {
      fn();
    } else {
      this.readyCallback.push(fn);
    }
  }

  private runReadyCallback() {
    const list = this.readyCallback.slice();
    if (list.length === 0) {
      return;
    }
    this.readyCallback = [];
    list.forEach((fn) => fn());
  }

  triggerReady() {
    if (this.isReady) {
      return;
    }
    this.isReady = true;
    this.$emit("ready");
    this.runReadyCallback();
  }

  destroy() {
    this.clear();
  }
}

export default Plugin;
