import { deepClone, isArray, isPlainObject } from "@lin-media/utils";
import { PlayerOptions, PluginClass } from "../types";

function hasKey(key: string, data: any) {
  return key in data;
}

function getType(data: any) {
  return Object.prototype.toString.call(data);
}

function isNeedMerge(data: any) {
  return isPlainObject(data) || isArray(data);
}

// 插件去重
function uniquePlugins(config: PlayerOptions) {
  if (isArray(config.plugins) && config.plugins.length > 0) {
    const plugins: PluginClass[] = config.plugins.slice();
    const pluginsArr: PluginClass[] = [];
    const installed = (item: PluginClass) => {
      return pluginsArr.some((ctor) => {
        return ctor.pluginName === item.pluginName;
      });
    };
    plugins.forEach((item) => {
      if (!installed(item)) {
        pluginsArr.push(item);
      }
    });
    config.plugins = pluginsArr;
  }
  return config;
}

/**
 *
 * @param targetObj 目标值来源
 * @param fromObj 默认值来源
 */
export default function mergeConfig(targetObj: any, fromObj: any) {
  // 先进行深拷贝，防止对原数据进行污染
  targetObj = deepClone(targetObj);
  fromObj = deepClone(fromObj);

  function merge(target: any, from: any) {
    if (isArray(target) && isArray(from)) {
      // 数组直接合并起来
      return from.concat(target);
    }
    if (isPlainObject(target) && isPlainObject(from)) {
      for (const key in from) {
        // 目标值和默认值存在相同的key
        if (hasKey(key, target)) {
          // 如果类型不同的话，以目标值的为主
          if (
            getType(target[key]) === getType(from[key]) &&
            isNeedMerge(from[key])
          ) {
            target[key] = merge(target[key], from[key]);
          }
        } else {
          target[key] = from[key];
        }
      }
    }
    return target;
  }
  const config = merge(targetObj, fromObj);
  // 插件去重
  uniquePlugins(config);
  return config;
}
