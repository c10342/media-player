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
  handleMiddleware,
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
  SourceItem,
  PlayerNextCallbackFn
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
  constructor(options: PlayerConfig) {
    super();
    this.init(options);
  }

  private init(options: PlayerConfig) {
    const chain: Array<Function> = [];
    forEachHook("beforeSetup", (fn) => {
      chain.push(fn);
    });
    chain.push(this.initOptions);
    chain.push(this.initI18n);
    chain.push(this.initPlugins);
    chain.push(this.initLayout);
    chain.push(this.initComponents);
    forEachHook("afterSetup", (fn) => {
      chain.push(fn);
    });
    chain.push(this.triggerReady);

    handleMiddleware(chain, this, options);
  }

  private initI18n(options: PlayerConfig, next: PlayerNextCallbackFn) {
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
    next(options);
  }

  private initOptions(options: PlayerConfig, next: PlayerNextCallbackFn) {
    options = mergeConfig(options, Player.defaults) as PlayerConfig;
    this.options = options;
    next(options);
  }

  private initPlugins(options: PlayerConfig, next: PlayerNextCallbackFn) {
    initPlugins(this);
    next(options);
  }

  private initLayout(options: PlayerConfig, next: PlayerNextCallbackFn) {
    const html = LayoutTpl();
    this.rootElement = parseHtmlToDom(html);
    this.options.el?.appendChild(this.rootElement);
    next(options);
  }

  private initComponents(options: PlayerConfig, next: PlayerNextCallbackFn) {
    initComponents("Player", this, this.rootElement, this);
    // initComponents为最后的初始化步骤，需要传入player实例参数，否则afterSetup是获取不到player实例的
    next(this);
  }

  private destroyPlugins() {
    destroyPlugins(this);
    this.plugins = {};
  }
  private destroyComponents() {
    destroyComponents(this.components);
    this.components = {};
  }

  destroyTech() {
    if (this.tech) {
      this.tech.destroy();
      this.tech = null;
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
    this.$emit(PlayerEvents.READY);
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

  private triggerDestroy() {
    this.$emit(PlayerEvents.DESTROY, this);
  }

  ready(fn: Function) {
    if (this.isReady) {
      fn();
    } else {
      this.readyCallback.push(fn);
    }
    return this;
  }

  // 以下所有属性和方法都是由组件提供的，这里填写是为了做一个类型的声明
  get currentTime(): null | number {
    return null;
  }

  get volume(): null | number {
    return null;
  }

  get paused(): null | boolean {
    return null;
  }

  get duration(): null | number {
    return null;
  }

  get videoReadyState(): null | number {
    return null;
  }

  get mediaError(): MediaError | null {
    return null;
  }

  get sourceItem(): SourceItem | null {
    return null;
  }

  get videoElement(): HTMLVideoElement | null {
    return null;
  }

  toggle() {
    return this;
  }
  play() {
    return this;
  }
  pause() {
    return this;
  }

  seek(time: number) {
    return this;
  }
  setVolume(volume: number) {
    return this;
  }
  toggleControls() {
    return this;
  }
  setNotice(message: string, time?: number) {
    return this;
  }
  setSpeed(value: number) {
    return this;
  }
  switchDefinition(index: number) {
    return this;
  }
  requestFullscreen(type: FullscreenType) {
    return this;
  }

  cancelFullscreen(type: FullscreenType) {
    return this;
  }
  requestPictureInPicture() {
    return this;
  }
  exitPictureInPicture() {
    return this;
  }

  showError(data: { message: string; [key: string]: any }) {
    return this;
  }

  hideError() {
    return this;
  }

  showControls() {
    return this;
  }

  hideControls() {
    return this;
  }

  destroy() {
    const chain: Array<Function> = [];
    forEachHook("beforeDestroy", (fn) => {
      chain.push(fn);
    });
    const fns = [
      this.triggerDestroy,
      this.destroyPlugins,
      this.destroyComponents,
      this.destroyTech,
      this.clear,
      this.resetData
    ];
    fns.forEach((fn) => {
      const func = (data: any, next: PlayerNextCallbackFn<any>) => {
        fn.call(this);
        next(data);
      };
      chain.push(func);
    });
    forEachHook("afterDestroy", (fn) => {
      chain.push(fn);
    });
    handleMiddleware(chain, this, this);
  }
}

export default Player;
