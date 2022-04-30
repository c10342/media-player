import { isFunction, logError, logWarn } from "@lin-media/utils";

import {
  ComponentClass,
  ComponentItem,
  ComponentOptions
} from "../types/component";

const defaults: ComponentOptions = {
  level: 0,
  parentComponent: "Player"
};

const componentArray: Array<ComponentItem> = [];

const keyInArray = (name: string) => {
  return componentArray.findIndex((item) => item.name === name);
};
export function registerComponent(
  name: string,
  component: ComponentClass,
  options: ComponentOptions = {}
) {
  if (keyInArray(name) > -1) {
    logWarn(`component: ${name} is registered`);
    return;
  }
  if (!isFunction(component.prototype.destroy)) {
    logError(`component:${name} should provide a destroy function`);
    return;
  }

  component.id = name;

  componentArray.push({
    name,
    handler: component,
    options: { ...defaults, ...options }
  });
}

export function getComponent<T>(name: string) {
  const index = keyInArray(name);
  return componentArray[index]?.handler as ComponentClass<T>;
}

export function removeComponent(name: string) {
  const index = keyInArray(name);
  if (index === -1) {
    return;
  }
  componentArray.splice(index, 1);
}

export function forEachComponent(
  parentComponent = "Player",
  cb: (
    name: string,
    component: ComponentClass,
    options: ComponentOptions
  ) => void
) {
  const copy = componentArray.slice();
  const componentList = copy.filter(
    (item) => (item.options.parentComponent || "Player") === parentComponent
  );

  // 根据优先级初始化
  componentList
    .sort((a, b) => (b.options.level ?? 0) - (a.options.level ?? 0))
    .forEach((item) => {
      cb(item.name, item.handler, item.options);
    });
}
