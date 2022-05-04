import { logWarn } from "@lin-media/utils";
import { HookCallback, HooksMap, HookType } from "../types/index";

const hooksMap: HooksMap = {
  beforeSetup: [],
  afterSetup: [],
  beforeDestroy: [],
  afterDestroy: []
};

function keyInMap(key: string) {
  return key in hooksMap;
}

export function useHook(hook: HookType, callback: HookCallback) {
  if (keyInMap(hook)) {
    //   防止重复注册
    const index = hooksMap[hook].findIndex((cb) => cb === callback);
    if (index === -1) {
      hooksMap[hook].push(callback);
    } else {
      logWarn(`hook: ${callback} is registered`);
    }
  }
}

export function removeHook(hook: HookType, callback?: HookCallback) {
  if (!keyInMap(hook)) {
    return;
  }
  if (!callback) {
    hooksMap[hook] = [];
    return;
  }
  const index = hooksMap[hook].findIndex(
    (cb: any) => cb === callback || cb._fn_ === callback
  );
  if (index > -1) {
    hooksMap[hook].splice(index, 1);
  }
}

export function forEachHook(
  hook: HookType,
  callback: (fn: HookCallback) => void
) {
  if (!keyInMap(hook)) {
    return;
  }
  hooksMap[hook].forEach((hookFn) => {
    callback(hookFn);
  });
}
