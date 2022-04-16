import { logWarn } from "@lin-media/utils";
import { ClassType } from "../types";
import {
  ComponentApi,
  ComponentItem,
  DefaultComponentOptions
} from "../types/component";

const defaults: DefaultComponentOptions = {
  level: 0
};

function createComponent() {
  const componentArray: Array<ComponentItem> = [];
  const keyInArray = (name: string) => {
    return componentArray.findIndex((item) => item.name === name);
  };
  const registerComponent = (
    name: string,
    component: ClassType<ComponentApi>,
    options: DefaultComponentOptions = {}
  ) => {
    if (keyInArray(name) > -1) {
      logWarn(`component: ${name} is registered`);
      return;
    }
    componentArray.push({
      name,
      handler: component,
      options: { ...defaults, ...options }
    });
  };

  const getComponent = (name: string) => {
    const index = keyInArray(name);
    return componentArray[index]?.handler;
  };

  const removeComponent = (name: string) => {
    const index = keyInArray(name);
    if (index === -1) {
      return;
    }
    componentArray.splice(index, 1);
  };

  const forEachComponent = (
    cb: (
      name: string,
      component: ClassType<ComponentApi>,
      options: DefaultComponentOptions
    ) => void
  ) => {
    const copy = componentArray.slice();
    // 根据优先级初始化
    copy
      .sort((a, b) => (a.options.level ?? 0) - (b.options.level ?? 0))
      .forEach((item) => {
        cb(item.name, item.handler, item.options);
      });
  };

  return {
    registerComponent,
    getComponent,
    removeComponent,
    forEachComponent
  };
}

export default createComponent;
