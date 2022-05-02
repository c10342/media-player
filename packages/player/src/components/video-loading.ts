import { parseHtmlToDom, updateStyle } from "@lin-media/utils";

import { VideoReadyStateEnum } from "../config/enum";
import { PlayerEvents, VideoEvents } from "../config/event";
import Player from "../player";
import LoadingTpl from "../templates/loading";
import Component from "./component";

class VideoLoading extends Component {
  constructor(
    player: Player,
    slotElement: HTMLElement,
    options = {},
    parentComponent: any
  ) {
    super(player, slotElement, options, parentComponent);

    // 初始化dom
    this.initDom(slotElement);
    this.initListener();
    this.triggerReady();
  }

  private initDom(slotElement: HTMLElement) {
    const html = LoadingTpl();
    this.rootElement = parseHtmlToDom(html);
    slotElement.appendChild(this.rootElement);
  }

  private initListener() {
    // 切换清晰度前
    this.player.$on(
      PlayerEvents.SWITCHDEFINITIONSTART,
      this.onBeforeSwitchDefinition.bind(this)
    );
    this.player.$on(VideoEvents.WAITING, this.onVideoWaiting.bind(this));
    this.player.$on(VideoEvents.CANPLAY, this.onVideoCanplay.bind(this));
  }

  // 视频缓冲事件
  private onVideoWaiting(event: Event) {
    const target = event.target as HTMLVideoElement;
    if (target.readyState !== VideoReadyStateEnum.complete) {
      // 显示loading
      this.showLoading();
    }
  }

  // 视频可播放事件
  private onVideoCanplay() {
    this.hideLoading();
  }

  // 切换清晰度的时候也要显示loading
  private onBeforeSwitchDefinition() {
    this.showLoading();
  }
  // 显示loading
  private showLoading() {
    updateStyle(this.rootElement, {
      display: "flex"
    });
  }
  // 隐藏loading
  private hideLoading() {
    updateStyle(this.rootElement, {
      display: ""
    });
  }
}

export default VideoLoading;
