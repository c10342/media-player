# 自定义进度条提示点

## 安装

```bash
npm i @media/highlight
```

## 初始化

```javascript
import VideoPlayer from "@media/player";
import Highlight from "@media/highlight";
VideoPlayer.use(Highlight);

const highlightList = [
  {
    time: 20,
    text: "这是第 20 秒"
  }
];
const player = new VideoPlayer({
  el: ".container",
  videoList: [
    "http://127.0.0.1:8081/demo.mp4",
    "http://127.0.0.1:8081/demo.mp4",
    "http://127.0.0.1:8081/demo.mp4"
  ],
  type: "mp4",
  // 直接通过options参数传入，或者调用setHighlight()
  highlightList,
});

// 或者通过 `player.setHighlight()` 设置。
// 一般知识点都是通过接口请求回来的，所以用这个可以动态设置知识点高亮
player.setHighlight(highlightList);

// 销毁知识点高亮
player.destroyHighlight();
```

注意：`setHighlight`，`destroyHighlight`是通过插件扩展出来的，如果没有使用`Highlight`这个插件，就不要用乱用这些方法！！！
