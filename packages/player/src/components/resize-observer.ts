import { debounce, isUndef } from "@lin-media/utils";
import { DOMRESIZEOBSERVER } from "../config/constant";
import MediaPlayer from "../index";

class DomResizeObserver {
  static pluginName = DOMRESIZEOBSERVER;
  private _playerInstance: MediaPlayer;
  private _resizeObserver: ResizeObserver | null;
  constructor(playerInstance: MediaPlayer) {
    this._playerInstance = playerInstance;
    this._initDomResizeObserver();
    this._initListener();
  }

  private _initDomResizeObserver() {
    if (!isUndef(ResizeObserver)) {
      this._resizeObserver = new ResizeObserver(
        debounce((entries: ResizeObserverEntry[]) => {
          this._emit(MediaPlayer.PlayerEvents.RESIZE, entries);
        }, 500)
      );
      this._resizeObserver.observe(this._playerInstance.$rootElement);
    }
  }

  private _initListener() {
    this._on(MediaPlayer.PlayerEvents.DESTROY, () => {
      this._resizeObserver?.disconnect();
    });
  }

  private _emit(eventName: string, data?: any) {
    this._playerInstance.$eventBus.$emit(eventName, data);
  }

  private _on(eventName: string, handler: Function) {
    this._playerInstance.$eventBus.$on(eventName, handler);
  }
}

export default DomResizeObserver;
