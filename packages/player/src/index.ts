import "./style/index.scss";
import Player from "./constructor";
import { LangOptions, PlayerOptions } from "./types";
import i18n from "./locale";
import { isArray, isString, isUndef, logWarn } from "@media/utils";

function getPluginName(ctor: any) {
  return ctor.pluginName || ctor.name;
}

const defaultOptions = {
  live: false,
  hotkey: true
};

class MediaPlayer {
  static useLang(lang: LangOptions) {
    i18n.use(lang);
    return Player;
  }

  static setLang(lang: string) {
    i18n.setLang(lang);
    return Player;
  }

  static setI18n(fn: Function) {
    i18n.i18n(fn);
    return Player;
  }

  // 插件列表
  static pluginsList: Array<Function> = [];
  // 注册插件
  static use(ctor: Function) {
    const installed = MediaPlayer.pluginsList.some((plugin) => {
      return getPluginName(plugin) === getPluginName(ctor);
    });
    if (installed) {
      logWarn("插件已经被安装了");
      return MediaPlayer;
    }
    MediaPlayer.pluginsList.push(ctor);

    return MediaPlayer;
  }

  // 往原型上拓展方法或属性
  static extend(obj: Record<string, any>) {
    Object.keys(obj).forEach((key) => {
      (MediaPlayer as any).prototype[key] = obj[key];
    });
    return MediaPlayer;
  }

  private options: PlayerOptions;
  private playerInstance: Player | null;
  plugins: Record<string, any> = {};
  constructor(options: PlayerOptions) {
    this.options = { ...defaultOptions, ...options };
    this.initParams();
    this.checkParams();
    this.initPlayer();
    this.applyPlugins();
  }

  private initPlayer() {
    this.playerInstance = new Player(this.options);
  }

  private initParams() {
    let { el } = this.options;
    if (isString(el)) {
      el = document.querySelector(el) as HTMLElement;
    }
    if (!el) {
      throw new TypeError("找不到 el");
    }
    this.options.el = el;
  }

  private checkParams() {
    const videoList = this.options.videoList;
    if (isUndef(videoList)) {
      throw new TypeError("videoList 不能为空");
    }
    if (!isArray(videoList)) {
      throw new TypeError("videoList 必须是一个数组");
    }
    if (videoList.length === 0) {
      throw new TypeError("videoList 长度需要大于0");
    }
  }

  $on(eventName: string, handler: Function) {
    this.playerInstance?.$on(eventName, handler);
    return this;
  }
  $emit(eventName: string, data?: any) {
    this.playerInstance?.$emit(eventName, data);
    return this;
  }
  $once(eventName: string, handler: Function) {
    this.playerInstance?.$once(eventName, handler);
    return this;
  }
  $off(eventName: string, handler?: Function) {
    this.playerInstance?.$off(eventName, handler);
    return this;
  }

  play() {
    this.playerInstance?.play();
    return this;
  }

  pause() {
    this.playerInstance?.pause();
    return this;
  }

  seek(time: number) {
    this.playerInstance?.seek(time);
    return this;
  }

  setNotice(text: string, time?: number) {
    this.playerInstance?.setNotice(text, time);
    return this;
  }

  switchDefinition(index: number) {
    this.playerInstance?.switchDefinition(index);
    return this;
  }

  setSpeed(playbackRate: number) {
    this.playerInstance?.setSpeed(playbackRate);
    return this;
  }

  setVolume(volume: number) {
    this.playerInstance?.setVolume(volume);
    return this;
  }

  toggle() {
    this.playerInstance?.toggle();
    return this;
  }

  get videoElement() {
    return this.playerInstance?.videoElement;
  }

  get paused() {
    return this.playerInstance?.paused;
  }

  get currentTime() {
    return this.playerInstance?.currentTime;
  }

  get duration() {
    return this.playerInstance?.duration;
  }

  get volume() {
    return this.playerInstance?.volume;
  }

  // 全屏
  get fullScreen() {
    return {
      request: (type: string) => {
        this.playerInstance?.fullScreen.request(type);
      },
      cancel: (type: string) => {
        this.playerInstance?.fullScreen.cancel(type);
      }
    };
  }

  private applyPlugins() {
    const el = (this.options.el as HTMLElement).querySelector(
      ".player-container"
    );
    MediaPlayer.pluginsList.forEach((Ctor: any) => {
      const instance = new Ctor(el, this, MediaPlayer);
      const pluginName = getPluginName(Ctor);
      this.plugins[pluginName] = instance;
    });
  }

  destroy() {
    this.playerInstance?.destroy();
    this.playerInstance = null;
  }
}

export default MediaPlayer;
