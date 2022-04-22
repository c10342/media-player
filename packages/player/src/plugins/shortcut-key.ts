import { EventManager } from "@lin-media/utils";
import { CanFocusTagEnum, KeyCodeEnum } from "../config/enum";
import { PlayerEvents } from "../config/event";
import Player from "../player";
import Plugin from "./plugin";

class ShortcutKey extends Plugin {
  // 标志位，标记用户是否点击了播放器，也就是播放器是否处于活跃状态
  private isFocus = false;
  private eventManager = new EventManager();
  constructor(player: Player, options: any) {
    super(player, options);
  }

  onPlayerReady() {
    this.initListener();
  }

  private initListener() {
    this.eventManager.addEventListener({
      element: document,
      eventName: "click",
      handler: this.onDocumentClick.bind(this)
    });
    this.eventManager.addEventListener({
      element: this.player.rootElement,
      eventName: "click",
      handler: this.onPlayerContainerClick.bind(this)
    });
    this.eventManager.addEventListener({
      element: document,
      eventName: "keydown",
      handler: this.onDocumentKeydown.bind(this)
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
  private onDocumentKeydown(event: KeyboardEvent) {
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
    const { live } = this.player.options;
    const player = this.player;
    switch (event.keyCode) {
      case KeyCodeEnum.space:
        event.preventDefault();
        // 按下空格键切换播放状态
        player.toggle();
        this.player.$emit(PlayerEvents.KEYBOARD_SPACE);
        break;
      case KeyCodeEnum.left:
        event.preventDefault();
        // 按下左箭头，时间后退5秒
        if (!live) {
          // 直播不能后退
          player.seek(player.currentTime - 5);
        }
        this.player.$emit(PlayerEvents.KEYBOARD_LEFT);
        break;
      case KeyCodeEnum.right:
        event.preventDefault();
        if (!live) {
          // 按下右箭头，时间前进5秒
          player.seek(player.currentTime + 5);
        }
        this.player.$emit(PlayerEvents.KEYBOARD_RIGHT);
        break;
      case KeyCodeEnum.up:
        event.preventDefault();
        // 按下上箭头，音量增大
        player.setVolume(player.volume + 0.1);
        this.player.$emit(PlayerEvents.KEYBOARD_UP);
        break;
      case KeyCodeEnum.down:
        event.preventDefault();
        // 按下下箭头，音量减少
        player.setVolume(player.volume - 0.1);
        this.player.$emit(PlayerEvents.KEYBOARD_DOWN);
        break;
    }
  }

  destroy() {
    this.eventManager.removeEventListener();
    super.destroy();
  }
}

export default ShortcutKey;
