# 缩放

## 演示

<zoom-use />

::: tip 提示

拖拽播放器右下方的小红点可进行缩放

:::

::: warning 警告

此插件只适用于 pc 端

:::

## 安装

```bash
npm i @lin-media/zoom
```

## 初始化

```javascript
import Player from "@lin-media/player";
import "@lin-media/zoom";

const player = new Player({
  // ...
  Components: {
    Zoom: {
      // 是否允许横向缩放，默认true
      x: true,
      // 是否允许纵向缩放，默认true
      y: true,
      // 最大缩放宽度
      maxWidth: 400,
      // 最大缩放高度
      maxHeight: 400,
      // 最小缩放高度
      minHeight: 100,
      // 最小缩放宽度
      minWidth: 100
    }
  }
});

// 监听缩放事件
player.$on("zoom", (item) => {
  console.log(item);
});
```

## Zoom 参数

| 参数      | 说明                    | 类型    | 可选值 | 默认值 |
| --------- | ----------------------- | ------- | ------ | ------ |
| x         | 是否允许 x 轴缩放，可选 | boolean | —      | true   |
| y         | 是否允许 y 轴缩放，可选 | boolean | —      | true   |
| maxWidth  | 最大缩放宽度，可选      | number  | —      | —      |
| maxHeight | 最大缩放高度，可选      | number  | —      | —      |
| minHeight | 最小缩放高度，可选      | number  | —      | 0      |
| minWidth  | 最小缩放宽度，可选      | number  | —      | 0      |

## 事件

| 事件名称 | 说明       | 回调参数                     |
| -------- | ---------- | ---------------------------- |
| zoom     | 缩放时触发 | {width:number,height:number} |
