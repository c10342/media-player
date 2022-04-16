import { isFunction, isKeyInObject, isPlainObject } from "@lin-media/utils";
import { forEachPlugins } from "../global-api/plugin";
import Player from "../player";
import { ClassType } from "../types";
import { ComponentApi, DefaultComponentOptions } from "../types/component";

export function canVideoPlayType(type: string) {
  return document.createElement("video").canPlayType(type);
}

export function initComponents(
  forEachComponent: (
    fn: (
      name: string,
      component: ClassType<ComponentApi>,
      options: DefaultComponentOptions
    ) => void
  ) => void,
  player: Player,
  rootElement: HTMLElement,
  components: { [key: string]: ComponentApi } = {},
  opts: Record<string, any> = {}
) {
  forEachComponent((name, component, options) => {
    const init = (config: Record<string, any> = {}) => {
      const defaults = options.defaults;
      player.$emit(`beforeComponentSetup:${name}`);
      const instance = new component(player, rootElement, {
        ...defaults,
        ...config
      });
      components[name] = instance;
      player.$emit(`afterComponentSetup:${name}`, instance);
    };
    // 先判断构造函数中是否有shouldInit静态函数，判断是否需要进行初始化
    if (
      isFunction(component.shouldInit) &&
      !component.shouldInit(player.options)
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

export function initPlugins(player: Player) {
  const plugins = player.options.plugins || {};
  forEachPlugins((name, plugin, options) => {
    const init = (config: Record<string, any> = {}) => {
      const defaults = options.defaultOptions;
      player.$emit(`beforePluginSetup:${name}`);
      const instance = new plugin(player, { ...defaults, ...config });
      player.plugins[name] = instance;
      player.$emit(`afterPluginSetup:${name}`, instance);
    };
    if (isFunction(plugin.shouldInit) && !plugin.shouldInit(player.options)) {
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