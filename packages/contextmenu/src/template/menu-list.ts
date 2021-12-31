import { MENUITEM, MENULINE, SUBMENUITEM } from "../config/constant";
import { MenuItem, MenuList, SubMenuItem, SubMenuList } from "../types";

interface Params {
  menuList: MenuList;
  subMenuItemWidth?: string;
}

function getMenuItemHtml(value: MenuItem, index: number) {
  return `
  <div class="contextmenu-item" data-index='${index}'>
    <span class="contextmenu-item-info">${value.label}</span>
    ${
      value.desc
        ? `<span class="contextmenu-item-desc">${value.desc}</span>`
        : ""
    }
  </div>
  `;
}

function getSubMenuItemHtml(
  value: SubMenuItem,
  index: number,
  subMenuItemWidth?: string
) {
  function getListHtml(subMenuList: SubMenuList) {
    if (subMenuList && subMenuList.length > 0) {
      return `
      <div class="contextmenu-subMenu-container" ${
        subMenuItemWidth ? `style='width:${subMenuItemWidth};'` : ""
      }>
      ${subMenuList
        .map((subMenuItem, i) => {
          return `
        <div class="contextmenu-item" data-parent='${index}' data-index='${i}'>
          <span class="contextmenu-item-info">${subMenuItem.label}</span>
          ${
            subMenuItem.desc
              ? `<span class="contextmenu-item-desc">${subMenuItem.desc}</span>`
              : ""
          }
        </div>
        `;
        })
        .join("")}
      </div>
      `;
    }
    return "";
  }
  return `
  <div class="contextmenu-item">
    <span class="contextmenu-item-info">${value.label}</span>
    <span class='contextmenu-icon-right'></span>
    ${getListHtml(value.subMenuList)}
  </div>
  `;
}

export default function getMenuList({ menuList, subMenuItemWidth }: Params) {
  if (menuList && menuList.length > 0) {
    return menuList
      .map((value, index) => {
        if (value.type === MENUITEM) {
          return getMenuItemHtml(value, index);
        } else if (value.type === SUBMENUITEM) {
          return getSubMenuItemHtml(value, index, subMenuItemWidth);
        } else if (value.type === MENULINE) {
          return `<div class="contextmenu-line"></div>`;
        }
        return "";
      })
      .join("");
  }
  return "";
}
