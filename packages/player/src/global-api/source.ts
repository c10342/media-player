import { logError } from "@lin-media/utils";
import { SourceItem } from "../types/player";
import { SourceHandleCallback } from "../types/source";

const sourcesMap: { [key: string]: Array<SourceHandleCallback> } = {
  "*": []
};

function keyInMap(key: string) {
  return key in sourcesMap;
}

function findIndex(type: string, callback: SourceHandleCallback) {
  return sourcesMap[type].findIndex(
    (item: any) => (item || item._fn_) === callback
  );
}

export function registerSource(type: string, callback: SourceHandleCallback) {
  if (!keyInMap(type)) {
    sourcesMap[type] = [];
  }
  const index = findIndex(type, callback);
  if (index > -1) {
    const fn = (callback as any)._fn_ ? (callback as any)._fn_ : callback;
    logError(`source: ${fn} is registered`);
    return;
  }
  sourcesMap[type].push(callback);
}

export function removeSource(type: string, callback?: SourceHandleCallback) {
  if (!keyInMap(type)) {
    return;
  }
  if (!callback) {
    delete sourcesMap[type];
    return;
  }

  const index = findIndex(type, callback);
  if (index > -1) {
    sourcesMap[type].splice(index, 1);
  }
}
export function registerOnceSource(
  type: string,
  callback: SourceHandleCallback
) {
  const fn = (data: SourceItem) => {
    const ret = callback(data);
    removeSource(type, fn);
    return ret;
  };
  fn._fn_ = callback;
  registerSource(type, fn);
}

export function forEachSource(
  type: string,
  callback: (fn: SourceHandleCallback) => void
) {
  if (!keyInMap(type)) {
    return;
  }
  sourcesMap[type].forEach((fn) => {
    callback(fn);
  });
}
