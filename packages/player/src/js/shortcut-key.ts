import { EventManager } from "@media/utils";
import { CanFocusTagEnum, KeyCodeEnum } from "../config/enum";
import { ComponentOptions } from "../types";

class ShortcutKey {
  private options: ComponentOptions;
  private isFocus = false;
  private eventManager: EventManager;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    this.initListener();
  }

  private get instance() {
    return this.options.instance;
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private initListener() {
    const containerElement = this.options.templateInstance.containerElement;
    this.eventManager.addEventListener({
      element: document,
      eventName: "click",
      handler: this.onDocumentClick.bind(this)
    });
    this.eventManager.addEventListener({
      element: containerElement,
      eventName: "click",
      handler: this.onPlayerContainerClick.bind(this)
    });
    this.eventManager.addEventListener({
      element: document,
      eventName: "keyup",
      handler: this.onDocumentKeyup.bind(this)
    });
  }

  private onDocumentClick() {
    this.isFocus = false;
  }

  private onPlayerContainerClick(event: MouseEvent) {
    event.stopPropagation();
    this.isFocus = true;
  }

  private onDocumentKeyup(event: KeyboardEvent) {
    const activeTag: any = document.activeElement?.nodeName.toUpperCase();
    const editable = document.activeElement?.getAttribute("contenteditable");
    const flag = Object.values(CanFocusTagEnum).includes(activeTag);
    if (!flag && editable !== "" && editable !== "true" && this.isFocus) {
      this.handleKey(event);
    }
  }

  private handleKey(event: KeyboardEvent) {
    event.preventDefault();
    const { live } = this.options;
    switch (event.keyCode) {
      case KeyCodeEnum.space:
        this.instance.toggle();
        break;
      case KeyCodeEnum.left:
        if (!live) {
          this.instance.seek(this.instance.currentTime - 5);
        }
        break;
      case KeyCodeEnum.right:
        if (!live) {
          this.instance.seek(this.instance.currentTime + 5);
        }
        break;
      case KeyCodeEnum.up:
        this.instance.setVolume(this.instance.volume + 0.1);
        break;
      case KeyCodeEnum.down:
        this.instance.setVolume(this.instance.volume - 0.1);
        break;
    }
  }
}

export default ShortcutKey;
