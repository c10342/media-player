import { EventManager, parseHtmlToDom, updateStyle } from "@lin-media/utils";

import { VideoReadyStateEnum } from "../config/enum";
import { PlayerEvents, VideoEvents } from "../config/event";
import Player from "../player";
import LoadingTpl from "../templates/loading";
import { ComponentApi } from "../types";

class VideoLoading implements ComponentApi {
  // 播放器实例
  private player: Player;
  // dom事件管理器
  private eventManager = new EventManager();
  // 组件根元素
  private rootElement: HTMLElement;

  constructor(player: Player, slotElement: HTMLElement) {
    // 播放器实例
    this.player = player;
    // 初始化dom
    this.initDom(slotElement);
    this.initListener();
  }

  private initDom(slotElement: HTMLElement) {
    const html = LoadingTpl();
    this.rootElement = parseHtmlToDom(html);
    slotElement.appendChild(this.rootElement);
  }

  private initListener() {
    // 切换清晰度前
    this.player.$on(
      PlayerEvents.SWITCH_DEFINITION_START,
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

  destroy() {
    this.eventManager.removeEventListener();
  }
}

Player.registerComponent("VideoLoading", VideoLoading, {
  init: true
});

export default VideoLoading;
