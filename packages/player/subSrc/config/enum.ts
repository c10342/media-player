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
  // 可用数据足以开始播放
  complete = 4
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
