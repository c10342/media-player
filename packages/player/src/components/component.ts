import { EventEmit, EventManager, isFunction } from "@lin-media/utils";
import { registerComponent } from "../global-api/component";
import Player from "../player";
import { ComponentClass, DefaultComponentOptions } from "../types/component";
import { PlayerConfig } from "../types/player";
import { destroyComponents, initComponents } from "../utils/helper";

class Component<T extends Record<string, any> = {}> extends EventEmit {
  static id = "Component";

  static shouldInit(options: PlayerConfig) {
    return true;
  }

  static registerComponent(
    name: string,
    component: ComponentClass,
    options?: DefaultComponentOptions
  ) {
    registerComponent(name, component, {
      ...options,
      parentComponent: this.id
    });
    return this;
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
  constructor(player: Player, slotElement: HTMLElement, options: T = {} as T) {
    super();
    this.player = player;
    this.slotElement = slotElement;
    this.options = options;
    const onPlayerReady = (this as any).onPlayerReady;
    if (isFunction(onPlayerReady)) {
      this.player.ready(onPlayerReady.bind(this));
    }
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
  initComponent(name: string) {
    initComponents(name, this.player, this.rootElement, this.components);
  }
  destroy() {
    this.destroyComponents();
    this.destroyElement();
    this.eventManager.removeEventListener();
    this.clear();
  }
}

export default Component;
