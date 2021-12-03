import "./styles/index.scss";
import {
  EventEmit,
  isMobile,
  isString,
  isUndef,
  LangTypeEnum,
  logWarn,
  parseHtmlToDom
} from "@lin-media/utils";
import defaultOptions from "./config/default-config";
import { LangOptions, PlayerOptions } from "./types";
import { getPluginName, mergeConfig } from "./utils/index";
import initLocale from "./locale/index";
import LayoutTpl from "./templates/layout.art";
import VideoPlayer from "./components/video-player";
import VideoControls from "./components/video-controls";
import VideoMask from "./components/video-mask";
import VideoLoading from "./components/video-loading";
import VideoTip from "./components/video-tip";
import ShortcutKey from "./components/shortcut-key";
import MobilePlayButton from "./components/mobile-play-button";
import { PlayerEvents, VideoEvents } from "./config/event";

interface PlayerOptionsParams extends PlayerOptions {
  el: HTMLElement;
}

class MediaPlayer {
  static PlayerEvents = PlayerEvents;
  static VideoEvents = VideoEvents;

  // 全局配置
  static globalConfig = defaultOptions;
  //   设置中英文，zh/en
  static setLang(lang: LangTypeEnum) {
    this.globalConfig.lang = lang;
    return MediaPlayer;
  }
  // 自定义语言包
  static useLang(customLanguage: LangOptions) {
    this.globalConfig.customLanguage = customLanguage;
    return MediaPlayer;
  }
  //   全局注册插件
  static use(ctor: Function) {
    const plugins = this.globalConfig.plugins;
    const installed = plugins.some((plugin) => {
      return getPluginName(plugin) === getPluginName(ctor);
    });
    if (installed) {
      logWarn("插件已经被安装了");
      return MediaPlayer;
    }
    plugins.push(ctor);

    return MediaPlayer;
  }

  $options: PlayerOptionsParams;

  $eventBus = new EventEmit();

  $i18n: any;

  $isMobile = isMobile();

  $rootElement: HTMLElement;

  private _videoPlayerInstance: VideoPlayer | null;

  private _videoTipInstance: VideoTip | null;

  private _videoControlsInstance: VideoControls | null;

  get duration() {
    return this._videoPlayerInstance?.$duration ?? 0;
  }

  // 音量
  get volume() {
    return this._videoPlayerInstance?.$volume ?? 1;
  }

  get paused() {
    return this._videoPlayerInstance?.$paused;
  }

  get currentTime() {
    return this._videoPlayerInstance?.$currentTime ?? 0;
  }

  get videoElement() {
    return this._videoPlayerInstance?.$videoElement;
  }

  constructor(options: PlayerOptions) {
    this.$options = mergeConfig(
      options,
      MediaPlayer.globalConfig
    ) as PlayerOptionsParams;

    this._normalOptions();
    this._initI18n();
    this._initLayout();
    this._initComponents();
  }

  // 格式化一些参数
  private _normalOptions() {
    const options = this.$options;
    if (isString(options.el)) {
      options.el = document.querySelector(options.el) as HTMLElement;
    }

    if (isUndef(options.el)) {
      throw new TypeError("el 不存在");
    }
  }

  // 初始化i18n
  private _initI18n() {
    const i18n = initLocale();
    const { lang, customLanguage } = this.$options;
    if (!isUndef(lang)) {
      // 设置语言
      i18n.setLang(lang);
    }
    if (!isUndef(customLanguage?.MediaPlayer)) {
      // 使用自定义语言包
      i18n.use(customLanguage?.MediaPlayer);
    }
    this.$i18n = i18n;
  }

  // 初始化布局模板
  private _initLayout() {
    const html = LayoutTpl();
    this.$rootElement = parseHtmlToDom(html);
    this.$options.el.appendChild(this.$rootElement);
  }

  // 初始化组件
  private _initComponents() {
    this._videoPlayerInstance = new VideoPlayer(this, this.$rootElement);
    const controls = this.$options.controls;
    if (controls) {
      const compList = [
        { ctor: VideoTip, init: controls.tip, key: "_videoTipInstance" },
        {
          ctor: VideoControls,
          init: controls.controlBar,
          key: "_videoControlsInstance"
        },
        { ctor: VideoMask, init: controls.videoMask },
        { ctor: VideoLoading, init: controls.loading },
        {
          ctor: MobilePlayButton,
          init: controls.mobilePlayButton && this.$isMobile
        }
      ];
      compList.forEach((item) => {
        if (item.init) {
          if (item.key) {
            (this as any)[item.key] = new item.ctor(this, this.$rootElement);
          } else {
            new item.ctor(this, this.$rootElement);
          }
        }
      });
    }

    if (this.$options.hotkey && !this.$isMobile) {
      new ShortcutKey(this);
    }
  }

  seek(time: number) {
    this._videoPlayerInstance?.$seek(time);
  }

  play() {
    this._videoPlayerInstance?.$play();
  }

  pause() {
    this._videoPlayerInstance?.$pause();
  }

  toggle() {
    this._videoPlayerInstance?.$toggle();
  }

  setVolume(volume: number) {
    this._videoPlayerInstance?.$setVolume(volume);
  }

  setNotice(tip: string, time?: number) {
    this._videoTipInstance?.$setNotice(tip, time);
  }

  setSpeed(speed: number) {
    this._videoPlayerInstance?.$setSpeed(speed);
  }

  switchDefinition(index: number) {
    this._videoPlayerInstance?.$switchDefinition(index);
  }

  hideControls() {
    this._videoControlsInstance?.$hideControls();
  }

  showControls() {
    this._videoControlsInstance?.$showControls();
  }

  toggleControls() {
    this._videoControlsInstance?.$toggleControls();
  }

  // 全屏
  // get fullScreen() {
  //   return {
  //     request: (type: string) => {
  //       this.?.fullScreen.request(type);
  //     },
  //     cancel: (type: string) => {
  //       this.?.fullScreen.cancel(type);
  //     }
  //   };
  // }

  // 对外的
  $on(eventName: string, handler: Function) {
    this.$eventBus.$on(eventName, handler);
  }

  $emit(eventName: string, data?: any) {
    this.$eventBus.$emit(eventName, data);
  }

  $once(eventName: string, handler: Function) {
    this.$eventBus.$on(eventName, handler);
  }

  $off(eventName: string, handler?: Function) {
    this.$eventBus.$off(eventName, handler);
  }

  destroy() {
    this.$eventBus.$emit(PlayerEvents.DESTROY);
    this.$eventBus.clear();
    this._videoPlayerInstance = null;
    this._videoTipInstance = null;
    this.$rootElement.remove();
    (this as any).$rootElement = null;
  }
}

export default MediaPlayer;
