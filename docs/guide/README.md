# 指南

## 演示

<base-use/>

## 安装

```bash
npm i @lin-media/player
```

## 快速开始

我们先初始化一个最简单的播放器

```css
.container {
  width: 800px;
  height: 400px;
}
```

```html
<div class="container"></div>
```

```javascript
import MediaPlayer from "@lin-media/player";

const player = new MediaPlayer({
  // 容器
  el: ".container",
  // 视频列表
  videoList: [
    {
      label: "标清",
      url: "http://127.0.0.1/demo.mp4"
    },
    {
      label: "高清",
      url: "http://127.0.0.1/demo.mp4"
    }
  ]
});
```

一个简单的`MediaPlayer`实例已经初始化完成了，它已经具有一些基本的功能了

## 参数

你可以通过下面的参数来自定义你的播放器具体需要什么功能

| 参数        | 说明                                               | 类型                               | 可选值               | 默认值      |
| ----------- | -------------------------------------------------- | ---------------------------------- | -------------------- | ----------- |
| el          | 播放容器                                           | String，HTMLElement                | —                    | —           |
| videoList   | 视频播放列表，格式见下方                           | Array                              | —                    | —           |
| speedList   | 倍数列表，可选，格式见下方                         | Array                              | —                    | —           |
| plugins     | 注册局部插件，可选                                 | Array                              | —                    | —           |
| autoplay    | 是否自动播放，可选                                 | Boolean                            | —                    | false       |
| muted       | 是否静音，一般配合 autoplay 属性实现自动播放，可选 | Boolean                            | —                    | false       |
| customType  | 自定义 esm，可选，格式见下方                       | Function                           | —                    | —           |
| live        | 是否为直播，可选                                   | Boolean                            | —                    | false       |
| crossorigin | 是否开启跨域，可选                                 | Boolean                            | —                    | true        |
| preload     | 视频预加载，可选                                   | String                             | none，metadata，auto | auto        |
| poster      | 视频封面，可选                                     | String                             | —                    | —           |
| controls    | 播放器控件是否显示，可选，详细见下方                             | Boolean，ControlsObj | false，ControlsObj   | ControlsObj |
| lang    | 使用的语言                     | String | zh，en   | zh |
| customLanguage    | 自定义语言包                     | Object | —   | — |

### videoList 参数格式

| 字段    | 说明                     | 类型    |
| ------- | ------------------------ | ------- |
| label   | 清晰度文本               | String  |
| url     | 播放地址                 | String  |
| default | 是否默认播放该视频，可选 | Boolean |

### speedList 参数格式

| 字段    | 说明                             | 类型    |
| ------- | -------------------------------- | ------- |
| label   | 倍数文本                         | String  |
| value   | 倍数值，可选值 0-2               | Number  |
| default | 是否默认使用该倍数进行播放，可选 | Boolean |

### customType 函数参数

| 字段         | 说明             | 类型             |
| ------------ | ---------------- | ---------------- |
| videoElement | video 标签       | HTMLVideoElement |
| options      | videoList 列表项 | Object           |

### controls 参数格式

::: tip 注意
当 `controls` 值为 `false` 时，所有控件将不会显示。当 `controls` 值为一个对象时（即`ControlsObj`），可根据下方的字段来选择那些控件需要显示，那些不需要显示，其中 `true` 为显示控件， `false` 为隐藏控件。所有控件默认显示
:::

| 字段             | 说明               | 类型    | 默认值 |
| ---------------- | ------------------ | ------- | ------ |
| VideoPlayButton       | pc 端播放按钮控件  | Boolean | true   |
| VideoVolume           | 音量控件           | Boolean | true   |
| VideoLive             | 直播提示控件       | Boolean | true   |
| VideoSpeed            | 倍速控件           | Boolean | true   |
| VideoFullscreen       | 全屏控件           | Boolean | true   |
| VideoDefinition       | 清晰度控件         | Boolean | true   |
| VideoProgress         | 进度条控件         | Boolean | true   |
| VideoTip              | 通知提示控件       | Boolean | true   |
| VideoTime             | 时间控件           | Boolean | true   |
| VideoLoading          | loading 控件       | Boolean | true   |
| VideoFloatButton | 悬浮播放按钮控件 | Boolean | true   |
| VideoMask        | 视频遮罩层控件     | Boolean | true   |
| VideoControls       | 视频下方控制条     | Boolean | true   |
| DomResizeObserver        | 播放器`DOM`元素大小发生变化监听   | Boolean | true   |
| ShortcutKey        | 快捷键功能控件   | Boolean | true   |
| VideoPlayer        | 视频播放控件   | Boolean | true   |

## 事件绑定

`player.$on(eventName: string, handler: Function)`

```javascript
player.$on("ended", function () {
  console.log("player ended");
});
```

- **播放器自定义事件**

| 事件名称                | 说明                     | 回调参数 |
| ----------------------- | ------------------------ | -------- |
| destroy                 | 播放器销毁时触发         | —        |
| switch_definition_start | 清晰度切换前触发         | —        |
| switch_definition_end   | 清晰度切换后触发         | —        |
| enter_browser_screen    | 浏览器进入全屏时触发     | —        |
| exit_browser_screen     | 浏览器退出全屏时触发     | —        |
| enter_web_screen        | 网页进入全屏时触发       | —        |
| exit_web_screen         | 网页退出全屏时触发       | —        |
| show_controls           | 控制条显示时触发         | —        |
| hide_controls           | 控制条隐藏时触发         | —        |
| resize                  | 播放器大小发生变化时触发 | —        |
| keyboard_right                  | 按下键盘 → 键时触发   | —        |
| keyboard_left                  | 按下键盘 ← 键时触发   | —        |
| keyboard_up                  | 按下键盘 ↑ 键时触发   | —        |
| keyboard_down                  | 按下键盘 ↓ 键时触发   | —        |
| keyboard_space                  | 按下键盘 空格 键时触发   | —        |

- **原生 video 标签事件**

| 事件名称       | 说明                                                    | 回调参数 |
| -------------- | ------------------------------------------------------- | -------- |
| abort          | 发生中断时触发                                          | event    |
| canplay        | 视频能够播放，但可能因缓冲停止时触发                    | event    |
| canplaythrough | 视频能够播放，并且无需因缓冲而停止，ie 上触发不了改事件 | event    |
| durationchange | 视频总时长发生变化时触发                                | event    |
| emptied        | 媒介资源元素突然为空时（网络错误、加载错误等）时触发    | event    |
| ended          | 视频播放结束时触发                                      | event    |
| error          | 视频加载发生错误时触发                                  | event    |
| loadeddata     | 加载数据时触发                                          | event    |
| loadedmetadata | 媒介元素的持续时间以及其他媒介数据已加载时触发          | event    |
| loadstart      | 开始加载数据时触发                                      | event    |
| pause          | 视频暂停触发                                            | event    |
| play           | 视频播放时触发                                          | event    |
| playing        | 视频已经开始播放时触发                                  | event    |
| progress       | 获取数据（缓冲数据）时触发                              | event    |
| ratechange     | 视频倍数发生变化时触发                                  | event    |
| seeked         | 跳转到指定时间之后触发，一般是用户拖拽进度条时触发的    | event    |
| seeking        | 正在跳转到指定的时间时触发                              | event    |
| stalled        | 取回媒介数据过程中（延迟）存在错误时触发                | event    |
| suspend        | 浏览器已在取媒介数据但在取回整个媒介文件之前停止时触发  | event    |
| timeupdate     | 播放位置发生变化时触发                                  | event    |
| volumechange   | 视频音量发生变化时触发                                  | event    |
| waiting        | 正在播放，但是因为缓冲而卡顿时触发                      | event    |

## API

**播放器实例方法：**

- `player.$on(eventName: string, handler: Function)` : 监听播放器自定义事件或者原生 video 标签事件

- `player.$emit(eventName: string, data?: any)` : 触发事件

- `player.$once(eventName: string, handler: Function)` : 监听播放器自定义事件或者原生 video 标签事件，只触发一次

- `player.$off(eventName: string, handler?: Function)` : 取消事件监听

- `player.play()` : 播放视频

- `player.pause()` : 暂停视频

- `player.seek(time: number)` : 跳转到指定时间

- `player.setNotice(text: string, time?: number)` : 显示通知

- `player.switchDefinition(index: number)` : 切换视频清晰度

- `player.setSpeed(playbackRate: number)` : 设置视频倍数

- `player.setVolume(volume: number)` : 设置视频音量

- `player.toggle()` : 切换视频播放状态，播放/暂停

- `player.fullScreen.request(type: string)` : 进入网页/浏览器全屏

```javascript
// 进入网页全屏
player.fullScreen.request("web");
// 进入浏览器全屏
player.fullScreen.request("browser");
```

- `player.fullScreen.cancel(type: string)` : 退出网页/浏览器全屏

```javascript
// 退出网页全屏
player.fullScreen.cancel("web");
// 退出浏览器全屏
player.fullScreen.cancel("browser");
```

- `player.showControls()` : 显示下方控制条

- `player.hideControls()` : 隐藏下方控制条

- `player.toggleControls()` : 切换下方控制条显示/隐藏状态

- `player.destroy()` : 销毁播放器

**播放器实例属性：**

- `player.videoElement` : 原生 video 标签

- `player.paused` : 视频是否处于暂停状态

- `player.currentTime` : 视频当前时间

- `player.duration` : 视频总时长

- `player.volume` : 当前音量

**播放器构造函数静态方法：**

- `MediaPlayer.useLang(lang:Object)` : 自定义语言包，会跟默认的语言包进行合并

```javascript
MediaPlayer.useLang({
  player: {
    live: "直播",
    goBack: "快退{time}秒",
    fastForward: "快进{time}秒",
    volume: "音量{volume}",
    switch: "已经切换至{quality}",
    invalidDefinition: "无效清晰度"
  }
  // 其他插件语言包
});
```

- `MediaPlayer.setLang(lang:string)` : 设置使用何种语言，zh/en，默认 zh

- `MediaPlayer.use(ctor: Function)` : 注册全局插件


**播放器构造函数静态属性：**

- `MediaPlayer.PlayerEvents` : 播放器自定义事件
  
- `MediaPlayer.VideoEvents` : video标签事件

- `MediaPlayer.globalConfig` : 默认的全局配置项，播放器在初始化的时候，会将用户传入的配置项跟全局的配置项进行合并，形成一个新的配置项

## 配合 MSE 库使用

你可以通过 `customType` 参数与任何 MSE 库一起使用，比如`hls.js`，`flv.js`

```javascript
import Hls from "hls.js";
import MediaPlayer from "@lin-media/player";

const player = new MediaPlayer({
  el: ".container",
  videoList: [
    {
      label: "标清",
      url: "https://127.0.0.1/demo.m3u8"
    },
    {
      label: "高清",
      url: "https://127.0.0.1/demo.m3u8"
    }
  ],
  customType(videoElement, videoObj) {
    const hls = new Hls();
    hls.loadSource(videoObj.url);
    hls.attachMedia(videoElement);
  }
});
```

## 直播

你可以把`MediaPlayer`用在直播中，你只需要把`live`参数设置为`true`即可。如果你需要在直播中使用弹幕，请使用弹幕插件。

```javascript
import Hls from "hls.js";
import MediaPlayer from "@lin-media/player";

const player = new MediaPlayer({
  el: ".container",
  videoList: [
    {
      label: "标清",
      url: "https://127.0.0.1/demo.m3u8"
    },
    {
      label: "高清",
      url: "https://127.0.0.1/demo.m3u8"
    }
  ],
  // 开启直播
  live: true,
  customType(videoElement, videoObj) {
    const hls = new Hls();
    hls.loadSource(videoObj.url);
    hls.attachMedia(videoElement);
  }
});
```

## 插件

### 介绍

- 播放器提供了插件功能，可自己定制一些需求，比如自定义进度条提示点，截图，弹幕等等。

- 插件的初始化时机是在播放器实例的所有东西初始化完成之后进行初始化的。这样子插件就可以访问到播放器实例上面的属性和方法，以及播放器的`DOM`元素

- 插件分为全局插件和局部插件，使用全局插件时，每个播放器实例都会具备全局插件的功能。使用局部插件时，只有当前播放器实例才会存在局部插件的功能。

  - 全局插件是通过`MediaPlayer.use(ctor: Function)`进行注册的

  - 局部插件是通过 options 参数中的`plugins`字段进行注册的

### 插件的构成

- 每一个插件都需要是一个构造器函数（类），并且需要包含`pluginName`静态属性（不写就默认使用构造器的 name 值），`pluginName` 是用来作为插件的唯一标识，同时外部可以通过`player.$plugins[pluginName]`访问到插件实例

- 构造器函数（类）会接受到两个参数：

  - instance：播放器实例，即`new MediaPlayer()`，你可以使用该实例提供的任意方法
  
  - el：整个播放器的 dom 元素，当你需要获取某个元素时，请使用`el.querySelector()`，而不是`document.querySelector()`。因为当你同时初始化了 2 个播放器的时候，`document.querySelector()`获取的始终是第一个元素

  

### 插件代码示例

**Test 插件：**

```javascript
import MediaPlayer from "@lin-media/player";

class Test {
  // 提供一个pluginName静态属性
  static pluginName = "Test";
  el = null;
  instance = null;

  constructor(instance,el) {
    // 保存接受到的两个参数
    this.el = el;
    this.instance = instance;
    // 往播放器实例中添加一个sleep方法
    Object.defineProperty(instance,'sleep',{
      get(){
        console.log("sleep");
      }
    })
    // 开始实现其他的功能
    this.init();
  }
  // 往播放器上面追加一个悬浮按钮，点击的时候发射click自定义事件，并对播放状态进行切换
  init() {
    const div = document.createElement("div");
    div.innerHTML = "切换播放状态";
    div.addEventListener("click", () => {
      // 通过发布订阅模式，实现事件的监听和发射
      this.instance.$emit("test-click");
      // 切换播放器的播放状态
      this.instance.toggle();
    });
    // 添加到播放器中
    this.el.appendChild(div);
  }
}
```

**使用插件：**

```javascript
import MediaPlayer from "@lin-media/player";

// 全局注册插件
MediaPlayer.use(Test);

const player = new MediaPlayer({
  // ...
  // 或者通过局部注册
  // plugins:[Test]
  // 关闭插件功能
  // Test:false
});

// 监听Test插件发射出来的事件
player.$on("test-click", () => {
  console.log("test-click");
});
// Test插件在播放器实例上面挂载的方法
player.sleep();
// 访问Test插件的实例
player.$plugins.Test;
```

### 注意事项

- 插件必须是一个构造器函数（类），因为内部是通过 `new` 的方式去初始化插件

- 插件中请提供一个`pluginName`静态属性，如果不提供会默认使用构造器的 `name` 值。`pluginName` 会作为插件的唯一标识

- 如果有其他副作用的代码，可以通过监听 `destroy` 事件来销毁这些副作用代码

- 如果需要监听原生 `video` 标签事件，请通过`player.$on(eventName:string,handler:Function)`进行监听，而不是通过`video.addEventListener()`进行监听，因为清晰度切换的时候，会删除旧的 `video` 标签，插入新的 `video` 标签，此时通过`video.addEventListener()`监听的事件会失效。当然，你也可以通过监听`switch_definition_end`事件，重新对 `video` 标签进行监听，但这样显得没必要

- 当你需要读取原生`video`标签时，请不要缓存`video`标签，而是每次动态去读取，因为清晰度切换的时候，会删除旧的`video`标签，插入新的`video`标签。当然，出于对性能的考虑，你也可以对`video`标签进行缓存，然后监听`switch_definition_end`事件，重新刷新`video`标签的缓存

- 如果 `MediaPlayer` 的 `options` 参数中出现 `key` 值为插件的唯一标识，且 `value` 值为 false，那么该插件不会被初始化。这个是用来关闭插件的初始化。以关闭弹幕插件为例：

```javascript
import MediaPlayer from "@lin-media/player";
import DanmakuPlugin from "@lin-media/danmaku";
MediaPlayer.use(DanmakuPlugin);

const player = new MediaPlayer({
  // ...
  Danmaku: false
});
```

## 自定义主题

### 介绍

跟以往实现自定义主题那些方案不同的是，我们是使用 css 原生变量来实现自定义主题的。这样做的好处有：

- 通过复写 css 变量，将原有的变量进行覆盖，就可以轻松换主题色，无需进行重新打包。

- 动态改变主题色，由于 css 变量可以通过 js 进行修改，所以你可以轻松的变换播放器的主题色。

### 改变主题色

**通过 css 改变主题色**

```css
:root {
  --player-theme: green;

  /* ... */
}
```

**通过 js 改变主题色**

```js
document.documentElement.style.setProperty("--player-theme", "green");

// ...
```

### css 变量

| 变量名                                 | 说明                       | 默认值                   |
| -------------------------------------- | -------------------------- | ------------------------ |
| --player-theme                         | 主题色                     | #fb6640                  |
| --player-icon-color                    | 字体图标颜色               | #fff                     |
| --player-container-background-color    | 播放器容器背景色           | #000                     |
| --player-text-color                    | 文本颜色                   | #fff                     |
| --player-text-wrapper-background-color | 文本容器背景色             | rgba(0, 0, 0, 0.4)       |
| --player-label-background-color        | 标签背景色（倍速，清晰度） | rgba(255, 255, 255, 0.2) |
| --player-process-background-color      | 进度条背景色               | rgba(255, 255, 255, 0.2) |
| --player-loaded-background-color       | 缓冲进度背景色             | rgba(255, 255, 255, 0.4) |

## 内置组件

播放器是以组件化的形式进行设计的，播放器中的每一个控件都是一个组件。如果大家想自定义组件的效果，可以关闭对应组件的初始化，然后通过自定义插件的形式去实现对应的控件效果。默认情况下，所有内置组件都是会被初始化的，可通过初始化时传入`controls`参数，关闭一些内置组件的初始化

### 内置组件与插件的区别

内置组件本质上也算是插件的一种。不同的是内置组件的初始化是有顺序的，比如`video-play-button`组件是`video-controls`组件的子组件，所以要先初始化`video-controls`组件，然后再初始化`video-play-button`组件。插件是在播放器的所有东西都初始化了之后才进行初始化的

插件和内置组件接受的参数不一样。内置组件分别接收播放器实例和插槽元素，插槽元素是用来指定内置组件插入到的位置，这样子就可以实现组件的复用，因为内置组件插入的位置是由外部控制的，可以插入到任意的地方。插件分别接受播放器实例和整个播放器的`DOM`元素，插入的位置由插件内部控制，受限于播放器本身的`DON`元素。换句话来说，就是内置组件可以拿出来用到其他播放器中，但是插件只能在对应的播放器中使用，因为插件是针对播放器去进行设计的，内置组件是针对通用性去设计的

插件和内置组件在功能上定义是不一样的。内置组件是为了给播放器提供一些基础功能，比如音量调节(通过`video-volume`内置组件提供的)，倍数切换(通过`video-speed`内置组件提供的)等等功能。插件是为了解决用户自定义需求而提出来的解决方案，插件是通过内置组件提供的一些基础功能去实现自己的功能的

### 内置组件列表

- **DomResizeObserver 组件**

提供监听播放器`DOM`元素大小发生变化并广播的功能，`resize`自定义事件来源于该组件。可通过`controls.domResizeObserver`字段关闭该内置组件的初始化，使用插件去实现

- **ShortcutKey 组件**

提供快捷键的功能，`keyboard_right`，`keyboard_left`，`keyboard_up`，`keyboard_down`，`keyboard_space`自定义事件就是来源于该组件。可通过`controls.shortcutKey`字段关闭该内置组件的初始化，使用插件去实现

- **VideoControls 组件**

提供视频控制条的显示和隐藏功能，`show_controls`和`hide_controls`自定义事件来源于该组件。该组件的子组件包含`VideoProgress`，`VideoPlayButton`，`VideoVolume`，`VideoTime`，`VideoLive`，`VideoSpeed`，`VideoDefinition`，`VideoFullscreen`。一旦关闭了该组件的初始化，其子组件也不会被初始化，子组件所提供的基础功能也将失效。所以请慎重考虑是否关闭该组件的初始化。可通过`controls.controlBar`字段关闭该内置组件的初始化，使用插件去实现

## 常见问题

### 自动播放

由于浏览器的策略问题，很多时候就算我们设置了`autoplay`属性也无法实现自动播放的。以下提供 2 种思路实现自动播放，这 2 种思路的前提是设置了`autoplay`属性

- 用户与网页进行交互。浏览器是不允许在用户没有操作的的时候自动播放视频的，所以你需要想办法让用户跟网页产生交互，然后才去初始化播放器。但是这种做法基本用不上。。。

- 静音播放。浏览器是不允许有声音的视频进行自动播放的，但是允许静音的视频进行播放的。所以你可以将视频的音量设置为 0，然后在进行自动播放。`MediaPlayer`可以通过设置对应的参数实现这种静音自动播放的功能

::: warning 警告

误区：

设置了`autoplay`属性，然后通过监听`canplaythrough`事件，手动去播放，这样子是不能实现自动播放的

```javascript
player.$once("canplaythrough", () => {
  player.play();
});
```

静音自动播放，然后监听`canplaythrough`事件，恢复视频的音量，这样子也是不能实现自动播放的

```javascript
player.$once("canplaythrough", () => {
  player.setVolume(1);
});
```

:::
