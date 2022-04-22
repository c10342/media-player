import { logError } from "@lin-media/utils";
import { SourceItem } from "../types/player";
import {
  NextFunction,
  SourceArrItem,
  SourceHandleCallback
} from "../types/source";

const sourceArray: Array<SourceArrItem> = [];

function findSource(type: string, callback: SourceHandleCallback) {
  return sourceArray.findIndex(
    (source) =>
      source.type === type &&
      (source.handler === callback || (source.handler as any)._fn_ === callback)
  );
}

export function registerSource(type: string, callback: SourceHandleCallback) {
  if (findSource(type, callback) > -1) {
    logError(`source: ${callback} is registered`);
    return;
  }
  sourceArray.push({
    type,
    handler: callback
  });
}

export function removeSource(type: string, callback: SourceHandleCallback) {
  const index = findSource(type, callback);
  if (index === -1) {
    return;
  }

  sourceArray.splice(index, 1);
}
export function registerOnceSource(
  type: string,
  callback: SourceHandleCallback
) {
  const fn = (data: SourceItem, next: NextFunction) => {
    const ret = callback(data, next);
    removeSource(type, fn);
    return ret;
  };
  fn._fn_ = callback;
  registerSource(type, fn);
}

export function forEachSource(
  callback: (type: string, fn: SourceHandleCallback) => void
) {
  sourceArray.forEach((item) => {
    callback(item.type, item.handler);
  });
}
