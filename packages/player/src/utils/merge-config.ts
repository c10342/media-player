import { deepClone, isPlainObject } from "@lin-media/utils";

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

  return config;
}
