const toString = Object.prototype.toString;

export function isString(data: any) {
  return typeof data === "string";
}

export function isNumber(data: any) {
  return typeof data === "number";
}

export function isFunction(data: any) {
  return toString.call(data) === "[object Function]";
}

export function isUndefined(data: any) {
  return toString.call(data) === "[object Undefined]";
}

export function isPlainObject(data: any) {
  return toString.call(data) === "[object Object]";
}

export function isNull(data: any) {
  return toString.call(data) === "[object Null]";
}

export function isUndef(data: any) {
  return isNull(data) || isUndefined(data);
}

export function isArray(data: any) {
  return toString.call(data) === "[object Array]";
}
