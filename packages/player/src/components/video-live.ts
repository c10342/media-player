import { parseHtmlToDom } from "@lin-media/utils";
import MediaPlayer from "../index";
import LiveTpl from "../templates/live.art";
class VideoLive {
  // 播放器实例
  private _playerInstance: MediaPlayer;
  constructor(playerInstance: MediaPlayer, slotElement: HTMLElement) {
    // 播放器实例
    this._playerInstance = playerInstance;
    // 初始化dom
    this._initDom(slotElement);
  }

  private _initDom(slotElement: HTMLElement) {
    const html = LiveTpl({
      $t: this._playerInstance.$i18n.t
    });
    slotElement.appendChild(parseHtmlToDom(html));
  }
}

export default VideoLive;
