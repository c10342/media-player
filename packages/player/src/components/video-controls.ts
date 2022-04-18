import {
  isMobile,
  isUndef,
  parseHtmlToDom,
  updateStyle
} from "@lin-media/utils";
import { PlayerEvents, VideoEvents } from "../config/event";
import Player from "../player";
import ControlsTpl from "../templates/controls";

import { definePlayerMethods } from "../utils/helper";
import Component from "./component";

class VideoControls extends Component {
  static componentName = "VideoControls";

  // 是否进入播放器标志位
  private isEnter = false;
  // 定时器
  private timer: number | null;

  constructor(player: Player, slotElement: HTMLElement, options = {}) {
    super(player, slotElement, options);
    // 初始化dom
    this.initDom(slotElement);
    this.initListener();
    this.initPlayerMethods();
    // 初始化组件
    this.initComponent(VideoControls.componentName);
  }

  private initDom(slotElement: HTMLElement) {
    const html = ControlsTpl();
    this.rootElement = parseHtmlToDom(html);
    slotElement.appendChild(this.rootElement);
  }

  private initListener() {
    if (!isMobile()) {
      this.player.$on(VideoEvents.PLAY, this.onVideoPlay.bind(this));
      this.player.$on(VideoEvents.PAUSE, this.onVideoPause.bind(this));
      this.eventManager.addEventListener({
        element: this.player.rootElement,
        eventName: "mouseenter",
        handler: this._onMouseenter.bind(this)
      });
      this.eventManager.addEventListener({
        element: this.player.rootElement,
        eventName: "mouseleave",
        handler: this.onMouseleave.bind(this)
      });
    }
  }

  private initPlayerMethods() {
    const methods: any = {
      hideControls: this.hideControls.bind(this),
      showControls: this.showControls.bind(this),
      toggleControls: this.toggleControls.bind(this)
    };
    definePlayerMethods(this.player, methods);
  }

  // 视频播放事件处理
  private onVideoPlay() {
    this.hideControls();
  }
  // 视频暂停事件处理
  private onVideoPause() {
    this.showControls();
  }

  // 鼠标进入容器事件处理
  private _onMouseenter() {
    this.isEnter = true;
    this.showControls();
  }
  // 鼠标离开容器事件处理
  private onMouseleave() {
    this.isEnter = false;
    this.hideControls();
  }

  private toggleControls() {
    this.isEnter = !this.isEnter;
    if (this.isEnter) {
      this.hide();
    } else {
      this.show();
    }
  }

  // 显示控制条
  private showControls() {
    // 非播放状态，或者鼠标在播放器内，显示出来
    if (this.player.paused || this.isEnter) {
      this.show();
    }
  }
  // 隐藏控制条
  private hideControls(time = 4000) {
    // 销毁定时器
    this.destroyTimer();
    // 4秒后隐藏
    this.timer = window.setTimeout(() => {
      if (!this.player.paused && !this.isEnter) {
        this.hide();
      }
    }, time);
  }

  // 销毁定时器
  private destroyTimer() {
    if (!isUndef(this.timer)) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private show() {
    updateStyle(this.rootElement, {
      transform: ""
    });
    this.player.$emit(PlayerEvents.SHOW_CONTROLS);
  }

  private hide() {
    updateStyle(this.rootElement, {
      transform: "translateY(100%)"
    });
    this.player.$emit(PlayerEvents.HIDE_CONTROLS);
  }

  destroy() {
    this.destroyTimer();
    super.destroy();
  }
}

export default VideoControls;
