# 截图

## 安装

```bash
npm i @media/screenshot
```

## 初始化

```javascript
import MediaPlayer from "@media/player";
import Screenshot from "@media/screenshot";
MediaPlayer.use(Screenshot);

const player = new MediaPlayer({
  // ...
  screenshotOptions: {
    // 是否开启功能，默认为true，如果是通过全局注册的插件，可通过该选项关闭功能
    open: true,
    // 点击后自动下载,默认true，你可以设置为false，然后通过事件监听来自定义点击之后的操作
    download: true
  }
});

// 监听点击事件
player.$on("screenshot", (imageBase64) => {
  console.log(imageBase64);
});

// 调用截图方法，请务必当open为true是才能使用该方法，false的是时候是不会往实例上面挂载该方法的
player.screenshot();
```

注意：该插件需要视频开启跨域功能，否则无法截图

## screenshotOptions 参数

| 参数     | 说明                                                        | 类型    | 可选值 | 默认值 |
| -------- | ----------------------------------------------------------- | ------- | ------ | ------ |
| open     | 是否开启功能,如果是通过全局注册的插件，可通过该选项关闭功能 | boolean | —      | true   |
| download | 是否点击后自动下载                                          | boolean | —      | true   |
| picName | 下载的图片名称                                          | string | —      | screenshot.png   |

## 事件

| 事件名称   | 说明           | 回调参数    |
| ---------- | -------------- | ----------- |
| screenshot | 截图的时候触发 | base64 图片 |

## api

- `player.screenshot()` : 调用截图方法，请务必当 open 为 true 是才能使用该方法
