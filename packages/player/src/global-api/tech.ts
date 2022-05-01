import { isFunction, logError, logWarn } from "@lin-media/utils";
import { TechOptions, TechClass, TechItem } from "../types/index";

const techArray: Array<TechItem> = [];

function keyInArray(key: string) {
  return techArray.findIndex((tech) => tech.name === key);
}

export function registerTech(
  name: string,
  tech: TechClass,
  options: TechOptions = {}
) {
  if (keyInArray(name) > -1) {
    logWarn(`tech: ${name} is registered`);
    return;
  }

  if (!isFunction(tech.prototype.destroy)) {
    logError(`tech:${name} should provide a destroy function`);
    return;
  }

  tech.id = name;

  techArray.push({
    name,
    handler: tech,
    options
  });
}

export function removeTech(name: string) {
  const index = keyInArray(name);
  if (index === -1) {
    return;
  }

  techArray.splice(index, 1);
}

export function getTech(name: string) {
  const index = keyInArray(name);
  return techArray[index].handler;
}

export function forEachTech(
  cb: (name: string, tech: TechClass, options: TechOptions) => boolean,
  techsOrder: string[] = []
) {
  const techsKey = techArray.map((tech) => tech.name);
  const keys = [...new Set([...techsOrder, ...techsKey])];
  for (let i = 0; i < keys.length; i++) {
    const index = keyInArray(keys[i]);
    if (index > -1) {
      const tech = techArray[index];
      const ret = cb(tech.name, tech.handler, tech.options);
      if (ret) {
        return;
      }
    }
  }
}
