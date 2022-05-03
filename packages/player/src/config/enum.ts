export enum PlayButtonIconEnum {
  Pause = "player-icon-play",
  Play = "player-icon-pause"
}

export enum VolumeButtonIconEnum {
  mute = "player-icon-mute",
  volume = "player-icon-volume"
}

// video标签状态
export enum VideoReadyStateEnum {
  // 没有关于媒体资源的信息
  HAVE_NOTHING = 0,
  // 已检索到足够的媒体资源以初始化元数据属性。Seeking 将不再引发异常。
  HAVE_METADATA = 1,
  // 数据可用于当前播放位置，但不足以实际播放超过一帧。
  HAVE_CURRENT_DATA = 2,
  // 当前播放位置的数据以及未来至少一小段时间的数据是可用的（换句话说，例如，至少两帧视频）
  HAVE_FUTURE_DATA = 3,
  // 有足够的数据可用——下载速率也足够高——媒体可以不间断地播放到最后
  HAVE_ENOUGH_DATA = 4
}

// 可获取焦点的dom元素
export enum CanFocusTagEnum {
  input = "INPUT",
  textarea = "TEXTAREA"
}

// 键盘keycode值
export enum KeyCodeEnum {
  esc = 27,
  space = 32,
  left = 37,
  right = 39,
  up = 38,
  down = 40
}

// 全屏类型
export enum FullScreenTypeEnum {
  web = "web",
  browser = "browser"
}
