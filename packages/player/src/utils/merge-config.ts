import { deepClone, isArray, isPlainObject } from "@lin-media/utils";
import getPluginName from "./get-plugin-name";

/**
 *
 * @param targetObj 目标值来源
 * @param fromObj 默认值来源
 */
export default function mergeConfig(targetObj: any, fromObj: any) {
  const config: any = {};
  const hasKey = (key: string, data: any) => {
    return key in data;
  };
  // 先处理目标对象上面的
  for (const key in targetObj) {
    if (key === "controls") {
      if (isPlainObject(targetObj[key])) {
        config[key] = {
          ...targetObj[key]
        };
      } else if (targetObj[key] === false) {
        config[key] = false;
      }
    } else if (key === "plugins") {
      config[key] = [...targetObj[key]];
    } else if (key === "customLanguage") {
      config[key] = deepClone(targetObj[key]);
    } else {
      config[key] = targetObj[key];
    }
  }
  // 在处理默认配置
  for (const key in fromObj) {
    if (key === "controls") {
      if (isPlainObject(config[key])) {
        if (hasKey(key, config)) {
          config[key] = {
            ...fromObj[key],
            ...config[key]
          };
        } else {
          config[key] = {
            ...fromObj[key]
          };
        }
      } else if (config[key] !== false) {
        config[key] = {
          ...fromObj[key]
        };
      }
    } else if (key === "plugins") {
      if (hasKey(key, config)) {
        config[key] = [...fromObj[key], ...config[key]];
      } else {
        config[key] = [...fromObj[key]];
      }
    } else if (key === "customLanguage") {
      if (hasKey(key, config)) {
        config[key] = {
          ...deepClone(fromObj[key]),
          ...config[key]
        };
      } else {
        config[key] = deepClone(fromObj[key]);
      }
    } else {
      if (!hasKey(key, config)) {
        config[key] = fromObj[key];
      }
    }
  }
  // 插件去重
  if (isArray(config.plugins) && config.plugins.length > 0) {
    const plugins: Function[] = config.plugins.slice();
    const pluginsArr: Function[] = [];
    const installed = (item: Function) => {
      return pluginsArr.some((ctor: any) => {
        return getPluginName(ctor) === getPluginName(item);
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
