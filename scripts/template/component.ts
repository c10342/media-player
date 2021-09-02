import MediaPlayer, { PlayerEvents } from "@lin-media/player";

interface HighlightOptions {
  [key: string]: any;
}

const pluginName = "pluginName";

const defaultOptions = {};

class Highlight {
  // 插件名称.
  static pluginName = pluginName;
  // 播放器的dom
  private el: HTMLElement;
  // 播放器实例
  private instance: MediaPlayer;

  private options: HighlightOptions;

  constructor(el: HTMLElement, instance: MediaPlayer) {
    // 保存一下播放器给来的参数
    this.el = el;
    this.instance = instance;
    // 合并默认参数
    const options = this.instance.options[pluginName] ?? {};
    this.options = { ...defaultOptions, ...options };
    // 开始初始化
    this.init();
    this.initListener();
    // 挂载方法给外部用
    this.initMethods();
  }

  private initMethods() {
    Object.defineProperty(this.instance, "highlight", {
      get: () => {
        return {
          // ...
        };
      }
    });
  }

  private initListener() {
    // 销毁
    this.instance.$on(PlayerEvents.DESTROY, () => {
      // ...
    });
  }

  // 初始化
  private init() {
    // ...
  }
}

export default Highlight;
