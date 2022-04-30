import { EventEmit, EventManager } from "@lin-media/utils";
import Player from "../player";
import { PlayerConfig } from "../types/player";
import { destroyComponents, initComponents } from "../utils/helper";

class Component<T extends Record<string, any> = {}> extends EventEmit {
  static id = "Component";

  static shouldInit(options: PlayerConfig) {
    return true;
  }

  // 播放器实例
  player: Player;
  // 插槽
  slotElement: HTMLElement;
  components: { [key: string]: Component } = {};
  // 组件根元素
  rootElement: HTMLElement;
  // dom事件管理器
  eventManager = new EventManager();
  options: T = {} as T;
  parentComponent: any = null;
  private isReady = false;
  private readyCallback: Array<Function> = [];
  constructor(
    player: Player,
    slotElement: HTMLElement,
    options: T = {} as T,
    parentComponent: any
  ) {
    super();
    this.player = player;
    this.slotElement = slotElement;
    this.options = options;
    this.parentComponent = parentComponent;
    this.player.ready(this.onPlayerReady.bind(this));
  }

  onPlayerReady() {
    // todo
  }

  destroyComponents() {
    destroyComponents(this.components, this.player);
    this.components = {};
  }
  destroyElement() {
    if (this.rootElement) {
      this.rootElement.remove();
      this.rootElement = null as any;
    }
  }
  private initComponents() {
    const id = (this.constructor as any).id;
    initComponents(id, this.player, this.rootElement, this);
  }

  ready(fn: Function) {
    if (this.isReady) {
      fn();
    } else {
      this.readyCallback.push(fn);
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

  triggerReady() {
    if (this.isReady) {
      return;
    }
    this.initComponents();
    this.isReady = true;
    this.$emit("ready");
    this.runReadyCallback();
  }

  destroy() {
    this.destroyComponents();
    this.destroyElement();
    this.eventManager.removeEventListener();
    this.clear();
  }
}

export default Component;
