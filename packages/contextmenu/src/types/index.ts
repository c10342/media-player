export interface ContextmenuOptions {
  menuList: MenuList;
}

export type MenuList =
  | Array<MenuItem>
  | Array<MenuItemLine>
  | Array<SubMenuItem>;

export type MenuItemType = "MenuItem" | "SubMenuItem" | "MenuLine";

export interface MenuItem {
  type: "MenuItem";
  label: string;
  callback?: Function;
  eventName?: string;
  desc?: string;
  [key: string]: any;
}
export interface MenuItemLine {
  type: "MenuLine";
}

export interface SubMenuItem {
  type: "SubMenuItem";
  label: string;
  subMenuList: Omit<MenuItem, "type">[];
}
