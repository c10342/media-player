import { pluginName } from "../config/constant";

export function initMethod(ctro: any) {
  Object.defineProperty(ctro.prototype, "screenshot", {
    get() {
      const screenshotInstance = this.plugins[pluginName];
      return {
        snapshot: () => {
          screenshotInstance.onClick();
          return this;
        }
      };
    }
  });
}
