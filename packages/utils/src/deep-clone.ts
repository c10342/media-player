import { isPlainObject, isArray } from "./is";

function isNeedClone(data: any) {
  return isPlainObject(data) || isArray(data);
}

function deepClone(obj: any) {
  if (isPlainObject(obj)) {
    // 普通对象
    const data: any = {};
    for (const key in obj) {
      const item = obj[key];
      if (isNeedClone(item)) {
        data[key] = deepClone(item);
      } else {
        data[key] = item;
      }
    }
    return data;
  } else if (isArray(obj)) {
    // 数组
    const data: any = [];
    for (let i = 0; i < obj.length; i++) {
      const item = obj[i];
      if (isNeedClone(item)) {
        data.push(deepClone(item));
      } else {
        data.push(item);
      }
    }
    return data;
  }

  return obj;
}

export default deepClone;
