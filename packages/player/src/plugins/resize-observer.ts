import { debounce, isUndef } from "@lin-media/utils";
import { PlayerEvents } from "../config/event";
import { registerPlugin } from "../global-api/plugin";
import Player from "../player";
import { PluginApi } from "../types";

class DomResizeObserver implements PluginApi {
  private player: Player;
  private resizeObserver: ResizeObserver | null;
  constructor(player: Player) {
    this.player = player;
    this.player.ready(() => {
      this.initDomResizeObserver();
    });
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
  }
}
registerPlugin("DomResizeObserver", DomResizeObserver, {
  init: true
});
export default DomResizeObserver;
