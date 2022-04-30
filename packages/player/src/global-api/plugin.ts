import { isFunction, logError, logWarn } from "@lin-media/utils";

import { PluginOptions, PluginClass, PluginItem } from "../types/plugin";

const pluginArray: Array<PluginItem> = [];

function keyInArray(key: string) {
  return pluginArray.findIndex((plugin) => plugin.name === key);
}

export function registerPlugin(
  name: string,
  plugin: PluginClass,
  options: PluginOptions = {}
) {
  if (keyInArray(name) > -1) {
    logWarn(`plugin: ${name} is registered`);
    return;
  }

  if (!isFunction(plugin.prototype.destroy)) {
    logError(`plugin:${name} should provide a destroy function`);
    return;
  }

  class DefaultPlugin extends plugin {
    static id = name;
  }

  pluginArray.push({
    name,
    handler: DefaultPlugin,
    options
  });
}

export function removePlugin(name: string) {
  const index = keyInArray(name);
  if (index === -1) {
    return;
  }
  pluginArray.splice(index, 1);
}

export function getPlugin<Options = any>(name: string) {
  const index = keyInArray(name);
  return pluginArray[index]?.handler as PluginClass<Options>;
}

export function forEachPlugins(
  cb: (name: string, plugin: PluginClass, options: PluginOptions) => any
) {
  pluginArray.forEach((plugin) => {
    cb(plugin.name, plugin.handler, plugin.options);
  });
}
