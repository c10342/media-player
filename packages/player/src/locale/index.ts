import {
  formatLangTemplate,
  isFunction,
  isPlainObject,
  isUndef
} from "@media/utils";

import zhLang from "./lang/zh.json";

import enLang from "./lang/en.json";
import { LangTypeEnum } from "../config/enum";
import { LangOptions } from "../types";

let lang: LangOptions = zhLang;

let i18nHandler: Function | null;

export const t = function t(path: string, options?: Record<string, any>) {
  let value;
  if (isFunction(i18nHandler)) {
    //   @ts-ignore
    const value = i18nHandler.apply(this, [path, options]);
    if (!isUndef(value)) return value;
  }
  const array = path.split(".");
  let current: any = lang;

  for (let i = 0, j = array.length; i < j; i++) {
    const property = array[i];
    value = current[property];
    if (i === j - 1) return formatLangTemplate(value, options);
    if (!value) return "";
    current = value;
  }
  return "";
};

export const use = function use(l: LangOptions) {
  if (isPlainObject(l)) {
    lang = { ...lang, ...l };
  }
};

export const i18n = function i18n(fn: Function) {
  i18nHandler = fn;
};

export const setLang = function setLang(la: string) {
  lang = la === LangTypeEnum.en ? enLang : zhLang;
};

export default { use, t, i18n, setLang };
