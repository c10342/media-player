# 更新日志

## `3.0.0`

- `feat`：新增`beforeSetup`和`afterSetup`全局钩子函数

- `feat`：整个初始化流程调整为异步初始化

- `feat`：新增组件/Tech 功能

- `feat`：播放器初始化配置参数调整

  - 新增`plugins`插件配置

  - 新增`components`插件配置

  - 新增`techs`tech 配置

  - `el`调整为`HTMLElement`类型，不在支持`string`类型

  - `videoList`调整为`sources`

  - 新增`techsOrder`调整`tech`执行顺序

  - 删除`controls`字段

- `feat`：新增播放器自定义事件

  - `beforeComponentSetup`：组件初始化前

  - `afterComponentSetup`：组件初始化完成之后

  - `beforeComponentDestroy`：组件销毁前

  - `afterComponentDestroy`：组件销毁完成之后

  - `beforePluginSetup`：插件初始化前

  - `afterPluginSetup`：插件初始化完成之后

  - `beforePluginDestroy`：插件销毁前

  - `afterPluginDestroy`：插件销毁完成之后

  - `beforeTechSetup`：tech 初始化前

  - `afterTechSetup`：tech 初始化完成之后

  - `beforeTechDestroy`：tech 销毁前

  - `afterTechDestroy`：tech 销毁完成之后
  
  - `playerError`：播放器初始化出错
  
  - `showErrorMessage`：显示错误遮罩层
  
  - `hideErrorMessage`：隐藏错误遮罩层

- `feat`：调整插件注册方法：`use` -> `registerPlugin`

- `feat`：新增静态函数

  - `registerTech`：注册`tech`

  - `removeTech`：移除`tech`

  - `getTech`：获取`tech`

  - `useHook`：注册全局`hook`钩子函数

  - `removeHook`：移除全局`hook`钩子函数

  - `removePlugin`：移除插件

  - `getPlugin`：获取插件

  - `registerComponent`：注册组件

  - `removeComponent`：移除组件

  - `getComponent`：获取组件

  - `useSource`：注册全局`source`中间件

  - `removeSource`：移除全局`source`中间件

- `feat`：新增实例函数

  - `ready`：播放器初始化完成

- `feat`：入口文件导出类型声明文件

## `2.1.0`

- `fix`：修复网页全屏样式被覆盖的问题

- `fix`：修复移动端点击进度条出现时间悬浮提示

- `fix`：修复调用`seek`方法跳转到 0 时刻的时候进度条显示不正确

- `fix`：修复快捷键功能导致其他按键不能使用

- `feat`：添加`resize`自定义事件

- `feat`：修改配置合并策略方法

- `feat`：组件之间通过`$eventBus`进行通信

- `feat`：组件添加`pluginName`静态属性作为组件的唯一标识

- `feat`：`mobile-play-button`组件修改为`float-button`组件，pc 端和移动端通用

- `feat`：`controls`参数中的字段调整，调整如下：

  - `playButton` -> `VideoPlayButton`

  - `volume` -> `VideoVolume`

  - `live` -> `VideoLive`

  - `speed` -> `VideoSpeed`

  - `fullscreen` -> `VideoFullscreen`

  - `definition` -> `VideoDefinition`

  - `progress` -> `VideoProgress`

  - `tip` -> `VideoTip`

  - `time` -> `VideoTime`

  - `loading` -> `VideoLoading`

  - `mobilePlayButton` -> `VideoFloatButton`

  - `videoMask` -> `VideoMask`

  - `controlBar` -> `VideoControls`

  - 新增 `DomResizeObserver`

  - 新增 `ShortcutKey`

  - 新增 `VideoPlayer`

- `feat`：删除播放器参数的`hotkey`字段，迁移到了`controls.ShortcutKey`中

- `feat`：自定义主题 css 变量`--player-theme`改成`--player-theme-color`

- `feat`：插件强制要求传入`pluginName`静态属性

- `feat`：`ShortcutKey`组件监听全局快捷键改成`keydown`事件

- `feat`：自定义语言包修改为`Player`字段获取
- `feat`：`fullScreen.request/cancel`方法分别调整为`requestFullscreen`和`cancelFullscreen`
- `feat`：所有对外暴露的方法都返回`this`，实现链式调用
- `feat`：新增画中画功能，API：`requestPictureInPicture`和`exitPictureInPicture`
- `feat`：新增`video`标签原生事件`enterpictureinpicture`和`leavepictureinpicture`，播放器自定义事件`pictureInPictureWindowResize`

- `style`：代码优化，使用`updateStyle`函数统一更新样式

- `style`：代码优化，使用字符串拼接的形式替换`art-template`依赖包，减少打包出来的体积

## `2.0.0`

- `refactor`：重构播放器，使用组件化的开发方式，每个控件为一个组件，实现了各个组件之间的解耦
- `feat`：新增全局配置，初始化的时候会将全局配置和用户传入的配置进行合并

- `feat`：新增`lang`配置项，用来设置单个播放器实例使用的语言
- `feat`：新增`customLanguage`配置项，用来设置单个播放器实例的语言包

- `feat`：新增`controls.controlBar`配置项，用来控制下方控制条是否显示

- `feat`：新增`hideControls`实例方法，用来控制下方控制条隐藏
- `feat`：新增`showControls`实例方法，用来控制下方控制条显示
- `feat`：新增`toggleControls`实例方法，用来控制下方控制条显示/隐藏状态

- `feat`：新增`keyboardRight`播放器自定义事件，按下键盘 → 键触发

- `feat`：新增`keyboardLeft`播放器自定义事件，按下键盘 ← 键触发

- `feat`：新增`keyboardUp`播放器自定义事件，按下键盘 ↑ 键触发

- `feat`：新增`keyboardDown`播放器自定义事件，按下键盘 ↓ 键触发

- `feat`：新增`keyboardSpace`播放器自定义事件，按下键盘 空格 键触发

## `1.1.0`

- `feat`：添加`controls`属性控制视频控件
- `feat`：网页全屏时使用`vw`和`vh`样式单位占满全屏

- `refactor`：国际化语言优化

## `1.0.0`

- `feat`：正式发布
