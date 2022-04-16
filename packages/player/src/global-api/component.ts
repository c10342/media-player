import { logWarn } from "@lin-media/utils";
import { ClassType } from "../types";
import {
  ComponentApi,
  ComponentItem,
  DefaultComponentOptions
} from "../types/component";

const defaults: DefaultComponentOptions = {
  level: 0,
  parentComponent: "Player"
};

const componentArray: Array<ComponentItem> = [];

const keyInArray = (name: string) => {
  return componentArray.findIndex((item) => item.name === name);
};
export function registerComponent(
  name: string,
  component: ClassType<ComponentApi>,
  options: DefaultComponentOptions = {}
) {
  if (keyInArray(name) > -1) {
    logWarn(`component: ${name} is registered`);
    return;
  }
  componentArray.push({
    name,
    handler: component,
    options: { ...defaults, ...options }
  });
}

export function getComponent(name: string) {
  const index = keyInArray(name);
  return componentArray[index]?.handler;
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
    component: ClassType<ComponentApi>,
    options: DefaultComponentOptions
  ) => void
) {
  const copy = componentArray.slice();
  const componentList = copy.filter(
    (item) => (item.options.parentComponent || "Player") === parentComponent
  );

  // 根据优先级初始化
  componentList
    .sort((a, b) => (a.options.level ?? 0) - (b.options.level ?? 0))
    .forEach((item) => {
      cb(item.name, item.handler, item.options);
    });
}
