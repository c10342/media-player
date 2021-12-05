

# 更新日志

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