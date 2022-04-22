import { debounce, isUndef } from "@lin-media/utils";
import { PlayerEvents } from "../config/event";
import Player from "../player";
import Plugin from "./plugin";

class DomResizeObserver extends Plugin {
  private resizeObserver: ResizeObserver | null;
  constructor(player: Player, options: any) {
    super(player, options);
    this.player = player;
  }

  onPlayerReady() {
    this.initDomResizeObserver();
  }

  private initDomResizeObserver() {
    if (!isUndef(ResizeObserver)) {
      this.resizeObserver = new ResizeObserver(
        debounce((entries: ResizeObserverEntry[]) => {
          this.player.$emit(PlayerEvents.RESIZE, entries);
        }, 500)
      );
      this.resizeObserver.observe(this.player.rootElement);
    }
  }

  destroy() {
    this.resizeObserver?.disconnect();
    super.destroy();
  }
}

export default DomResizeObserver;
