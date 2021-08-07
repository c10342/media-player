import { isUndef } from "@media/utils";
import {
  ComponentOptions,
  HtmlElementProp,
  HTMLVideoElementProp
} from "../types";

class VideoLoading {
  private options: ComponentOptions;
  private videoElement: HTMLVideoElementProp;
  private loadingWrapperElement: HtmlElementProp;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initElement();
    this.initVideoListener();
  }

  private initElement() {
    const templateInstance = this.options.templateInstance;
    this.videoElement = templateInstance.videoElement;
    this.loadingWrapperElement = templateInstance.loadingWrapperElement;
  }

  private initVideoListener() {
    const videoElement = this.videoElement;
    if (!isUndef(videoElement)) {
      videoElement.addEventListener("waiting", () => this.onVideoWaiting());
      videoElement.addEventListener("canplaythrough", () =>
        this.onCanplaythrough()
      );
    }
  }

  private onVideoWaiting() {
    this.showLoading();
  }
  private onCanplaythrough() {
    this.hideLoading();
  }

  private showLoading() {
    const loadingWrapperElement = this.loadingWrapperElement;
    if (!isUndef(loadingWrapperElement)) {
      loadingWrapperElement.style.display = "flex";
    }
  }

  private hideLoading() {
    const loadingWrapperElement = this.loadingWrapperElement;
    if (!isUndef(loadingWrapperElement)) {
      loadingWrapperElement.style.display = "";
    }
  }

  destroy() {
    console.log("destroy");
  }
}

export default VideoLoading;
