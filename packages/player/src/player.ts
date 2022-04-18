import {
  EventEmit,
  isFunction,
  isUndef,
  LangTypeEnum,
  logError,
  parseHtmlToDom
} from "@lin-media/utils";
import "./styles/index.scss";
import {
  registerComponent,
  removeComponent,
  getComponent
} from "./global-api/component";
import {
  registerHook,
  removeHook,
  registerHookOnce,
  forEachHook
} from "./global-api/hook";
import { registerPlugin, removePlugin, getPlugin } from "./global-api/plugin";

import LayoutTpl from "./templates/layout";

import { PlayerEvents, VideoEvents } from "./config/event";
import defaultOptions from "./config/defaults";
import mergeConfig from "./utils/merge-config";
import initLocale from "./locale";
import { destroyComponents, initComponents, initPlugins } from "./utils/helper";
import { HookCallback, HookType } from "./types/hook";
import { DefaultPluginOptions, PluginApi } from "./types/plugin";
import { ClassType } from "./types";
import {
  ComponentClass,
  DefaultComponentOptions,
  FullscreenType
} from "./types/component";
import { PlayerConfig } from "./types/player";
import {
  registerOnceSource,
  registerSource,
  removeSource
} from "./global-api/source";
import { SourceHandleCallback } from "./types/source";

class Player extends EventEmit {
  static Events = {
    ...PlayerEvents,
    ...VideoEvents
  };
  // 全局配置
  static defaults = defaultOptions;
  //   设置中英文，zh/en
  static setLang(lang: LangTypeEnum) {
    this.defaults.lang = lang;
    return this;
  }

  // 自定义语言包
  static useLang(customLanguage: Record<string, any>) {
    this.defaults.customLanguage = customLanguage;
    return this;
  }

  static registerHook(hook: HookType, callback: HookCallback) {
    registerHook(hook, callback);
    return this;
  }
  static removeHook(hook: HookType, callback?: HookCallback) {
    removeHook(hook, callback);
    return this;
  }
  static registerHookOnce(hook: HookType, callback: HookCallback) {
    registerHookOnce(hook, callback);
    return this;
  }

  static registerPlugin(
    name: string,
    plugin: ClassType<PluginApi>,
    options: DefaultPluginOptions = {}
  ) {
    registerPlugin(name, plugin, options);
    return this;
  }

  static removePlugin(name: string) {
    removePlugin(name);
    return this;
  }

  static getPlugin(name: string) {
    return getPlugin(name);
  }

  static registerComponent(
    name: string,
    component: ComponentClass,
    options: DefaultComponentOptions = {}
  ) {
    registerComponent(name, component, {
      ...options,
      parentComponent: "Player"
    });
    return this;
  }

  static removeComponent(name: string) {
    removeComponent(name);
    return this;
  }

  static getComponent<Options = any>(name: string) {
    return getComponent<Options>(name);
  }

  static registerSource(type: string, callback: SourceHandleCallback) {
    registerSource(type, callback);
    return this;
  }

  static registerOnceSource(type: string, callback: SourceHandleCallback) {
    registerOnceSource(type, callback);
    return this;
  }

  static removeSource(type: string, callback?: SourceHandleCallback) {
    removeSource(type, callback);
    return this;
  }

  plugins: { [key: string]: PluginApi } = {};
  components: { [key: string]: ComponentClass } = {};
  options: PlayerConfig = {} as any;
  rootElement: HTMLElement;
  tech: any = null;
  i18n: any = null;
  private readyCallback: Array<Function> = [];
  private isReady = false;
  constructor(options: PlayerConfig) {
    super();
    this.init(options);
  }

  private init(options: PlayerConfig) {
    const chain: Array<Function> = [];
    forEachHook("beforeSetup", (fn) => {
      chain.push(fn);
    });
    chain.push(this.initOptions.bind(this));
    chain.push(this.initI18n.bind(this));
    chain.push(this.initPlugins.bind(this));
    chain.push(this.initLayout.bind(this));
    chain.push(this.initComponent.bind(this));
    forEachHook("afterSetup", (fn) => {
      chain.push(fn);
    });
    chain.push(this.onReady.bind(this));

    let p: any = Promise.resolve(options);

    while (chain.length) {
      p = p.then(chain.shift());
    }
    p.catch((error: any) => {
      this.$emit("error", error);
      logError(error);
    });
  }

  private initI18n() {
    const i18n = initLocale();
    const { lang, customLanguage } = this.options;
    if (!isUndef(lang)) {
      // 设置语言
      i18n.setLang(lang);
    }
    if (!isUndef(customLanguage?.Player)) {
      // 使用自定义语言包
      i18n.use(customLanguage?.Player);
    }
    this.i18n = i18n;
    return this;
  }

  private initOptions(options: PlayerConfig) {
    this.options = mergeConfig(options, Player.defaults) as PlayerConfig;
    return this;
  }

  private initPlugins() {
    initPlugins(this);
    return this;
  }

  private initLayout() {
    const html = LayoutTpl();
    this.rootElement = parseHtmlToDom(html);
    this.options.el?.appendChild(this.rootElement);
    return this;
  }

  private initComponent() {
    initComponents("Player", this, this.rootElement, this.components);
    return this;
  }

  private destroyPlugins() {
    Object.keys(this.plugins).forEach((name) => {
      const plugin = this.plugins[name];
      this.$emit(`beforePluginDestroy:${name}`, plugin);
      if (isFunction(plugin.destroy)) {
        plugin.destroy();
      }
      this.$emit(`afterPluginDestroy:${name}`);
    });
    this.plugins = {};
  }
  private destroyComponents() {
    destroyComponents(this.components, this);
    this.components = {};
  }

  private runReadyCallback() {
    const list = this.readyCallback.slice();
    if (list.length === 0) {
      return;
    }
    this.readyCallback = [];
    list.forEach((fn) => fn());
  }
  private onReady() {
    this.isReady = true;
    this.$emit("ready");
    this.runReadyCallback();
    return this;
  }

  private resetData() {
    this.readyCallback = [];
    this.rootElement.remove();
    this.rootElement = null as any;
    this.tech = null;
    this.i18n = null;
    this.options = {} as any;
  }

  ready(fn: Function) {
    if (this.isReady) {
      fn();
    } else {
      this.readyCallback.push(fn);
    }
    return this;
  }

  get currentTime() {
    logError("prop currentTime is not defined");
    return 0;
  }

  get volume() {
    logError("prop volume is not defined");
    return 1;
  }

  get paused() {
    logError("prop paused is not defined");
    return true;
  }

  get duration() {
    logError("prop duration is not defined");
    return 0;
  }

  toggle() {
    logError("method toggle is not defined");
    return this;
  }
  play() {
    logError("method play is not defined");
    return this;
  }
  pause() {
    logError("method pause is not defined");
    return this;
  }

  seek(time: number) {
    logError("method seek is not defined");
    return this;
  }
  setVolume(volume: number) {
    logError("method setVolume is not defined");
    return this;
  }
  toggleControls() {
    logError("method toggleControls is not defined");
    return this;
  }
  setNotice(message: string, time?: number) {
    logError("method setNotice is not defined");
    return this;
  }
  setSpeed(value: number) {
    logError("method setSpeed is not defined");
    return this;
  }
  switchDefinition(index: number) {
    logError("method switchDefinition is not defined");
    return this;
  }
  requestFullscreen(type: FullscreenType) {
    logError("method requestFullscreen is not defined");
    return this;
  }

  cancelFullscreen(type: FullscreenType) {
    logError("method cancelFullscreen is not defined");
    return this;
  }
  requestPictureInPicture() {
    logError("method requestPictureInPicture is not defined");
    return this;
  }
  exitPictureInPicture() {
    logError("method exitPictureInPicture is not defined");
    return this;
  }

  destroy() {
    this.$emit(PlayerEvents.DESTROY);
    this.destroyPlugins();
    this.destroyComponents();
    this.clear();
    this.resetData();
  }
}

export default Player;
