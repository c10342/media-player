import { EventManager } from "@media/utils";
import { CanFocusTagEnum, KeyCodeEnum } from "../config/enum";
import { ComponentOptions } from "../types";

class ShortcutKey {
  private options: ComponentOptions;
  // 标志位，标记用户是否点击了播放器，也就是播放器是否处于活跃状态
  private isFocus = false;
  private eventManager: EventManager;
  constructor(options: ComponentOptions) {
    this.options = options;
    this.initVar();
    // 初始化事件监听
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

  // 点击播放器外的元素时吧标志位置为false
  private onDocumentClick() {
    this.isFocus = false;
  }

  // 点击播放器
  private onPlayerContainerClick(event: MouseEvent) {
    // 要组织冒泡，防止冒泡到document中
    event.stopPropagation();
    this.isFocus = true;
  }
  // 键盘事件处理
  private onDocumentKeyup(event: KeyboardEvent) {
    // 获取获得焦点的元素
    const activeTag: any = document.activeElement?.nodeName.toUpperCase();
    // 获取元素是否可编辑
    const editable = document.activeElement?.getAttribute("contenteditable");
    // 看看获得焦点的元素是不是input或者textarea
    const flag = Object.values(CanFocusTagEnum).includes(activeTag);
    if (!flag && editable !== "" && editable !== "true" && this.isFocus) {
      // 不可编辑并且播放器处于活跃状态
      this.handleKey(event);
    }
  }

  private handleKey(event: KeyboardEvent) {
    event.preventDefault();
    const { live } = this.options;
    switch (event.keyCode) {
      case KeyCodeEnum.space:
        // 按下空格键切换播放状态
        this.instance.toggle();
        break;
      case KeyCodeEnum.left:
        // 按下左箭头，时间后退5秒
        if (!live) {
          // 直播不能后退
          this.instance.seek(this.instance.currentTime - 5);
        }
        break;
      case KeyCodeEnum.right:
        if (!live) {
          // 按下右箭头，时间前进5秒
          this.instance.seek(this.instance.currentTime + 5);
        }
        break;
      case KeyCodeEnum.up:
        // 按下上箭头，音量增大
        this.instance.setVolume(this.instance.volume + 0.1);
        break;
      case KeyCodeEnum.down:
        // 按下下箭头，音量减少
        this.instance.setVolume(this.instance.volume - 0.1);
        break;
    }
  }
}

export default ShortcutKey;
