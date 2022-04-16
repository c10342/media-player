import {
  EventManager,
  isFunction,
  isMobile,
  isUndef,
  parseHtmlToDom,
  updateStyle
} from "@lin-media/utils";
import { PlayerEvents, VideoEvents } from "../config/event";
import createComponent from "../global-api/component";
import Player from "../player";
import ControlsTpl from "../templates/controls";
import VideoProgress from "./video-progress";
import VideoPlayButton from "./video-play-button";
import VideoVolume from "./video-volume";
import VideoTime from "./video-time";
import VideoFullscreen from "./video-fullscreen";
import VideoSpeed from "./video-speed";
import VideoDefinition from "./video-definition";
import VideoLive from "./video-live";

import { ClassType } from "../types";
import { definePlayerMethods, initComponents } from "../utils/helper";
import { ComponentApi, DefaultComponentOptions } from "../types/component";

const cmp = createComponent();

class VideoControls implements ComponentApi {
  static registerComponent(
    name: string,
    component: ClassType<ComponentApi>,
    options?: DefaultComponentOptions
  ) {
    cmp.registerComponent(name, component, options);
    return this;
  }

  static removeComponent(name: string) {
    cmp.removeComponent(name);
    return this;
  }

  static getComponent(name: string) {
    return cmp.getComponent(name);
  }

  // 播放器实例
  private player: Player;
  // dom事件管理器
  private eventManager = new EventManager();
  // 组件根元素
  private rootElement: HTMLElement;

  // 是否进入播放器标志位
  private isEnter = false;
  // 定时器
  private timer: number | null;

  options: Record<string, any> = {};

  children: { [key: string]: ComponentApi } = {};

  constructor(
    player: Player,
    slotElement: HTMLElement,
    options: Record<string, any>
  ) {
    // 播放器实例
    this.player = player;
    this.options = options;
    // 初始化dom
    this.initDom(slotElement);
    // 初始化组件
    this.initComponent();
    this.initListener();
    this.initPlayerMethods();
  }

  private initDom(slotElement: HTMLElement) {
    const html = ControlsTpl();
    this.rootElement = parseHtmlToDom(html);
    slotElement.appendChild(this.rootElement);
  }

  private initComponent() {
    initComponents(
      cmp.forEachComponent,
      this.player,
      this.rootElement,
      this.children,
      this.options.children || {}
    );
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

  private destroyComponent() {
    Object.keys(this.children).forEach((name) => {
      const component = this.children[name];
      if (isFunction(component.destroy)) {
        component.destroy();
      }
    });
  }

  destroy() {
    this.eventManager.removeEventListener();
    this.destroyTimer();
    this.destroyComponent();
  }
}

const options = {
  init: true
};

Player.registerComponent("VideoControls", VideoControls, options);

VideoControls.registerComponent("VideoProgress", VideoProgress, options);
VideoControls.registerComponent("VideoPlayButton", VideoPlayButton, options);
VideoControls.registerComponent("VideoVolume", VideoVolume, options);
VideoControls.registerComponent("VideoTime", VideoTime, options);
VideoControls.registerComponent("VideoLive", VideoLive, options);
VideoControls.registerComponent("VideoSpeed", VideoSpeed, options);
VideoControls.registerComponent("VideoDefinition", VideoDefinition, options);
VideoControls.registerComponent("VideoFullscreen", VideoFullscreen, options);

export default VideoControls;
