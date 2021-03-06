# 截图

## 演示

<screenshot-use />

## 安装

```bash
npm i @lin-media/screenshot
```

## 初始化

```javascript
import MediaPlayer from "@lin-media/player";
import Screenshot from "@lin-media/screenshot";
MediaPlayer.use(Screenshot);

const player = new MediaPlayer({
  // ...
  Screenshot: {
    // 点击后自动下载,默认true，你可以设置为false，然后通过事件监听来自定义点击之后的操作
    download: true
  }
});

// 监听点击事件
player.$on("screenshot", (imageBase64) => {
  console.log(imageBase64);
});

// 调用截图方法，请务必当open为true是才能使用该方法，false的是时候是不会往实例上面挂载该方法的
player.screenshot.snapshot();
```

::: warning 警告

该插件需要视频开启跨域功能，否则无法截图

:::

## Screenshot 参数


::: tip 提示

Screenshot 参数设置为 `false` 可关闭插件功能

:::


| 参数     | 说明                                                        | 类型    | 可选值 | 默认值         |
| -------- | ----------------------------------------------------------- | ------- | ------ | -------------- |
| download | 是否点击后自动下载                                          | boolean | —      | true           |
| picName  | 下载的图片名称                                              | string  | —      | screenshot.png |

## 事件

| 事件名称   | 说明           | 回调参数    |
| ---------- | -------------- | ----------- |
| screenshot | 截图的时候触发 | base64 图片 |

## API

- `player.screenshot.snapshot()` : 调用截图方法
