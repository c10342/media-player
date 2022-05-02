import { EventEmit, isUndef, logError, parseHtmlToDom } from "@lin-media/utils";
import "./styles/index.scss";
import {
  registerComponent,
  removeComponent,
  getComponent
} from "./global-api/component";
import { useHook, removeHook, forEachHook } from "./global-api/hook";
import { registerPlugin, removePlugin, getPlugin } from "./global-api/plugin";

import LayoutTpl from "./templates/layout";

import { PlayerEvents, VideoEvents } from "./config/event";
import defaultOptions from "./config/defaults";
import mergeConfig from "./utils/merge-config";
import initLocale from "./locale";
import {
  destroyComponents,
  destroyPlugins,
  initComponents,
  initPlugins
} from "./utils/helper";
import {
  HookCallback,
  HookType,
  ComponentClass,
  LangType,
  PlayerConfig,
  ComponentOptions,
  FullscreenType,
  PluginOptions,
  PluginClass,
  SourceHandleCallback,
  TechOptions,
  TechClass,
  SourceItem
} from "./types/index";

import { useSource, removeSource } from "./global-api/source";
import Component from "./components/component";
import Plugin from "./plugins/plugin";
import { getTech, registerTech, removeTech } from "./global-api/tech";
import Tech from "./techs/tech";

class Player extends EventEmit {
  static Events = {
    ...PlayerEvents,
    ...VideoEvents
  };
  // 全局配置
  static defaults = defaultOptions;
  //   设置中英文，zh/en
  static setLang(lang: LangType) {
    this.defaults.lang = lang;
    return this;
  }

  // 自定义语言包
  static useLang(customLanguage: Record<string, any>) {
    this.defaults.customLanguage = customLanguage;
    return this;
  }

  static registerTech(
    name: string,
    tech: TechClass,
    options: TechOptions = {}
  ) {
    registerTech(name, tech, options);
    return this;
  }

  static removeTech(name: string) {
    removeTech(name);
    return this;
  }

  static getTech(name: string) {
    return getTech(name);
  }

  static useHook(hook: HookType, callback: HookCallback) {
    useHook(hook, callback);
    return this;
  }
  static removeHook(hook: HookType, callback?: HookCallback) {
    removeHook(hook, callback);
    return this;
  }

  static registerPlugin(
    name: string,
    plugin: PluginClass,
    options: PluginOptions = {}
  ) {
    registerPlugin(name, plugin, options);
    return this;
  }

  static removePlugin(name: string) {
    removePlugin(name);
    return this;
  }

  static getPlugin<Options>(name: string) {
    return getPlugin<Options>(name);
  }

  static registerComponent(
    name: string,
    component: ComponentClass,
    options: ComponentOptions = {}
  ) {
    registerComponent(name, component, {
      parentComponent: "Player",
      ...options
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

  static useSource(type: string, callback: SourceHandleCallback) {
    useSource(type, callback);
    return this;
  }

  static removeSource(type: string, callback: SourceHandleCallback) {
    removeSource(type, callback);
    return this;
  }

  plugins: { [key: string]: Plugin } = {};
  components: { [key: string]: Component } = {};
  options: PlayerConfig = {} as any;
  rootElement: HTMLElement;
  tech: Tech | null = null;
  i18n: any = null;
  private readyCallback: Array<Function> = [];
  private isReady = false;
  videoElement: HTMLVideoElement | null;
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
    chain.push(this.initComponents.bind(this));
    forEachHook("afterSetup", (fn) => {
      chain.push(fn);
    });
    chain.push(this.triggerReady.bind(this));

    let p: any = Promise.resolve(options);

    while (chain.length) {
      p = p.then(chain.shift());
    }
    p.catch((error: any) => {
      this.$emit(PlayerEvents.PLAYERERROR, error);
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

  private initComponents() {
    initComponents("Player", this, this.rootElement, this);
    return this;
  }

  private destroyPlugins() {
    destroyPlugins(this);
    this.plugins = {};
  }
  private destroyComponents() {
    destroyComponents(this.components, this);
    this.components = {};
  }

  destroyTech() {
    if (this.tech) {
      const name = (this.tech.constructor as any).id;
      this.$emit(PlayerEvents.BEFORETECHDESTROY, {
        tech: this.tech,
        name
      });
      this.tech.destroy();
      this.tech = null;
      this.$emit(PlayerEvents.BEFORETECHDESTROY, {
        name
      });
    }
  }

  private runReadyCallback() {
    const list = this.readyCallback.slice();
    if (list.length === 0) {
      return;
    }
    this.readyCallback = [];
    list.forEach((fn) => fn());
  }
  private triggerReady() {
    if (this.isReady) {
      return this;
    }
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

  get videoReadyState() {
    logError("prop videoReadyState is not defined");
    return 0;
  }

  get mediaError(): MediaError | null {
    logError("prop mediaError is not defined");
    return null;
  }

  get sourceItem(): SourceItem | null {
    logError("prop sourceItem is not defined");
    return null;
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

  showError(e: Error | string) {
    logError("method showError is not defined");
    return this;
  }

  hideError() {
    logError("method hideError is not defined");
    return this;
  }

  destroy() {
    this.$emit(PlayerEvents.DESTROY);
    this.destroyPlugins();
    this.destroyComponents();
    this.destroyTech();
    this.clear();
    this.tech?.destroy();
    this.resetData();
  }
}

export default Player;
