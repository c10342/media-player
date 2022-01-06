import "./styles/index.scss";
import {
  EventEmit,
  isBoolean,
  isMobile,
  isPlainObject,
  isString,
  isUndef,
  LangTypeEnum,
  logWarn,
  MOBILEPLUGIN,
  parseHtmlToDom,
  PCPLUGIN,
  PLUGINNAME
} from "@lin-media/utils";
import defaultOptions from "./config/default-config";
import {
  LangOptions,
  PlayerOptions,
  PlayerOptionsParams,
  PluginsOptions
} from "./types";
import { getPluginName, mergeConfig } from "./utils/index";
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
    const plugins = this.globalConfig.plugins ?? [];
    const installed = plugins?.some((plugin) => {
      return getPluginName(plugin) === getPluginName(ctor);
    });
    if (installed) {
      logWarn("插件已经被安装了");
      return MediaPlayer;
    }
    plugins?.push(ctor);

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
    const controls = this.$options.controls as any;
    if (isPlainObject(controls)) {
      const compList = [
        { ctor: VideoPlayer, init: controls[VideoPlayer[PLUGINNAME]] },
        {
          ctor: ShortcutKey,
          init: !this.$isMobile && controls[ShortcutKey[PLUGINNAME]]
        },
        {
          ctor: DomResizeObserver,
          init: controls[DomResizeObserver[PLUGINNAME]]
        },
        { ctor: VideoTip, init: controls[VideoTip[PLUGINNAME]] },
        {
          ctor: VideoControls,
          init: controls[VideoControls[PLUGINNAME]]
        },
        { ctor: VideoMask, init: controls.VideoMask },
        { ctor: VideoLoading, init: controls.VideoLoading },
        {
          ctor: VideoFloatButton,
          init: controls[VideoFloatButton[PLUGINNAME]]
        }
      ];
      compList.forEach((item) => {
        if (item.init) {
          const name = item.ctor[PLUGINNAME];
          this.$children[name] = new item.ctor(this, this.$rootElement);
        }
      });
    }
  }

  // 初始化插件
  private _initPlugins() {
    const options = this.$options;
    const plugins = options.plugins;
    const mobileEnv = this.$isMobile;
    const pcEnv = !mobileEnv;
    plugins
      ?.filter((ctor: any) => {
        const mobilePlugin = ctor[MOBILEPLUGIN];
        const pcPlugin = ctor[PCPLUGIN];
        if (mobileEnv) {
          return isBoolean(mobilePlugin) ? mobilePlugin : true;
        } else if (pcEnv) {
          return isBoolean(pcPlugin) ? pcPlugin : true;
        }
        return false;
      })
      .forEach((ctor: any) => {
        const pluginName = getPluginName(ctor);
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
