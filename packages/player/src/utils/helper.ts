import {
  isFunction,
  isKeyInObject,
  isPlainObject,
  logError
} from "@lin-media/utils";
import Component from "../components/component";
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

export function destroyComponents(components: { [key: string]: Component }) {
  Object.keys(components).forEach((name) => {
    const component = components[name];
    if (isFunction(component.destroy)) {
      component.destroy();
    }
  });
}

export function initPlugins(player: Player) {
  const plugins = player.options.plugins || {};
  forEachPlugins((name, Plugin, options) => {
    const init = (config: Record<string, any> = {}) => {
      const defaults = options.defaults;
      const plugin = new Plugin(player, { ...defaults, ...config });
      player.plugins[name] = plugin;
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
    if (isFunction(plugin.destroy)) {
      plugin.destroy();
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

export function handleMiddleware(
  chain: Array<Function>,
  context: Player,
  options: any
) {
  const next = (index: number, data: any) => {
    if (index === chain.length) {
      return;
    }
    const fn = chain[index].bind(context);
    let called = false;
    fn(data, (opts: any) => {
      if (called) {
        logError("next have been called");
        return;
      }
      next(index + 1, opts);
      called = true;
    });
  };
  next(0, options);
}
