import { EventManager } from "@media/utils";
import { CanFocusTagEnum, KeyCodeEnum } from "../config/enum";
import { ComponentOptions } from "../types";

class VideoControls {
  private options: ComponentOptions;
  private eventManager: EventManager;
  private focus = false;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVer();
    this.initWrapperListener();
  }

  private initVer() {
    this.eventManager = new EventManager();
  }

  private initWrapperListener() {
    const containerElement = this.options.templateInstance.containerElement;
    this.eventManager.addEventListener({
      element: containerElement,
      eventName: "click",
      handler: () => {
        this.focus = true;
      }
    });
    this.eventManager.addEventListener({
      element: document,
      eventName: "click",
      handler: () => {
        this.focus = false;
      }
    });
    this.eventManager.addEventListener({
      element: document,
      eventName: "keyup",
      handler: this.onKeyup.bind(this)
    });
  }

  private onKeyup(event: KeyboardEvent) {
    console.log();

    const activeTag: any = document?.activeElement?.tagName.toUpperCase();
    const flag = Object.values(CanFocusTagEnum).includes(activeTag);

    const contenteditable =
      document?.activeElement?.getAttribute("contenteditable");
    if (this.focus && event.keyCode === KeyCodeEnum.space && flag) {
      console.log(activeTag, contenteditable);
    }
  }
}

export default VideoControls;
