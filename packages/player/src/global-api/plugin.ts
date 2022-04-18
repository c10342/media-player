import { isFunction, logError, logWarn } from "@lin-media/utils";
import { ClassType } from "../types";
import { DefaultPluginOptions, PluginApi, PluginItem } from "../types/plugin";

const pluginArray: Array<PluginItem> = [];

function keyInArray(key: string) {
  return pluginArray.findIndex((plugin) => plugin.name === key);
}

export function registerPlugin(
  name: string,
  plugin: ClassType<PluginApi>,
  options: DefaultPluginOptions = {}
) {
  if (keyInArray(name) > -1) {
    logWarn(`plugin: ${name} is registered`);
    return;
  }

  if (!isFunction(plugin.prototype.destroy)) {
    logError(`plugin:${name} should provide a destroy function`);
    return;
  }

  pluginArray.push({
    name,
    handler: plugin,
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

export function getPlugin(name: string) {
  const index = keyInArray(name);
  return pluginArray[index]?.handler;
}

export function forEachPlugins(
  cb: (
    name: string,
    plugin: ClassType<PluginApi>,
    options: DefaultPluginOptions
  ) => any
) {
  pluginArray.forEach((plugin) => {
    cb(plugin.name, plugin.handler, plugin.options);
  });
}
