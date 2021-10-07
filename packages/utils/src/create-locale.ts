import { isFunction, isUndef, isPlainObject } from "./is";
import formatLangTemplate from "./format-lang-template";
import { LangTypeEnum } from "./enums";

// 语言
interface LangOptions {
  [key: string]: any;
}

interface LangObj {
  zhLang: LangOptions;
  enLang: LangOptions;
}

export default function createLocale({ zhLang, enLang }: LangObj) {
  let lang: LangOptions = zhLang;

  let i18nHandler: Function | null;

  // 获取语言
  const t = function t(path: string, options?: Record<string, any>) {
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
  const use = function use(l: any) {
    if (isPlainObject(l)) {
      lang = { ...lang, ...l };
    }
  };

  // 自定义i18n处理函数
  const i18n = function i18n(fn: Function) {
    i18nHandler = fn;
  };

  // 设置使用哪种语言
  const setLang = function setLang(la: string) {
    lang = la === LangTypeEnum.en ? enLang : zhLang;
  };

  return { use, t, i18n, setLang };
}
