# 自定义进度条提示点

## 安装

```bash
npm i @lin-media/highlight
```

## 初始化

```javascript
import MediaPlayer from "@lin-media/player";
import Highlight from "@lin-media/highlight";
MediaPlayer.use(Highlight);

const highlightList = [
  {
    time: 20,
    text: "这是第 20 秒"
  }
];
const player = new MediaPlayer({
  // ...
  Highlight: {
    // 点击跳转到提示点的时间点，默认true
    jump: true,
    // 显示点击的提示点的文本，默认true
    showTip: true
    // 提示点列表，直接通过options参数传入，或者调用set()
    list:highlightList
  }
});

// 或者通过 `player.highlight.set()` 设置。
player.highlight.set(highlightList);

// 销毁提示点
player.highlight.destroy();

// 监听提示点点击事件
player.$on("highlight-click", (item) => {
  console.log(item);
});
```

## Highlight 参数

| 参数    | 说明                         | 类型    | 可选值 | 默认值 |
| ------- | ---------------------------- | ------- | ------ | ------ |
| jump    | 点击是否跳转到提示点的时间点 | boolean | —      | true   |
| showTip | 是否显示点击的提示点的文本   | boolean | —      | true   |
| list    | 提示点列表，格式见下方       | Array   | —      | —      |

## 事件

| 事件名称        | 说明                 | 回调参数 |
| --------------- | -------------------- | -------- |
| highlight-click | 点击提示点的时候触发 | event    |

## API

- `player.highlight.set(list:Array)` : 设置提示点列表

- `player.highlight.destroy()` : 销毁提示点

## list 格式

| 字段 | 说明     | 类型    |
| ---- | -------- | ------- |
| time | 时间点   | number |
| text | 显示文本 | string  |

