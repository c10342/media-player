import { parseHtmlToDom } from "@lin-media/utils";
import { PlayButtonIconEnum } from "../config/enum";
import { VideoEvents } from "../config/event";
import Player from "../player";
import PlayButtonTpl from "../templates/play-button";
import Component from "./component";

class VideoPlayButton extends Component {
  constructor(player: Player, slotElement: HTMLElement, options = {}) {
    super(player, slotElement, options);
    // 初始化dom
    this.initDom(slotElement);
    this.initListener();
    this.triggerReady();
  }

  private initDom(slotElement: HTMLElement) {
    const parentElement = slotElement.querySelector(".player-controls-left")!;
    const html = PlayButtonTpl();
    this.rootElement = parseHtmlToDom(html);
    parentElement.appendChild(this.rootElement);
  }

  private initListener() {
    this.player.$on(VideoEvents.PLAY, this.onVideoPlay.bind(this));
    this.player.$on(VideoEvents.PAUSE, this.onVideoPause.bind(this));
    this.eventManager.addEventListener({
      element: this.rootElement,
      eventName: "click",
      handler: this.onPlayButtClick.bind(this)
    });
  }

  // 视频播放事件处理
  private onVideoPlay() {
    // 显示播放图标
    this.showPlayIcon();
  }
  // 视频暂停事件处理
  private onVideoPause() {
    // 显示暂停图标
    this.showPauseIcon();
  }

  // 显示播放图标
  private showPlayIcon() {
    this.rootElement.classList.remove(PlayButtonIconEnum.Pause);

    this.rootElement.classList.add(PlayButtonIconEnum.Play);
  }
  // 显示暂停图标
  private showPauseIcon() {
    this.rootElement.classList.remove(PlayButtonIconEnum.Play);
    this.rootElement.classList.add(PlayButtonIconEnum.Pause);
  }

  private onPlayButtClick(event: MouseEvent) {
    event.stopPropagation();
    // 切换播放状态
    this.player.toggle();
  }
}

export default VideoPlayButton;
