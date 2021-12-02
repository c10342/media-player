import "./styles/index.scss";
import {
  EventEmit,
  isString,
  isUndef,
  LangTypeEnum,
  logWarn
} from "@lin-media/utils";
import defaultOptions from "./config/default-config";
import { LangOptions, PlayerOptions } from "./types";
import { getPluginName } from "./utils/index";
import initLocale from "./locale/index";
import LayoutTpl from "./templates/layout.art";
import VideoPlayer from "./components/video-player";
import VideoControls from "./components/video-controls";

interface PlayerOptionsParmas extends PlayerOptions {
  el: HTMLElement;
}

class MediaPlayer {
  static PlayerEvents = { DESTROY: "" };
  static VideoEvents = { LOADEDMETADATA: "" };
  $once(eventName: string, data: any) {
    // todo
  }

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

  $options: PlayerOptionsParmas;

  $eventBus = new EventEmit();

  $i18n: any;

  private _videoPlayerInstance: VideoPlayer;

  get duration() {
    return this._videoPlayerInstance.$duration;
  }

  constructor(options: PlayerOptions) {
    this.$options = options as PlayerOptionsParmas;
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
    const el = this.$options.el;
    el.innerHTML = html;
  }

  // 初始化组件
  private _initComponents() {
    const _querySelector = this._querySelector.bind(this);

    this._videoPlayerInstance = new VideoPlayer(
      this,
      _querySelector(".player-video-wrapper")
    );
    new VideoControls(this, _querySelector(".player-controls-slot"));
  }

  private _querySelector<T extends HTMLElement>(selector: string) {
    const el = this.$options.el;
    return el.querySelector(selector) as T;
  }

  seek(time: number) {
    this._videoPlayerInstance.$seek(time);
  }

  setNotice(tip: string) {
    // todo
  }

  // 对外的
  $on(eventName: string, handler: Function) {
    this.$eventBus.$on(eventName, handler);
  }

  $emit(eventName: string, data?: any) {
    this.$eventBus.$emit(eventName, data);
  }
}

export default MediaPlayer;
