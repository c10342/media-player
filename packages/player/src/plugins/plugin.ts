import { EventEmit, isFunction } from "@lin-media/utils";
import Player from "../player";

class Plugin<Options = any> extends EventEmit {
  player: Player;
  options: Options = {} as Options;
  constructor(player: Player, options: Options = {} as Options) {
    super();
    this.player = player;
    this.options = options;
    const onPlayerReady = this.onPlayerReady;
    if (isFunction(onPlayerReady)) {
      this.player.ready(onPlayerReady.bind(this));
    }
  }

  onPlayerReady() {
    // do
  }
  destroy() {
    this.clear();
  }
}

export default Plugin;
