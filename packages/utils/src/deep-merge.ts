import { isPlainObject } from "./is";

function deepMerge(targetObj: Record<string, any>, obj: Record<string, any>) {
  if (!isPlainObject(targetObj) || !isPlainObject(obj)) {
    return {};
  }
  for (const key in obj) {
    if (key in targetObj) {
      if (isPlainObject(targetObj[key]) && isPlainObject(obj[key])) {
        targetObj[key] = deepMerge(targetObj[key], obj[key]);
      } else {
        targetObj[key] = obj[key];
      }
    } else {
      targetObj[key] = obj[key];
    }
  }
  return targetObj;
}

export default deepMerge;
