# 内置组件

## 内置组件介绍

播放器是以组件化的形式进行设计的，播放器中的每一个控件都是一个组件。如果大家想自定义组件的效果，可以关闭对应内置组件的初始化，然后通过自定义组件的形式去实现对应的控件效果。默认情况下，所有内置组件都是会被初始化的，可通过初始化时传入`Components`参数，关闭一些内置组件的初始化

## VideoControls 组件

提供视频控制条的显示和隐藏功能。

`show_controls`和`hide_controls`自定义事件来源于该组件

该组件的子组件包含`VideoProgress`，`VideoPlayButton`，`VideoVolume`，`VideoTime`，`VideoLive`，`VideoSpeed`，`VideoDefinition`，`VideoFullscreen`。

一旦关闭了该组件的初始化，其子组件也不会被初始化，子组件所提供的基础功能（如全屏，音量控制等）也将失效。所以请慎重考虑是否关闭该组件的初始化

## VideoDefinition 组件

提供视频清晰度切换功能。传入的`sources`参数长度要大于 1 才会被初始化

## VideoFloatButton 组件

播放器中间的悬浮按钮控件。点击可以切换视频的`播放/暂停`状态。

## VideoFullscreen 组件

提供播放器网页全屏和浏览器全屏的功能，`enter_browser_screen`，`exit_browser_screen`，`enter_web_screen`，`exit_web_screen`自定义事件来源于该组件

## VideoLive 组件

直播提示控件。非直播环境(`live=false`)下不会被初始化

## VideoLoading 组件

loading 控件，视频发生卡顿时会被显示出来，用来提高用户的体验度

## VideoMask 组件

视频遮罩层，位于`video`标签上方，用来禁止用户在`video`标签中的右键功能。pc 端点击可以切换视频的`播放/暂停`状态，移动端点击可以切换`VideoControls`组件的`显示/隐藏`状态

## VideoPlayButton 组件

`播放/暂停`按钮控件，点击可以切换视频的`播放/暂停`状态，移动端环境下不会被初始化

## VideoProgress 组件

进度条控件，直播环境下(`live=true`)不会被初始化

## VideoTime 组件

时间控件，直播环境下(`live=true`)不会被初始化

## VideoTip 组件

提示通知控件，可在播放器上面显示一些消息，如清晰度切换等

## VideoVolume 组件

视频音量控制控件，移动端环境下不会被初始化

## VideoPlayer 组件

`video`标签控件，一个非常重要的核心内置组件。所有跟`video`标签相关的属性，事件和操作，都是由该组件提供的。其中，`video`标签的原生事件和`switch_definition_start`，`switch_definition_end`自定义事件都是由改组件提供的

::: warning 警告

一般情况下，不推荐直接关闭内置组件的初始化（特别是 `VideoPlayer` 组件），因为一旦关闭了某些内置组件，将会丧失部分基础功能。

:::
