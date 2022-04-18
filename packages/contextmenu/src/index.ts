import Player from "@lin-media/player";
import {
  isArray,
  isFunction,
  isString,
  getViewPortInfo,
  updateStyle
} from "@lin-media/utils";
import { ContextmenuOptions, MenuItem } from "./types";
import menuListTpl from "./template/menu-list";

import "./style/index.scss";

const Component = Player.getComponent<ContextmenuOptions>("Component");

class Contextmenu extends Component {
  private wrapperElement: HTMLElement | null;
  constructor(
    player: Player,
    slotElement: HTMLElement,
    options: ContextmenuOptions
  ) {
    super(player, slotElement, options);
    const menuList = this.options.menuList;
    if (isArray(menuList) && menuList.length > 0) {
      this.createElement();
      this.initListener();
    }
  }

  private initListener() {
    this.eventManager.addEventListener({
      element: document,
      eventName: "click",
      handler: this.onDocumentClick.bind(this)
    });
    this.eventManager.addEventListener({
      element: document,
      eventName: "contextmenu",
      handler: this.onContextmenu.bind(this)
    });
    this.eventManager.addEventListener({
      element: this.slotElement.querySelector(
        ".player-video-mask"
      ) as HTMLElement,
      eventName: "click",
      handler: this.onDocumentClick.bind(this)
    });
    this.eventManager.addEventListener({
      element: this.wrapperElement,
      eventName: "click",
      handler: this.onMenuClick.bind(this)
    });
    this.eventManager.addEventListener({
      element: window,
      eventName: "scroll",
      handler: this.hideMenu.bind(this)
    });
  }

  private onMenuClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dataset = target.dataset;
    if (dataset) {
      const menuList = this.options.menuList as any;
      let menuItem = null;

      if (dataset.parent && dataset.index) {
        menuItem = menuList[dataset.parent]["subMenuList"][dataset.index];
      } else if (dataset.index) {
        menuItem = menuList[dataset.index];
      }
      if (menuItem) {
        this.handelMenuItemClick(menuItem);
      }
    }
  }

  private handelMenuItemClick(menuItem: MenuItem) {
    if (isFunction(menuItem.callback)) {
      menuItem.callback.apply(this.player, [menuItem]);
    }
    if (isString(menuItem.eventName)) {
      this.player.$emit(menuItem.eventName, menuItem);
    }
    this.hideMenu();
  }

  private onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.wrapperElement?.contains(target)) {
      this.hideMenu();
    }
  }

  private createElement() {
    const div = document.createElement("div");
    div.className = "contextmenu-container";
    div.innerHTML = menuListTpl({
      ...this.options
    });
    if (this.options.menuItemWidth) {
      updateStyle(div, {
        width: this.options.menuItemWidth
      });
    }
    this.slotElement.appendChild(div);
    this.wrapperElement = div;
  }

  private onContextmenu(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.slotElement.contains(target)) {
      this.hideMenu();
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.showMenu();
    this.adjustPosition(event);
  }

  private showMenu() {
    updateStyle(this.wrapperElement, {
      display: "block"
    });
  }
  private hideMenu() {
    updateStyle(this.wrapperElement, {
      display: ""
    });
  }

  private adjustPosition(event: MouseEvent) {
    if (!this.wrapperElement) {
      return;
    }
    let y = event.clientY;
    let x = event.clientX;
    const scrollWidth = this.wrapperElement.scrollWidth;
    const scrollHeight = this.wrapperElement.scrollHeight;
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
    updateStyle(this.wrapperElement, {
      top: `${y}px`,
      left: `${x}px`
    });
  }

  destroy() {
    // this.eventManager.removeEventListener();
    super.destroy();
  }
}

export default Contextmenu;
