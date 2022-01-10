import { EventManager } from "@lin-media/utils";
import { SHORTCUTKEY } from "../config/constant";
import { CanFocusTagEnum, KeyCodeEnum } from "../config/enum";
import { PlayerEvents } from "../config/event";
import MediaPlayer from "../index";

class ShortcutKey {
  static pluginName = SHORTCUTKEY;
  // 播放器实例
  private _playerInstance: MediaPlayer;
  // 标志位，标记用户是否点击了播放器，也就是播放器是否处于活跃状态
  private _isFocus = false;
  private _eventManager = new EventManager();
  constructor(playerInstance: MediaPlayer) {
    this._playerInstance = playerInstance;
    // 初始化事件监听
    this._initListener();
  }

  private _initListener() {
    this._eventManager.addEventListener({
      element: document,
      eventName: "click",
      handler: this._onDocumentClick.bind(this)
    });
    this._eventManager.addEventListener({
      element: this._playerInstance.$rootElement,
      eventName: "click",
      handler: this.onPlayerContainerClick.bind(this)
    });
    this._eventManager.addEventListener({
      element: document,
      eventName: "keydown",
      handler: this._onDocumentKeydown.bind(this)
    });
    this._on(PlayerEvents.DESTROY, this._destroy.bind(this));
  }

  // 点击播放器外的元素时吧标志位置为false
  private _onDocumentClick() {
    this._isFocus = false;
  }

  // 点击播放器
  private onPlayerContainerClick(event: MouseEvent) {
    // 要组织冒泡，防止冒泡到document中
    event.stopPropagation();
    this._isFocus = true;
  }
  // 键盘事件处理
  private _onDocumentKeydown(event: KeyboardEvent) {
    // 获取获得焦点的元素
    const activeTag: any = document.activeElement?.nodeName.toUpperCase();
    // 获取元素是否可编辑
    const editable = document.activeElement?.getAttribute("contenteditable");
    // 看看获得焦点的元素是不是input或者textarea
    const flag = Object.values(CanFocusTagEnum).includes(activeTag);
    if (!flag && editable !== "" && editable !== "true" && this._isFocus) {
      // 不可编辑并且播放器处于活跃状态
      this._handleKey(event);
    }
  }

  private _handleKey(event: KeyboardEvent) {
    const { live } = this._playerInstance.$options;
    const playerInstance = this._playerInstance;
    switch (event.keyCode) {
      case KeyCodeEnum.space:
        event.preventDefault();
        // 按下空格键切换播放状态
        playerInstance.toggle();
        this._emit(PlayerEvents.KEYBOARD_SPACE);
        break;
      case KeyCodeEnum.left:
        event.preventDefault();
        // 按下左箭头，时间后退5秒
        if (!live) {
          // 直播不能后退
          playerInstance.seek(playerInstance.currentTime - 5);
        }
        this._emit(PlayerEvents.KEYBOARD_LEFT);
        break;
      case KeyCodeEnum.right:
        event.preventDefault();
        if (!live) {
          // 按下右箭头，时间前进5秒
          playerInstance.seek(playerInstance.currentTime + 5);
        }
        this._emit(PlayerEvents.KEYBOARD_RIGHT);
        break;
      case KeyCodeEnum.up:
        event.preventDefault();
        // 按下上箭头，音量增大
        playerInstance.setVolume(playerInstance.volume + 0.1);
        this._emit(PlayerEvents.KEYBOARD_UP);
        break;
      case KeyCodeEnum.down:
        event.preventDefault();
        // 按下下箭头，音量减少
        playerInstance.setVolume(playerInstance.volume - 0.1);
        this._emit(PlayerEvents.KEYBOARD_DOWN);
        break;
    }
  }

  // 事件监听
  private _on(eventName: string, handler: Function) {
    this._playerInstance.$eventBus.$on(eventName, handler);
  }

  private _emit(eventName: string, data?: any) {
    this._playerInstance.$eventBus.$emit(eventName, data);
  }

  private _destroy() {
    this._eventManager.removeEventListener();
  }
}

export default ShortcutKey;
