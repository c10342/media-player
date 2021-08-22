import { pluginName } from "../config/constant";
import { PreviewList } from "../types";

export function initMethod(ctro: any) {
  Object.defineProperty(ctro.prototype, "preview", {
    get() {
      const previewInstance = this.plugins[pluginName];
      return {
        // 设置预览点列表
        setPreview: (list: PreviewList) => {
          previewInstance.setPreview(list);
          return this;
        },
        // 销毁预览点列表
        destroyPreview: () => {
          previewInstance.destroyPreview();
          return this;
        },
        // 设置进度条预览
        setBarView: (barPreviewUrl: string) => {
          previewInstance.setBarView(barPreviewUrl);
          return this;
        },
        // 销毁进度条预览
        destroyBarView: () => {
          previewInstance.destroyBarView();
          return this;
        }
      };
    }
  });
}
