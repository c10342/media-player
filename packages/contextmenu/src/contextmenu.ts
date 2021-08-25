import MediaPlayer from "@lin-media/player";
import { EventManager, isArray } from "@lin-media/utils";
import { pluginName } from "./config/constant";
import { ContextmenuOptions } from "./types";
import menuListTpl from "./template/menu-list.art";

import "./style/index.scss";

class Contextmenu {
  static pluginName = pluginName;
  private _instance: MediaPlayer;
  private _parentElement: HTMLElement;
  private _options: ContextmenuOptions;
  private _eventManager: EventManager;
  private _el: HTMLElement;
  private _wrapperElement: HTMLElement;
  constructor(el: HTMLElement, instance: MediaPlayer) {
    this._el = el;
    this._instance = instance;
    this._parentElement = instance.options.el as HTMLElement;
    const options = instance.options[pluginName] ?? {};
    this._options = { ...options };
    this._initVar();
    if (isArray(this._options.menuList) && this._options.menuList.length > 0) {
      this._createElement();
      this._initListener();
    }
  }

  private _initVar() {
    this._eventManager = new EventManager();
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
  }

  private _onMenuClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dataset = target.dataset;
    if (dataset) {
      const menuList = this._options.menuList as any;
      let menuItem = null;
      if (dataset.parent && dataset.index) {
        menuItem = menuList[dataset.parent][dataset.index];
      } else if (dataset.index) {
        menuItem = menuList[dataset.index];
      }
      if (menuItem) {
        console.log(menuItem);
      }
    }
  }

  private _onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this._wrapperElement.contains(target)) {
      this._hideMenu();
    }
  }

  private _createElement() {
    const div = document.createElement("div");
    div.className = "contextmenu-container";
    div.innerHTML = menuListTpl({
      ...this._options
    });
    this._parentElement.appendChild(div);
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
    this._wrapperElement.style.display = "block";
  }
  private _hideMenu() {
    this._wrapperElement.style.display = "";
  }

  private _adjustPosition(event: MouseEvent) {
    let y = event.pageY;
    let x = event.pageX;
    const scrollWidth = this._wrapperElement.scrollWidth;
    const scrollHeight = this._wrapperElement.scrollHeight;
    if (
      scrollHeight > window.innerHeight - event.pageY &&
      scrollHeight < event.pageY
    ) {
      y = event.pageY - scrollHeight;
    }
    if (
      scrollWidth > window.innerWidth - event.pageX &&
      scrollWidth < event.pageX
    ) {
      x = event.pageX - scrollWidth;
    }
    this._wrapperElement.style.top = `${y}px`;
    this._wrapperElement.style.left = `${x}px`;
  }
}

export default Contextmenu;
