import "./style/index.scss";
import Player from "./constructor";
import { LangOptions, PlayerOptions, PluginsType } from "./types";
import i18n from "./locale";
import {
  isArray,
  isString,
  isUndef,
  LangTypeEnum,
  logWarn
} from "@media/utils";

function getPluginName(ctor: any) {
  return ctor.pluginName || ctor.name;
}

function getPluginsList(globalPlugins: PluginsType, localPlugins: PluginsType) {
  const pluginsList = [...globalPlugins, ...localPlugins];
  const list: PluginsType = [];
  for (let i = 0; i < pluginsList.length; i++) {
    const plugin = pluginsList[i];
    const installed = list.some((ctor) => {
      return getPluginName(ctor) === getPluginName(plugin);
    });
    if (!installed) {
      list.push(plugin);
    }
  }
  return list;
}

const defaultOptions = {
  live: false,
  hotkey: true,
  autoplay: false,
  muted: false
};

class MediaPlayer {
  static lang = LangTypeEnum.zh;
  // 自定义语言包
  static useLang(lang: LangOptions) {
    i18n.use(lang);
    return Player;
  }
  // 设置中英文，zh/en
  static setLang(lang: LangTypeEnum) {
    i18n.setLang(lang);
    MediaPlayer.lang = lang;
    return Player;
  }
  // 自定义i18n处理函数
  static setI18n(fn: Function) {
    i18n.i18n(fn);
    return Player;
  }

  // 全局插件列表
  static pluginsList: PluginsType = [];

  // 全局注册插件
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

  // 往实例上拓展方法或属性，原本是打算在MediaPlayer原型上面进行扩展的，但是发现new多个之后会被覆盖
  extend(obj: Record<string, any>) {
    Object.keys(obj).forEach((key) => {
      Object.defineProperty(this, key, {
        get() {
          return obj[key];
        }
      });
    });
    return this;
  }

  options: PlayerOptions;
  // 实例
  private playerInstance: Player | null;
  // 存储插件实例
  plugins: Record<string, any> = {};
  constructor(options: PlayerOptions) {
    this.options = { ...defaultOptions, ...options };
    // 初始化参数
    this.initParams();
    // 检查参数
    this.checkParams();
    // 初始化播放器
    this.initPlayer();
    // 初始化插件
    this.applyPlugins();
  }

  private initPlayer() {
    this.playerInstance = new Player(this.options);
  }

  // 初始化相应的参数
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
  // 检查参数是否符合要求
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

  // 发布订阅
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
  // 播放
  play() {
    this.playerInstance?.play();
    return this;
  }
  // 暂停
  pause() {
    this.playerInstance?.pause();
    return this;
  }
  // 跳转时间
  seek(time: number) {
    this.playerInstance?.seek(time);
    return this;
  }
  // 设置通知
  setNotice(text: string, time?: number) {
    this.playerInstance?.setNotice(text, time);
    return this;
  }
  // 切换清晰度
  switchDefinition(index: number) {
    this.playerInstance?.switchDefinition(index);
    return this;
  }
  // 设置倍数
  setSpeed(playbackRate: number) {
    this.playerInstance?.setSpeed(playbackRate);
    return this;
  }
  // 设置音量
  setVolume(volume: number) {
    this.playerInstance?.setVolume(volume);
    return this;
  }
  // 切换播放状态
  toggle() {
    this.playerInstance?.toggle();
    return this;
  }
  // video标签元素
  get videoElement() {
    return this.playerInstance?.videoElement;
  }
  // 视频是否处于暂停
  get paused() {
    return this.playerInstance?.paused;
  }
  // 视频当前时间
  get currentTime() {
    return this.playerInstance?.currentTime;
  }
  // 视频总时长
  get duration() {
    return this.playerInstance?.duration;
  }
  // 当前音量
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
  // 应用插件
  private applyPlugins() {
    const el = (this.options.el as HTMLElement).querySelector(
      ".player-container"
    );
    // 合并全局插件和局部插件
    const plugins = getPluginsList(
      MediaPlayer.pluginsList || [],
      this.options.plugins || []
    );
    plugins.forEach((Ctor: any) => {
      const instance = new Ctor(el, this, MediaPlayer);
      const pluginName = getPluginName(Ctor);
      this.plugins[pluginName] = instance;
    });
  }
  // 销毁
  destroy() {
    this.playerInstance?.destroy();
    this.playerInstance = null;
    this.plugins = {};
  }
}

export default MediaPlayer;
