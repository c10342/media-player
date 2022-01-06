

# 更新日志

## `2.1.0`

- `fix`：修复网页全屏样式被覆盖的问题

- `fix`：修复移动端点击进度条出现时间悬浮提示

- `feat`：添加`resize`自定义事件

- `feat`：修改配置合并策略方法

- `feat`：根据插件提供的`mobilePlugin`和`pcPlugin`静态属性，过滤不同环境的插件

- `feat`：组件之间通过`$eventBus`进行通信

- `feat`：组件添加`pluginName`静态属性作为组件的唯一标识

- `feat`：`mobile-play-button`组件修改为`float-button`组件，pc端和移动端通用

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

- `feat`：新增`keyboard_right`播放器自定义事件，按下键盘 → 键触发

- `feat`：新增`keyboard_left`播放器自定义事件，按下键盘 ← 键触发

- `feat`：新增`keyboard_up`播放器自定义事件，按下键盘 ↑ 键触发

- `feat`：新增`keyboard_down`播放器自定义事件，按下键盘 ↓ 键触发

- `feat`：新增`keyboard_space`播放器自定义事件，按下键盘 空格 键触发

## `1.1.0`
  
- `feat`：添加`controls`属性控制视频控件
  
- `feat`：网页全屏时使用`vw`和`vh`样式单位占满全屏

- `refactor`：国际化语言优化


## `1.0.0`
  
- `feat`：正式发布