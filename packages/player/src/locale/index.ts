import { formatLangTemplate, isFunction, isUndef } from "@media/utils";

import zhLang from "./lang/zh.json";

// import enLang from './lang/en.json'

let lang = zhLang;

let i18nHandler: Function | null;

export const t = function t(path: string, options: Record<string, any>) {
  let value;
  if (isFunction(i18nHandler)) {
    //   @ts-ignore
    const value = i18nHandler.apply(this, [path, options]);
    if (!isUndef(value)) return value;
  }
  const array = path.split(".");
  let current = lang;

  for (let i = 0, j = array.length; i < j; i++) {
    const property = array[i];
    //   @ts-ignore
    value = current[property];
    if (i === j - 1) return formatLangTemplate(value, options);
    if (!value) return "";
    current = value;
  }
  return "";
};

export const use = function use(l: any) {
  lang = l || lang;
};

export const i18n = function i18n(fn: Function) {
  i18nHandler = fn;
};

export const setLang = function setLang() {
  // i18nHandler = fn;
};

export default { use, t, i18n };
