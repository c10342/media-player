import "./styles/index.scss";
import {
  EventEmit,
  isArray,
  isMobile,
  isPlainObject,
  isString,
  isUndef,
  LangTypeEnum,
  logWarn,
  parseHtmlToDom
} from "@lin-media/utils";
import defaultOptions from "./config/default-config";
import {
  LangOptions,
  PlayerOptions,
  PlayerOptionsParams,
  PluginClass,
  PluginsOptions
} from "./types";
import { mergeConfig } from "./utils/index";
import initLocale from "./locale/index";
import LayoutTpl from "./templates/layout";
import VideoPlayer from "./components/video-player";
import VideoControls from "./components/video-controls";
import VideoMask from "./components/video-mask";
import VideoLoading from "./components/video-loading";
import VideoTip from "./components/video-tip";
import ShortcutKey from "./components/shortcut-key";
import VideoFloatButton from "./components/video-float-button";
import DomResizeObserver from "./components/resize-observer";
import {
  MessageChannelEvents,
  PlayerEvents,
  VideoEvents
} from "./config/event";
import {
  DOMRESIZEOBSERVER,
  SHORTCUTKEY,
  VIDEOCONTROLS,
  VIDEOFLOATBUTTON,
  VIDEOLOADING,
  VIDEOMASK,
  VIDEOPLAYER,
  VIDEOTIP
} from "./config/constant";

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
  static use(ctor: PluginClass) {
    if (!ctor.pluginName) {
      logWarn(`${ctor} 必须要提供 pluginName 静态属性`);
      return;
    }
    const plugins = this.globalConfig.plugins ?? [];
    const installed = plugins?.some((plugin) => {
      return plugin.pluginName === ctor.pluginName;
    });
    if (installed) {
      logWarn(`${ctor.pluginName} 插件已经被安装了`);
      return MediaPlayer;
    }
    plugins?.push(ctor);

    if (!isArray(this.globalConfig.plugins)) {
      this.globalConfig.plugins = plugins;
    }

    return MediaPlayer;
  }

  $options: PlayerOptionsParams;

  $eventBus = new EventEmit();

  $i18n: any;

  $isMobile = isMobile();

  $rootElement: HTMLElement;

  $plugins: PluginsOptions = {};

  $children: PluginsOptions = {};

  videoElement: HTMLVideoElement | null;

  get duration() {
    return this.videoElement?.duration ?? 0;
  }

  // 音量
  get volume() {
    return this.videoElement?.volume ?? 1;
  }

  get paused() {
    return this.videoElement?.paused ?? false;
  }

  get currentTime() {
    return this.videoElement?.currentTime ?? 0;
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
    this._initVideoElement();
    this._initPlugins();
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

    if (isArray(options.plugins)) {
      options.plugins.forEach((plugin) => {
        if (!plugin.pluginName) {
          logWarn(`${plugin} 必须要提供 pluginName 静态属性`);
        }
      });
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
    if (!isUndef(customLanguage?.player)) {
      // 使用自定义语言包
      i18n.use(customLanguage?.player);
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
    const controls = this.$options.controls;
    if (isPlainObject(controls)) {
      const compList = [
        { ctor: VideoPlayer, init: controls[VIDEOPLAYER] },
        {
          ctor: ShortcutKey,
          init: !this.$isMobile && controls[SHORTCUTKEY]
        },
        {
          ctor: DomResizeObserver,
          init: controls[DOMRESIZEOBSERVER]
        },
        { ctor: VideoTip, init: controls[VIDEOTIP] },
        {
          ctor: VideoControls,
          init: controls[VIDEOCONTROLS]
        },
        { ctor: VideoMask, init: controls[VIDEOMASK] },
        { ctor: VideoLoading, init: controls[VIDEOLOADING] },
        {
          ctor: VideoFloatButton,
          init: controls[VIDEOFLOATBUTTON]
        }
      ];
      compList.forEach((item) => {
        if (item.init) {
          const name = item.ctor.pluginName;
          this.$children[name] = new item.ctor(this, this.$rootElement);
        }
      });
    }
  }

  // 初始化插件
  private _initPlugins() {
    const options = this.$options;
    const plugins = options.plugins;
    plugins?.forEach((ctor: PluginClass) => {
      const pluginName = ctor.pluginName;
      if (pluginName && options[pluginName] !== false) {
        this.$plugins[pluginName] = new ctor(this, this.$rootElement);
      }
    });
  }

  private _initVideoElement() {
    this.videoElement = this.$rootElement.querySelector(".player-video");
    this.$eventBus.$on(PlayerEvents.SWITCH_DEFINITION_END, () => {
      // 清晰度切换完成之后需要刷新videoElement
      this.videoElement = this.$rootElement.querySelector(".player-video");
    });
  }

  seek(time: number) {
    this.$eventBus.$emit(MessageChannelEvents.SEEK, time);
  }

  play() {
    this.$eventBus.$emit(MessageChannelEvents.PLAY);
  }

  pause() {
    this.$eventBus.$emit(MessageChannelEvents.PAUSE);
  }

  toggle() {
    this.$eventBus.$emit(MessageChannelEvents.TOGGLE);
  }

  setVolume(volume: number) {
    this.$eventBus.$emit(MessageChannelEvents.SETVOLUME, volume);
  }

  setNotice(tip: string, time?: number) {
    this.$eventBus.$emit(MessageChannelEvents.SETNOTICE, tip, time);
  }

  setSpeed(speed: number) {
    this.$eventBus.$emit(MessageChannelEvents.SETSPEED, speed);
  }

  switchDefinition(index: number) {
    this.$eventBus.$emit(MessageChannelEvents.SWITCHDEFINITION, index);
  }

  hideControls() {
    this.$eventBus.$emit(MessageChannelEvents.HIDECONTROLS);
  }

  showControls() {
    this.$eventBus.$emit(MessageChannelEvents.SHOWCONTROLS);
  }

  toggleControls() {
    this.$eventBus.$emit(MessageChannelEvents.TOGGLECONTROLS);
  }

  // 全屏
  get fullScreen() {
    return {
      request: (type: string) => {
        this.$eventBus.$emit(MessageChannelEvents.FULLSCREENREQUEST, type);
      },
      cancel: (type: string) => {
        this.$eventBus.$emit(MessageChannelEvents.FULLSCREENCANCEL, type);
      }
    };
  }

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
    this.$plugins = {};
    this.$children = {};
    this.videoElement = null;
    this.$rootElement.remove();
    (this as any).$rootElement = null;
  }
}

export default MediaPlayer;
