# 右键菜单

## 安装

```bash
npm i @lin-media/contextmenu
```

## 初始化

```javascript
import Player from "@lin-media/player";
import "@lin-media/contextmenu";

const contextMenuList = [
  {
    label: "播放",
    desc: "描述信息",
    type: "MenuItem",
    callback: () => {
      player.play();
    },
    eventName: "click-play"
  },
  {
    label: "暂停",
    type: "MenuItem",
    callback: () => {
      player.pause();
    }
  },
  {
    label: "播放/暂停",
    type: "MenuItem",
    callback: () => {
      player.toggle();
    }
  },
  {
    type: "MenuLine"
  },
  {
    type: "SubMenuItem",
    label: "倍数",
    subMenuList: [
      {
        label: "0.5x",
        callback: () => {
          player.setSpeed(0.5);
        }
      },
      {
        label: "1x",
        callback: () => {
          player.setSpeed(1);
        }
      },
      {
        label: "1.5x",
        callback: () => {
          player.setSpeed(1.5);
        }
      }
    ]
  },
  {
    type: "SubMenuItem",
    label: "清晰度",
    subMenuList: [
      {
        label: "标清",
        callback: () => {
          player.switchDefinition(0);
        }
      },
      {
        label: "高清",
        callback: () => {
          player.switchDefinition(1);
        }
      }
    ]
  }
];
const player = new Player({
  // ...
  Contextmenu: {
    // 一级菜单宽度
    menuItemWidth: "300px",
    // 二级菜单宽度
    subMenuItemWidth: "100px"
  }
});

player.$on("click-play", (item) => {
  console.log(item);
});
```

## Contextmenu 参数

| 参数             | 说明                 | 类型   | 可选值 | 默认值 |
| ---------------- | -------------------- | ------ | ------ | ------ |
| menuList         | 菜单列表，格式见下方 | Array  | —      | —      |
| menuItemWidth    | 一级菜单宽度         | string | —      | 250px  |
| subMenuItemWidth | 二级菜单宽度         | string | —      | 80%    |

## menuList 参数格式

菜单项分为三种格式，分别是：MenuItem，MenuItemLine，SubMenuItem

MenuItem：

| 字段      | 说明                                                           | 类型   |
| --------- | -------------------------------------------------------------- | ------ |
| type      | 菜单类型，值为:`MenuItem`                                      | string |
| label     | 菜单文本                                                       | string |
| callback  | 回调函数，可选。存在时，点击菜单项会执行，回调参数：`MenuItem` | Function |
| eventName | 自定义事件，可选。存在时，点击菜单项会广播事件                 | string |
| desc      | 描述信息，可选。                                               | string |

MenuItemLine：

| 字段 | 说明                      | 类型   |
| ---- | ------------------------- | ------ |
| type | 菜单类型，值为:`MenuLine` | string |

SubMenuItem：

| 字段        | 说明                                   | 类型   |
| ----------- | -------------------------------------- | ------ |
| type        | 菜单类型，值为:`SubMenuItem`           | string |
| label       | 菜单文本                               | string |
| subMenuList | 二级菜单列表，列表项请参考：`MenuItem` | Array&lt;MenuItem&gt; |
