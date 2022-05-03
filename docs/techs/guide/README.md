# Tech 介绍

你可以结合其他`ESM`库支持其他格式的视频播放

## Tech 开发

下面结合`hls.js`来支持播放`m3u8`

```typescript
import Hls from "hls.js";

const Tech = Player.getTech("Tech");

class HlsHandler extends Tech {
  static canHandleSource(source: SourceItem, options: PlayerConfig): string {
    if (source.type === "video/hls") {
      return "maybe";
    }
    return "";
  }
  private hls: Hls;
  constructor(
    player: Player,
    videoElement: HTMLVideoElement,
    source: SourceItem,
    options: TechOptions
  ) {
    super(player, videoElement, source, options);
    this.initVideo();
    this.triggerReady();
  }

  private initVideo() {
    const video = this.videoElement;
    const videoSrc = this.source.url;
    if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.loadSource(videoSrc);
      this.hls.attachMedia(video);
    } else if (canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
    }
  }

  destroy() {
    if (this.hls) {
      this.hls.destroy();
    }
    super.destroy();
  }
}
```

**canHandleSource**

静态函数，用来判断是否支持对应的视频格式播放。返回空字符串表示不支持

**constructor**

Tech 在初始化的时候会接受到四个参数：

- `player`：播放器实例

- `videoElement`：`video`标签元素

- `source`：视频播放参数

- `options`：初始化配置

**destroy**

成员函数（可选），播放器在销毁的时候，会调用`destroy`来执行销毁操作。如果你需要自己实现`destroy`成员函数，请务必调用`super.destroy()`，否则可能会导致某些副作用代码无法被销毁

::: warning 警告
在 Tech 初始化完毕之后，必须调用`this.triggerReady()`方法
:::

## 注册 Tech

注册 Tech 的方式如下：

```typescript
Player.registerTech("HlsHandler", HlsHandler, options);
```

**options 参数格式**

| 参数     | 说明         | 类型   | 可选值 | 默认值 |
| -------- | ------------ | ------ | ------ | ------ |
| defaults | 默认配置参数 | Object | —      | —      |

## Tech 的初始化

默认的情况下，播放器会根据`Tech`的注册顺序，顺序查找，从中找出一个合适的`Tech`来处理视频的播放。当然你也可以使用`techsOrder`配置参数来调整查找的顺序

## 传递参数

如果你想在`Tech`初始化的时候传递一些参数。你可以在注册`Tech`的时候通过`defaults`选项给`Tech`提供默认的参数。或者在初始化配置中传入一个`JSON`对象。`Tech`初始化的时候，会将默认参数和初始化配置中的参数进行合并，传递给`Tech`进行初始化。

```typescript
Player.registerTech("HlsHandler", HlsHandler, {
  defaults: { age: 14 }
});
```

```typescript
const player = new Player({
  techs: {
    HlsHandler: {
      name: "张三"
    }
  }
});
```

最终传入到`Tech`中的参数是：

```json
{
  "age": 14,
  "name": "张三"
}
```

## 钩子函数

播放器提供了`beforeTechSetup`，`afterTechSetup`，`beforeTechDestroy`，`afterTechDestroy`四个钩子函数来让外部知道`Tech`是何时进行初始化的，何时进行销毁的。

对于某些插件/组件需要依赖于`Tech`的时候，可以通过这些钩子函数来得知所依赖的`Tech`的初始化和销毁时机，从而执行某些任务

使用如下方法进行监听：

```typescript
player.$on("beforeTechSetup", ({ name }: { name: string }) => {
  console.log("beforeTechSetup", name);
});
```

| 事件名称          | 说明                 | 回调参数                    |
| ----------------- | -------------------- | --------------------------- |
| beforeTechSetup   | `Tech`开始初始化前   | { name: string }            |
| afterTechSetup    | `Tech`初始化完成之后 | { name: string,tech: Tech } |
| beforeTechDestroy | `Tech`开始销毁前     | { name: string,tech: Tech } |
| afterTechDestroy  | `Tech`销毁完成之后   | { name: string }            |

- `name`：`Tech`的名称，使用注册的时候的名称

- `tech`：`Tech`的实例

## 其他

**获取`Tech`**

所有的`Tech`获取都是通过`Player.registerTech`静态函数获取的

```typescript
const Plugin = Player.registerTech("Tech");
```

**移除`Tech`**

所有的`Tech`移除都是通过`Player.removeTech`静态函数移除的

```typescript
Player.removeTech("Tech");
```
