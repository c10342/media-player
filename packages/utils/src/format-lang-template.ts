import { isPlainObject, isUndef } from "./is";

function hasOwn(obj: any, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

const RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g;
/**
 *  String format template
 *  - Inspired:
 *    https://github.com/Matt-Esch/string-template/index.js
 */
export default function template(express: string, ...args: any) {
  if (args.length === 1 && isPlainObject(args[0])) {
    args = args[0];
  }

  if (!args || !args.hasOwnProperty) {
    args = {};
  }

  return express.replace(RE_NARGS, (match, prefix, i, index) => {
    if (express[index - 1] === "{" && express[index + match.length] === "}") {
      return i;
    }
    const result = hasOwn(args, i) ? args[i] : null;
    if (isUndef(result)) {
      return "";
    }

    return result;
  });
}
