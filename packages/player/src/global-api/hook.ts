import { logWarn } from "@lin-media/utils";
import { HookCallback, HooksMap, HookType, PlayerOptions } from "../types";

const hooksMap: HooksMap = {
  beforeSetup: [],
  afterSetup: []
};

function keyInMap(key: string) {
  return key in hooksMap;
}

export function registerHook(hook: HookType, callback: HookCallback) {
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

export function registerHookOnce(hook: HookType, callback: HookCallback) {
  if (!keyInMap(hook)) {
    return;
  }
  const fn = (data: PlayerOptions) => {
    const result = callback(data);
    removeHook(hook, fn);
    return result;
  };
  fn._fn_ = callback;
  registerHook(hook, fn);
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
