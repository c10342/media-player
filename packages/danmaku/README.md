# 弹幕

## 安装

```bash
npm i @media/danmaku
```

## 初始化

```javascript
import VideoPlayer from "@media/player";
import Danmaku from "@media/danmaku";
VideoPlayer.use(Danmaku);

const player = new VideoPlayer({
  // ...
  danmakuOptions: {
    // 弹幕字体颜色，随机
    fontColors: ["blue", "red", "green", "#000"],
    // 弹幕字体大小随机
    fontSizes: [16, 18, 20, 22, 24, 26, 28]
  }
});
```

## danmakuOptions 参数

| 参数           | 说明                             | 类型          | 可选值 | 默认值        |
| -------------- | -------------------------------- | ------------- | ------ | ------------- |
| trackSize      | 轨道高度                         | number        | —      | 12            |
| renderInterval | 弹幕数据队列默认轮询间隔时间     | number        | —      | 150           |
| speedArg       | 移动速率                         | number        | —      | 0.0058        |
| discardTime    | 弹幕的超时时间，超过时间会被丢弃 | number        | —      | 5 _ 60 _ 1000 |
| fontColors     | 弹幕字体颜色，随机               | Array<string> | —      | —             |
| fontSizes      | 弹幕字体大小,随机                | Array<number> | —      | —             |

## api

- `player.send(message)`：发送消息弹幕，message 格式见下方
- `player.play()`：开始弹幕
- `player.pause()`：暂停弹幕
- `player.resize()`：容器发生变化时调用
- `player.clearScreen()`清屏，移除所有弹幕

## message 格式

- `player.send('你好')`
- `player.send({text:'你好',fontColor:30})`
- `player.send([{text:'你好',fontColor:30},{text:'世界',fontColor:'blue'}])`

当参数是`Object`或者`Array`类型时，下列字段可选

| 字段      | 说明         | 类型   |
| --------- | ------------ | ------ |
| text      | 弹幕文本     | string |
| fontSize  | 字体大小     | number |
| fontColor | 字体颜色     | string |
| rollTime  | 弹幕移动时间 | number |
