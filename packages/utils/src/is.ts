const toString = Object.prototype.toString;

export function isString(data: any): data is string {
  return typeof data === "string";
}

export function isNumber(data: any): data is number {
  return typeof data === "number";
}

export function isFunction(data: any): data is Function {
  return toString.call(data) === "[object Function]";
}

export function isUndefined(data: any): data is undefined {
  return toString.call(data) === "[object Undefined]";
}

export function isPlainObject(data: any): data is Record<string, any> {
  return toString.call(data) === "[object Object]";
}

export function isNull(data: any): data is null {
  return toString.call(data) === "[object Null]";
}

export function isUndef(data: any): data is null | undefined {
  return isNull(data) || isUndefined(data);
}

export function isArray(data: any): data is Array<any> {
  return toString.call(data) === "[object Array]";
}

export function isBoolean(data: any): data is boolean {
  return toString.call(data) === "[object Boolean]";
}

export function isMobile() {
  const u = navigator.userAgent;
  const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  return isAndroid || isiOS;
}
