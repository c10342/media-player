import {
  formatLangTemplate,
  isFunction,
  isPlainObject,
  isUndef,
  LangTypeEnum
} from "@media/utils";

import zhLang from "./lang/zh.json";

import enLang from "./lang/en.json";

interface LangOptions {
  [key: string]: string;
}

let lang: LangOptions = zhLang;

let i18nHandler: Function | null;

// 获取语言
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

// 自定义语言，跟默认语言进行合并
export const use = function use(l: LangOptions) {
  if (isPlainObject(l)) {
    lang = { ...lang, ...l };
  }
};

// 自定义i18n处理函数
export const i18n = function i18n(fn: Function) {
  i18nHandler = fn;
};

// 设置使用哪种语言
export const setLang = function setLang(la: string) {
  lang = la === LangTypeEnum.en ? enLang : zhLang;
};

export default { use, t, i18n, setLang };
