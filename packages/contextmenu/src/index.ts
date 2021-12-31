import MediaPlayer from "@lin-media/player";
import {
  EventManager,
  isArray,
  isFunction,
  isString,
  getViewPortInfo,
  updateStyle
} from "@lin-media/utils";
import { pluginName } from "./config/constant";
import { ContextmenuOptions, MenuItem } from "./types";
import menuListTpl from "./template/menu-list";

import "./style/index.scss";

class Contextmenu {
  static pluginName = pluginName;
  private _playerInstance: MediaPlayer;
  private _options: ContextmenuOptions;
  private _eventManager = new EventManager();
  private _el: HTMLElement;
  private _wrapperElement: HTMLElement | null;
  constructor(playerInstance: MediaPlayer, el: HTMLElement) {
    this._el = el;
    this._playerInstance = playerInstance;
    const options = playerInstance.$options[pluginName] ?? {};
    this._options = { ...options };
    const menuList = this._options.menuList;
    if (isArray(menuList) && menuList.length > 0) {
      this._createElement();
      this._initListener();
    }
  }

  private _initListener() {
    this._eventManager.addEventListener({
      element: document,
      eventName: "click",
      handler: this._onDocumentClick.bind(this)
    });
    this._eventManager.addEventListener({
      element: document,
      eventName: "contextmenu",
      handler: this._onContextmenu.bind(this)
    });
    this._eventManager.addEventListener({
      element: this._el.querySelector(".player-video-mask") as HTMLElement,
      eventName: "click",
      handler: this._onDocumentClick.bind(this)
    });
    this._eventManager.addEventListener({
      element: this._wrapperElement,
      eventName: "click",
      handler: this._onMenuClick.bind(this)
    });
    this._eventManager.addEventListener({
      element: window,
      eventName: "scroll",
      handler: this._hideMenu.bind(this)
    });
    this._playerInstance.$on(
      MediaPlayer.PlayerEvents.DESTROY,
      this._destroy.bind(this)
    );
  }

  private _onMenuClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dataset = target.dataset;
    if (dataset) {
      const menuList = this._options.menuList as any;
      let menuItem = null;

      if (dataset.parent && dataset.index) {
        menuItem = menuList[dataset.parent]["subMenuList"][dataset.index];
      } else if (dataset.index) {
        menuItem = menuList[dataset.index];
      }
      if (menuItem) {
        this._handelMenuItemClick(menuItem);
      }
    }
  }

  private _handelMenuItemClick(menuItem: MenuItem) {
    if (isFunction(menuItem.callback)) {
      menuItem.callback(menuItem);
    }
    if (isString(menuItem.eventName)) {
      this._playerInstance.$emit(menuItem.eventName, menuItem);
    }
    this._hideMenu();
  }

  private _onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this._wrapperElement?.contains(target)) {
      this._hideMenu();
    }
  }

  private _createElement() {
    const div = document.createElement("div");
    div.className = "contextmenu-container";
    div.innerHTML = menuListTpl({
      ...this._options
    });
    if (this._options.menuItemWidth) {
      updateStyle(div, {
        width: this._options.menuItemWidth
      });
    }
    this._el.appendChild(div);
    this._wrapperElement = div;
  }

  private _onContextmenu(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this._el.contains(target)) {
      this._hideMenu();
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this._showMenu();
    this._adjustPosition(event);
  }

  private _showMenu() {
    updateStyle(this._wrapperElement, {
      display: "block"
    });
  }
  private _hideMenu() {
    updateStyle(this._wrapperElement, {
      display: ""
    });
  }

  private _adjustPosition(event: MouseEvent) {
    if (!this._wrapperElement) {
      return;
    }
    let y = event.clientY;
    let x = event.clientX;
    const scrollWidth = this._wrapperElement.scrollWidth;
    const scrollHeight = this._wrapperElement.scrollHeight;
    const viewPortInfo = getViewPortInfo();
    if (
      scrollHeight > viewPortInfo.clientHeight - event.clientY &&
      scrollHeight < event.clientY
    ) {
      y = event.clientY - scrollHeight;
    }
    if (
      scrollWidth > viewPortInfo.clientWidth - event.clientX &&
      scrollWidth < event.clientX
    ) {
      x = event.clientX - scrollWidth;
    }
    updateStyle(this._wrapperElement, {
      top: `${y}px`,
      left: `${x}px`
    });
  }

  private _destroy() {
    this._eventManager.removeEventListener();
  }
}

export default Contextmenu;
