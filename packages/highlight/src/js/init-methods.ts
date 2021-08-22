import { pluginName } from "../config/constant";
import { HighlightList } from "../types";

export function initMethod(ctro: any) {
  Object.defineProperty(ctro.prototype, "highlight", {
    get() {
      const highlightInstance = this.plugins[pluginName];
      return {
        set(list: HighlightList) {
          highlightInstance.setHighlight(list);
          return this;
        },
        destroy() {
          highlightInstance.destroyHighlight();
          return this;
        }
      };
    }
  });
}
