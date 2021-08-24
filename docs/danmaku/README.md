# 弹幕

## 演示

<danmaku-use/>

## 安装

```bash
npm i @lin-media/danmaku
```

## 初始化

```javascript
import MediaPlayer from "@lin-media/player";
import Danmaku from "@lin-media/danmaku";
MediaPlayer.use(Danmaku);

const player = new MediaPlayer({
  // ...
  danmakuOptions: {
    // 弹幕字体颜色，随机
    fontColors: ["blue", "red", "green", "#fff"],
    // 弹幕字体大小随机
    fontSizes: [16, 18, 20, 22, 24, 26, 28]
  }
});
```

## danmakuOptions 参数

| 参数           | 说明                             | 类型          | 可选值 | 默认值          |
| -------------- | -------------------------------- | ------------- | ------ | --------------- |
| trackSize      | 轨道高度，可选                         | number        | —      | 12              |
| renderInterval | 弹幕数据队列默认轮询间隔时间，可选     | number        | —      | 150             |
| speedArg       | 移动速率，可选                         | number        | —      | 0.0058          |
| discardTime    | 弹幕的超时时间，超过时间会被丢弃，可选 | number        | —      | 5 \* 60 \* 1000 |
| fontColors     | 弹幕字体颜色，随机，可选               | Array&lt;string&gt; | —      | —               |
| fontSizes      | 弹幕字体大小，随机，可选               | Array&lt;number&gt; | —      | —               |

## API

- `player.danmaku.send(message)`：发送消息弹幕，message 格式见下方
- `player.danmaku.play()`：开始弹幕
- `player.danmaku.pause()`：暂停弹幕
- `player.danmaku.resize()`：容器发生变化时调用
- `player.danmaku.clearScreen()`：清屏，移除所有弹幕
- `player.danmaku.close()`：关闭弹幕
- `player.danmaku.open()`：打开弹幕

## message 参数格式

- `player.danmaku.send('你好')`
- `player.danmaku.send({text:'你好',fontColor:30})`
- `player.danmaku.send([{text:'你好',fontColor:30},{text:'世界',fontColor:'blue'}])`

当参数是`Object`或者`Array`类型时，下列字段可选

| 字段      | 说明                 | 类型   |
| --------- | -------------------- | ------ |
| text      | 弹幕文本             | string |
| fontSize  | 字体大小，可选             | number |
| fontColor | 字体颜色，可选             | string |
| rollTime  | 弹幕移动时间，单位秒，可选 | number |

## 自定义语言包

```javascript
MediaPlayer.useLang({
  danmaku: {
    full: "全屏",
    top: "顶部",
    bottom: "底部",
    pause: "暂停弹幕",
    show: "显示弹幕",
    opacity: "透明度",
    speed: "弹幕速度",
    showArea: "显示区域"
  }
});
```
