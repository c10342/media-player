# 播放器

## 安装

```bash
npm i @lin-media/player
```

## 初始化

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
      url: "http://127.0.0.1/demo.mp4",
      // 默认播放这个视频，否则默认为第一个
      default: true
    }
  ]
});
```

## 参数

| 参数           | 说明                                               | 类型                 | 可选值               | 默认值      |
| -------------- | -------------------------------------------------- | -------------------- | -------------------- | ----------- |
| el             | 播放容器                                           | String，HTMLElement  | —                    | —           |
| videoList      | 视频播放列表，格式见下方                           | Array                | —                    | —           |
| speedList      | 倍数列表，可选，格式见下方                         | Array                | —                    | —           |
| plugins        | 注册局部插件，可选                                 | Array                | —                    | —           |
| hotkey         | 是否开启热键（快捷键），可选                       | Boolean              | —                    | true        |
| autoplay       | 是否自动播放，可选                                 | Boolean              | —                    | false       |
| muted          | 是否静音，一般配合 autoplay 属性实现自动播放，可选 | Boolean              | —                    | false       |
| customType     | 自定义 esm，可选，，格式见下方                     | Function             | —                    | —           |
| live           | 是否为直播，可选                                   | Boolean              | —                    | false       |
| crossorigin    | 是否开启跨域，可选                                 | Boolean              | —                    | true        |
| preload        | 视频预加载，可选                                   | String               | none，metadata，auto | auto        |
| poster         | 视频封面，可选                                     | String               | —                    | —           |
| controls       | 播放器控件是否显示，可选，详细见下方               | boolean，ControlsObj | false，ControlsObj   | ControlsObj |
| lang           | 使用的语言                                         | String               | zh，en               | zh          |
| customLanguage | 自定义语言包                                       | Object               | —                    | —           |

## videoList 格式

| 字段    | 说明                                       | 类型    |
| ------- | ------------------------------------------ | ------- |
| label   | 清晰度文本                                 | String  |
| url     | 播放地址                                   | String  |
| default | 是否默认播放，可选，false 时默认播放第一个 | Boolean |

## speedList 格式

| 字段    | 说明                               | 类型    |
| ------- | ---------------------------------- | ------- |
| label   | 倍数文本                           | String  |
| value   | 倍数值，可选值 0-2                 | Number  |
| default | 默认倍数，可选，false 时默认第一个 | Boolean |

## customType 参数

| 字段         | 说明             | 类型             |
| ------------ | ---------------- | ---------------- |
| videoElement | video 标签       | HTMLVideoElement |
| options      | videoList 列表项 | Object           |

## controls 参数格式

注意：

当 `controls` 值为 `false` 时，所有控件将不会显示。当 `controls` 值为一个对象时（即`ControlsObj`），可根据下方的字段来选择那些控件需要显示，那些不需要显示，其中 `true` 为显示控件， `false` 为隐藏控件。所有控件默认显示

| 字段             | 说明               | 类型    | 默认值 |
| ---------------- | ------------------ | ------- | ------ |
| playButton       | pc 端播放按钮控件  | Boolean | true   |
| volume           | 音量控件           | Boolean | true   |
| live             | 直播提示控件       | Boolean | true   |
| speed            | 倍速控件           | Boolean | true   |
| fullscreen       | 全屏控件           | Boolean | true   |
| definition       | 清晰度控件         | Boolean | true   |
| progress         | 进度条控件         | Boolean | true   |
| tip              | 通知提示控件       | Boolean | true   |
| time             | 时间控件           | Boolean | true   |
| loading          | loading 控件       | Boolean | true   |
| floatButton | 悬浮播放按钮控件 | Boolean | true   |
| videoMask        | 视频遮罩层控件     | Boolean | true   |
| controlBar       | 视频下方控制条     | Boolean | true   |

## 事件

- 自定义事件

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
| keyboard_right          | 按下键盘 → 键时触发      | —        |
| keyboard_left           | 按下键盘 ← 键时触发      | —        |
| keyboard_up             | 按下键盘 ↑ 键时触发      | —        |
| keyboard_down           | 按下键盘 ↓ 键时触发      | —        |
| keyboard_space          | 按下键盘 空格 键时触发   | —        |

- 原生 video 标签事件

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

**实例方法**

- `player.$on(eventName: string, handler: Function)` : 事件监听

- `player.$emit(eventName: string, data?: any)` : 触发事件

- `player.$once(eventName: string, handler: Function)` : 事件监听，只触发一次

- `player.$off(eventName: string, handler?: Function)` : 取消事件监听

- `player.play()` : 播放视频

- `player.pause()` : 暂停视频

- `player.seek(time: number)` : 跳转到指定时间

- `player.setNotice(text: string, time?: number)` : 显示通知

- `player.switchDefinition(index: number)` : 切换清晰度

- `player.setSpeed(playbackRate: number)` : 设置倍数

- `player.setVolume(volume: number)` : 设置音量

- `player.toggle()` : 切换播放状态

- `player.fullScreen.request(type: string)` : 进入全屏

```javascript
player.fullScreen.request("web");
player.fullScreen.request("browser");
```

- `player.fullScreen.cancel(type: string)` : 退出全屏

```javascript
player.fullScreen.cancel("web");
player.fullScreen.cancel("browser");
```

- `player.showControls()` : 显示下方控制条

- `player.hideControls()` : 隐藏下方控制条

- `player.toggleControls()` : 切换下方控制条显示/隐藏状态

**实例属性**

- `player.videoElement` : 原生 video 标签

- `player.paused` : 视频是否处于暂停状态

- `player.currentTime` : 视频当前时间

- `player.duration` : 视频总时长

- `player.volume` : 当前音量

**静态方法**

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

**静态属性**

- `MediaPlayer.PlayerEvents` : 播放器自定义事件
- `MediaPlayer.VideoEvents` : video 标签事件

- `MediaPlayer.globalConfig` : 默认的全局配置项，播放器在初始化的时候，会将用户传入的配置项跟全局的配置项进行合并，形成一个新的配置项

## 插件

播放器内置了插件功能，可自己实现一些奇奇怪怪的功能，比如自定义进度条提示点，截图，弹幕等等。

插件分为全局插件和局部插件，使用全局插件时，每个播放器实例都会具备全局插件的功能。使用局部插件时，只有当前播放器实例才会存在局部插件的功能。

全局插件是通过`MediaPlayer.use(ctor: Function)`进行注册的

局部插件是通过 options 参数中的`plugins`字段进行注册的

每一个插件都需要是一个构造器函数（类），并且需要包含`pluginName`静态属性（不写就默认使用构造器的 name），这是为了外部可以通过`player.$plugins[pluginName]`访问到插件实例

构造器函数（类）会接受到三个参数：

- instance：播放器实例，即`new MediaPlayer()`，你可以使用该实例提供的任意方法
- el：整个播放器的 dom 元素，当你需要获取某个元素时，请使用`el.querySelector()`，而不是`document.querySelector()`

插件代码示例：

Test 插件

```javascript
class Test {
  // 提供一个pluginName静态属性
  static pluginName = "Test";

  el = null;
  instance = null;
  MediaPlayer = null;

  constructor(el, instance, MediaPlayer) {
    // 保存接受到的三个参数
    this.el = el;
    this.instance = instance;
    this.MediaPlayer = MediaPlayer;
    // 往播放器实例中添加一个sleep方法
    Object.defineProperty(instance, "sleep", {
      get() {
        console.log("sleep");
      }
    });
    // 开始实现其他的功能
    this.init();
  }
  // 往播放器上面追加一个悬浮按钮，点击的时候发射click自定义事件，并对播放状态进行切换
  init() {
    const div = document.createElement("div");
    div.innerHTML = "切换播放状态";
    div.addEventListener("click", () => {
      // 播放器继承了EventEmit类，通过发布订阅模式，实现事件的监听和发射
      this.instance.$emit("test-click");
      // 切换播放器的播放状态
      this.instance.toggle();
    });
    // 添加到播放器中
    this.el.appendChild(div);
  }
}
```

使用插件：

```javascript
import MediaPlayer from "@lin-media/player";

// 全局注册插件
MediaPlayer.use(Test);

const player = new MediaPlayer({
  // ...
  // 或者通过局部注册
  // plugins:[MediaPlayer]
});

// Test插件发射出来的事件
player.$on("test-click", () => {
  console.log("test-click");
});
// Test插件在原型上面挂载的方法
player.sleep();
// 访问Test插件的实例
player.$plugins.Test;
```
