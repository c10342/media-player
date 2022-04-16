import {
  deepClone,
  isArray,
  isKeyInObject,
  isPlainObject
} from "@lin-media/utils";
import { PlayerConfig } from "../types/player";

function getType(data: any) {
  return Object.prototype.toString.call(data);
}

function isNeedMerge(data: any) {
  return isPlainObject(data) || isArray(data);
}

/**
 *
 * @param targetObj 目标值来源
 * @param fromObj 默认值来源
 */
export default function mergeConfig(
  targetObj: Record<string, any>,
  fromObj: Record<string, any>
) {
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
        if (isKeyInObject(key, target)) {
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
  return config;
}
