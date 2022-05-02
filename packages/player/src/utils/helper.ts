import { isFunction, isKeyInObject, isPlainObject } from "@lin-media/utils";
import Component from "../components/component";
import { PlayerEvents } from "../config/event";
import { forEachComponent } from "../global-api/component";
import { forEachPlugins } from "../global-api/plugin";
import Player from "../player";

export function initComponents(
  name: string,
  player: Player,
  rootElement: HTMLElement,
  currentInstance: Component | Player
) {
  const opts = player.options.components ?? {};
  forEachComponent(name, (name, Component, options) => {
    const init = (config: Record<string, any> = {}) => {
      const defaults = options.defaults;
      player.$emit(PlayerEvents.BEFORECOMPONENTSETUP, { name });
      const instance = new Component(
        player,
        rootElement,
        {
          ...defaults,
          ...config
        },
        currentInstance
      );
      currentInstance.components[name] = instance;

      player.$emit(PlayerEvents.AFTERCOMPONENTSETUP, {
        name,
        component: instance
      });
    };
    // 先判断构造函数中是否有shouldInit静态函数，判断是否需要进行初始化
    if (
      isFunction(Component.shouldInit) &&
      !Component.shouldInit(player.options)
    ) {
      return;
    }
    if (!isKeyInObject(name, opts)) {
      if (options.init) {
        init();
      }
    } else {
      const componentOptions = opts[name];
      if (componentOptions === true || isPlainObject(componentOptions)) {
        init(componentOptions === true ? {} : componentOptions);
      }
    }
  });
}

export function destroyComponents(
  components: { [key: string]: Component },
  player: Player
) {
  Object.keys(components).forEach((name) => {
    const component = components[name];
    player.$emit(PlayerEvents.BEFORECOMPONENTDESTROY, { name, component });
    if (isFunction(component.destroy)) {
      component.destroy();
    }
    player.$emit(PlayerEvents.AFTERCOMPONENTDESTROY, { name });
  });
}

export function initPlugins(player: Player) {
  const plugins = player.options.plugins || {};
  forEachPlugins((name, Plugin, options) => {
    const init = (config: Record<string, any> = {}) => {
      const defaults = options.defaults;
      player.$emit(PlayerEvents.BEFOREPLUGINSETUP, { name });
      const plugin = new Plugin(player, { ...defaults, ...config });
      player.plugins[name] = plugin;
      player.$emit(PlayerEvents.AFTERPLUGINSETUP, { name, plugin });
    };
    if (isFunction(Plugin.shouldInit) && !Plugin.shouldInit(player.options)) {
      return;
    }

    if (!isKeyInObject(name, plugins)) {
      if (options.init === true) {
        init();
      }
    } else {
      const pluginOptions = plugins[name];

      if (pluginOptions === true || isPlainObject(pluginOptions)) {
        init(pluginOptions === true ? {} : pluginOptions);
      }
    }
  });
}

export function destroyPlugins(player: Player) {
  Object.keys(player.plugins).forEach((name) => {
    const plugin = player.plugins[name];
    player.$emit(PlayerEvents.BEFOREPLUGINDESTROY, { name, plugin });
    if (isFunction(plugin.destroy)) {
      plugin.destroy();
    }
    player.$emit(PlayerEvents.AFTERPLUGINDESTROY, { name });
  });
}

export function definePlayerMethods(
  player: Player,
  methods: { [key: string]: Function }
) {
  Object.keys(methods).forEach((key) => {
    Object.defineProperty(player, key, {
      get: () => {
        return (...args: any) => {
          methods[key](...args);
          return player;
        };
      }
    });
  });
}

export function definePlayerProperty(
  player: Player,
  props: { [key: string]: () => any }
) {
  Object.keys(props).forEach((key) => {
    Object.defineProperty(player, key, {
      get: props[key]
    });
  });
}
