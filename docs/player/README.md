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
import Player from "@lin-media/player";

const player = new Player({
  // 容器
  el: document.querySelector(".container"),
  // 视频列表
  sources: [
    {
      label: "标清",
      url: "http://127.0.0.1/demo.mp4",
      type: "video/mp4"
    },
    {
      label: "高清",
      url: "http://127.0.0.1/demo.mp4",
      type: "video/mp4"
    }
  ]
});
```

一个简单的播放器实例已经初始化完成了，它已经具有一些基本的功能了

## 参数

你可以通过下面的参数来自定义你的播放器具体需要什么功能

| 参数           | 说明                                               | 类型                | 可选值               | 默认值 |
| -------------- | -------------------------------------------------- | ------------------- | -------------------- | ------ |
| el             | 播放容器                                           | string，HTMLElement | —                    | —      |
| sources        | 视频播放列表，格式见下方                           | Array               | —                    | —      |
| speedList      | 倍数列表，可选，格式见下方                         | Array               | —                    | —      |
| plugins        | 插件初始化，可选                                   | Object              | —                    | —      |
| components     | 组件初始化，可选                                   | Object              | —                    | —      |
| techs          | tech 初始化，可选                                  | Object              | —                    | —      |
| autoplay       | 是否自动播放，可选                                 | boolean             | —                    | false  |
| muted          | 是否静音，一般配合 autoplay 属性实现自动播放，可选 | boolean             | —                    | false  |
| live           | 是否为直播，可选                                   | boolean             | —                    | false  |
| crossorigin    | 是否开启跨域，可选                                 | boolean             | —                    | true   |
| preload        | 视频预加载，可选                                   | string              | none，metadata，auto | auto   |
| poster         | 视频封面，可选                                     | string              | —                    | —      |
| lang           | 使用的语言                                         | string              | zh，en               | zh     |
| customLanguage | 自定义语言包                                       | Object              | —                    | —      |
| techsOrder     | tech 执行顺序                                      | string[]            | —                    | —      |

### sources 参数格式

| 字段    | 说明               | 是否必填 | 类型    |
| ------- | ------------------ | -------- | ------- |
| label   | 清晰度文本         | 是       | string  |
| url     | 播放地址           | 是       | string  |
| type    | 视频类型           | 是       | string  |
| default | 是否默认播放该视频 | 否       | boolean |

### speedList 参数格式

| 字段    | 说明                       | 是否必填 | 类型    |
| ------- | -------------------------- | -------- | ------- |
| label   | 倍数文本                   | 是       | string  |
| value   | 倍数值，可选值 0-2         | 是       | number  |
| default | 是否默认使用该倍数进行播放 | 否       | boolean |

### components 参数格式

::: tip 注意
`components`选项是`key-value`的形式，当`value`是`boolean`类型的时候，`true`表示会对组件进行初始化，`false`表示关闭对组件的初始化。当`value`是`Object`类型的时候，组件会进行初始化，并且`value`值将会作为初始化配置传递给组件
:::

以下列出播放器内置组件的名称

| 字段             | 说明             | 类型           | 默认值 |
| ---------------- | ---------------- | -------------- | ------ |
| VideoPlayButton  | 播放按钮控件     | boolean,Object | true   |
| VideoVolume      | 音量控件         | boolean,Object | true   |
| VideoLive        | 直播提示控件     | boolean,Object | true   |
| VideoSpeed       | 倍速控件         | boolean,Object | true   |
| VideoFullscreen  | 全屏控件         | boolean,Object | true   |
| VideoDefinition  | 清晰度控件       | boolean,Object | true   |
| VideoProgress    | 进度条控件       | boolean,Object | true   |
| VideoTip         | 通知提示控件     | boolean,Object | true   |
| VideoTime        | 时间控件         | boolean,Object | true   |
| VideoLoading     | loading 控件     | boolean,Object | true   |
| VideoFloatButton | 悬浮播放按钮控件 | boolean,Object | true   |
| VideoMask        | 视频遮罩层控件   | boolean,Object | true   |
| VideoControls    | 视频下方控制条   | boolean,Object | true   |
| VideoPlayer      | 视频播放控件     | boolean,Object | true   |

### plugins 参数格式

::: tip 注意
`plugins`选项是`key-value`的形式，当`value`是`boolean`类型的时候，`true`表示会对插件进行初始化，`false`表示关闭对插件的初始化。当`value`是`Object`类型的时候，插件会进行初始化，并且`value`值将会作为初始化配置传递给插件
:::

以下列出播放器内置插件的名称

| 字段              | 说明                            | 类型           | 默认值 |
| ----------------- | ------------------------------- | -------------- | ------ |
| DomResizeObserver | 播放器`DOM`元素大小发生变化监听 | boolean,Object | true   |
| ShortcutKey       | 快捷键功能控件                  | boolean,Object | true   |

### techs 参数格式

以下列出播放器内置`tech`的名称

| 字段  | 说明           | 类型   | 默认值 |
| ----- | -------------- | ------ | ------ |
| Html5 | html5 视频播放 | Object | —      |

## 事件绑定

`player.$on(eventName: string, handler: Function)`

```javascript
player.$on("ended", function (data) {
  console.log("player ended", data);
});
```

- **播放器自定义事件**

| 事件名称                     | 说明                     | 回调参数                          |
| ---------------------------- | ------------------------ | --------------------------------- |
| destroy                      | 播放器销毁时触发         | —                                 |
| switchDefinitionStart        | 清晰度切换前触发         | —                                 |
| switchDefinitionEnd          | 清晰度切换后触发         | —                                 |
| enterBrowserScreen           | 浏览器进入全屏时触发     | —                                 |
| exitBrowserScreen            | 浏览器退出全屏时触发     | —                                 |
| enterWebScreen               | 网页进入全屏时触发       | —                                 |
| exitWebScreen                | 网页退出全屏时触发       | —                                 |
| showControls                 | 控制条显示时触发         | —                                 |
| hideControls                 | 控制条隐藏时触发         | —                                 |
| resize                       | 播放器大小发生变化时触发 | —                                 |
| keyboardRight                | 按下键盘 → 键时触发      | —                                 |
| keyboardLeft                 | 按下键盘 ← 键时触发      | —                                 |
| keyboardUp                   | 按下键盘 ↑ 键时触发      | —                                 |
| keyboardDown                 | 按下键盘 ↓ 键时触发      | —                                 |
| keyboardSpace                | 按下键盘 空格 键时触发   | —                                 |
| pictureInPictureWindowResize | 画中画窗口发生变化时触发 | —                                 |
| beforeComponentSetup         | 组件初始化前             | {name:string}                     |
| afterComponentSetup          | 组件初始化完成之后       | {name:string,component:Component} |
| beforeComponentDestroy       | 组件销毁前               | {name:string,component:Component} |
| afterComponentDestroy        | 组件销毁完成之后         | {name:string}                     |
| beforePluginSetup            | 插件初始化前             | {name:string}                     |
| afterPluginSetup             | 插件初始化完成之后       | {name:string,plugin:Plugin}       |
| beforePluginDestroy          | 插件销毁前               | {name:string,plugin:Plugin}       |
| afterPluginDestroy           | 插件销毁完成之后         | {name:string}                     |
| beforeTechSetup              | tech 初始前              | {name:string}                     |
| afterTechSetup               | tech 初始化完成之后      | {name:string,tech:Tech}           |
| beforeTechDestroy            | tech 销毁前              | {name:string,tech:Tech}           |
| afterTechDestroy             | tech 销毁完成之后        | {name:string}                     |
| afterTechDestroy             | tech 销毁完成之后        | {name:string}                     |
| playerError                  | 播放器初始化出错         | error:Error                       |

- **原生 video 标签事件**

| 事件名称              | 说明                                                    | 回调参数 |
| --------------------- | ------------------------------------------------------- | -------- |
| abort                 | 发生中断时触发                                          | event    |
| canplay               | 视频能够播放，但可能因缓冲停止时触发                    | event    |
| canplaythrough        | 视频能够播放，并且无需因缓冲而停止，ie 上触发不了改事件 | event    |
| durationchange        | 视频总时长发生变化时触发                                | event    |
| emptied               | 媒介资源元素突然为空时（网络错误、加载错误等）时触发    | event    |
| ended                 | 视频播放结束时触发                                      | event    |
| error                 | 视频加载发生错误时触发                                  | event    |
| loadeddata            | 加载数据时触发                                          | event    |
| loadedmetadata        | 媒介元素的持续时间以及其他媒介数据已加载时触发          | event    |
| loadstart             | 开始加载数据时触发                                      | event    |
| pause                 | 视频暂停触发                                            | event    |
| play                  | 视频播放时触发                                          | event    |
| playing               | 视频已经开始播放时触发                                  | event    |
| progress              | 获取数据（缓冲数据）时触发                              | event    |
| ratechange            | 视频倍数发生变化时触发                                  | event    |
| seeked                | 跳转到指定时间之后触发，一般是用户拖拽进度条时触发的    | event    |
| seeking               | 正在跳转到指定的时间时触发                              | event    |
| stalled               | 取回媒介数据过程中（延迟）存在错误时触发                | event    |
| suspend               | 浏览器已在取媒介数据但在取回整个媒介文件之前停止时触发  | event    |
| timeupdate            | 播放位置发生变化时触发                                  | event    |
| volumechange          | 视频音量发生变化时触发                                  | event    |
| waiting               | 正在播放，但是因为缓冲而卡顿时触发                      | event    |
| enterpictureinpicture | 进入画中画时触发                                        | event    |
| leavepictureinpicture | 退出画中画时触发                                        | event    |

## API

**实例方法：**

- `player.$on(eventName: string, handler: Function)` : 监听播放器自定义事件或者原生 video 标签事件

- `player.$emit(eventName: string, ...data: any)` : 触发事件

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

- `player.requestFullscreen(type: 'web'|'browser')` : 进入网页/浏览器全屏

- `player.cancelFullscreen(type: 'web'|'browser')` : 退出网页/浏览器全屏

- `player.showControls()` : 显示下方控制条

- `player.hideControls()` : 隐藏下方控制条

- `player.toggleControls()` : 切换下方控制条显示/隐藏状态

- `player.destroy()` : 销毁播放器

- `player.requestPictureInPicture()` : 进入画中画

- `player.exitPictureInPicture()` : 退出画中画

**实例属性：**

- `player.videoElement` : 原生 video 标签

- `player.paused` : 视频是否处于暂停状态

- `player.currentTime` : 视频当前时间

- `player.duration` : 视频总时长

- `player.volume` : 当前音量

**静态方法：**

- `Player.useLang(lang:Object)` : 自定义语言包，会跟默认的语言包进行合并

```javascript
Player.useLang({
  Player: {
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

- `Player.setLang(lang:string)` : 设置使用何种语言，zh/en，默认 zh

- `Player.registerTech(name: string, tech: TechClass)` : 注册`Tech`

- `Player.removeTech(name: string)` : 移除`Tech`

- `Player.getTech(name: string)` : 获取`Tech`

- `Player.useHook(hook: HookType, callback: HookCallback)` : 注册`Hook`

- `Player.removeHook(hook: HookType, callback?: HookCallback)` : 移除`Hook`

- `Player.registerPlugin(name: string,plugin: PluginClass,options: PluginOptions)` : 注册插件

- `Player.removePlugin(name: string)` : 移除插件

- `Player.getPlugin(name: string)` : 获取插件

- `Player.registerComponent(name: string,component: ComponentClass,options: ComponentOptions)` : 注册组件

- `Player.removeComponent(name: string)` : 移除组件

- `Player.getComponent(name: string)` : 获取组件

- `Player.useSource(type: string, callback: SourceHandleCallback)` : 注册资源中间件

- `Player.removeSource(type: string, callback: SourceHandleCallback)` : 移除资源中间件

**静态属性：**

- `Player.Events` : 播放器自定义事件和 video 标签事件

- `Player.defaults` : 播放器全局配置

## 直播

你可以把`Player`用在直播中，你只需要把`live`参数设置为`true`即可。如果你需要在直播中使用弹幕，请使用弹幕插件。

**注意：你需要自定义`Tech`支持`m3u8`文件播放**

```javascript
import Player from "@lin-media/player";

const player = new Player({
  el: ".container",
  sources: [
    {
      label: "标清",
      url: "https://127.0.0.1/demo.m3u8",
      type: "video/hls"
    },
    {
      label: "高清",
      url: "https://127.0.0.1/demo.m3u8",
      type: "video/hls"
    }
  ],
  // 开启直播
  live: true
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
  --player-theme-color: green;

  /* ... */
}
```

**通过 js 改变主题色**

```js
document.documentElement.style.setProperty("--player-theme-color", "green");

// ...
```

### css 变量

| 变量名                                 | 说明                       | 默认值                   |
| -------------------------------------- | -------------------------- | ------------------------ |
| --player-theme-color                   | 主题色                     | #fb6640                  |
| --player-icon-color                    | 字体图标颜色               | #fff                     |
| --player-container-background-color    | 播放器容器背景色           | #000                     |
| --player-text-color                    | 文本颜色                   | #fff                     |
| --player-text-wrapper-background-color | 文本容器背景色             | rgba(0, 0, 0, 0.4)       |
| --player-label-background-color        | 标签背景色（倍速，清晰度） | rgba(255, 255, 255, 0.2) |
| --player-process-background-color      | 进度条背景色               | rgba(255, 255, 255, 0.2) |
| --player-loaded-background-color       | 缓冲进度背景色             | rgba(255, 255, 255, 0.4) |

## 插件和组件

插件和组件本质上都是为了给播放器扩展功能。插件能实现的，组件也能实现，本质上是有相同点的，但是也有不同点的。

组件一般是用来定制`UI`，操作`DOM`的，并且组件的初始化是跟随其父组件一起初始化的。

插件一般是用来扩展功能的（不涉及到`DOM`操作的），比如扩展一些快捷键的功能，并且插件的初始化是跟随播放器的初始化

实际上，组件也可以实现快捷键的功能，插件也可以定制`UI`、操作`DOM`。但是我们不推荐这么做（虽然你可以这么做），因为组件存在父子组件的概念

关于组件，详情请查看[组件章节](/components/guide/)

关于插件，详情请查看[插件章节](/plugins/guide/)

## 常见问题

### 自动播放

由于浏览器的策略问题，很多时候就算我们设置了`autoplay`属性也无法实现自动播放的。以下提供 2 种思路实现自动播放，这 2 种思路的前提是设置了`autoplay`属性

- 用户与网页进行交互。浏览器是不允许在用户没有操作的的时候自动播放视频的，所以你需要想办法让用户跟网页产生交互，然后才去初始化播放器。但是这种做法基本用不上。。。

- 静音播放。浏览器是不允许有声音的视频进行自动播放的，但是允许静音的视频进行播放的。所以你可以将视频的音量设置为 0，然后在进行自动播放。`Player`可以通过设置对应的参数实现这种静音自动播放的功能

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
