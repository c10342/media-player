# 内置插件

## 内置插件介绍

播放的的一些功能是通过插件的形式进行设计的。默认情况下，所有内置插件都是会被初始化的，可通过初始化时传入`Plugins`参数，关闭一些内置插件的初始化

## DomResizeObserver 插件

提供监听播放器`DOM`元素大小发生变化并广播的功能，`resize`自定义事件来源于该插件

## ShortcutKey 插件

提供快捷键的功能，`keyboard_right`，`keyboard_left`，`keyboard_up`，`keyboard_down`，`keyboard_space`自定义事件就是来源于该插件。移动端环境下不会被初始化