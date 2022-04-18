import { isFunction, logError, logWarn } from "@lin-media/utils";
import { ClassType } from "../types";
import { TechsMap } from "../types/tech";

const techsMap: TechsMap = {};

const techsKey: string[] = [];

function keyInMap(key: string) {
  return key in techsMap;
}

export function registerTech(name: string, tech: ClassType) {
  if (keyInMap(name)) {
    logWarn(`tech: ${name} is registered`);
    return;
  }

  if (!isFunction(tech.prototype.destroy)) {
    logError(`tech:${name} should provide a destroy function`);
    return;
  }

  techsMap[name] = tech;
  techsKey.push(name);
}

export function removeTech(name: string) {
  if (!keyInMap(name)) {
    return;
  }
  delete techsMap[name];
  const index = techsKey.findIndex((k) => k === name);
  if (index > -1) {
    techsKey.splice(index, 1);
  }
}

export function getTech(name: string) {
  return techsMap[name];
}

export function forEachTech(
  cb: (name: string, tech: ClassType) => boolean,
  techOrder: string[] = []
) {
  const keys = [...new Set([...techOrder, ...techsKey])];

  for (let i = 0; i < keys.length; i++) {
    const name = keys[i];
    const tech = techsMap[name];
    const ret = cb(name, tech);
    if (ret) {
      return;
    }
  }
}
