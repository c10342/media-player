// 播放器自定义事件
export enum PlayerEvents {
  DESTROY = "destroy",
  SWITCH_DEFINITION_START = "switch_definition_start",
  SWITCH_DEFINITION_END = "switch_definition_end",
  ENTER_BROWSER_SCREEN = "enter_browser_screen",
  EXIT_BROWSER_SCREEN = "exit_browser_screen",
  ENTER_WEB_SCREEN = "enter_web_screen",
  EXIT_WEB_SCREEN = "exit_web_screen",
  SHOW_CONTROLS = "show_controls",
  HIDE_CONTROLS = "hide_controls",
  RESIZE = "resize",
  KEYBOARD_RIGHT = "keyboard_right",
  KEYBOARD_LEFT = "keyboard_left",
  KEYBOARD_UP = "keyboard_up",
  KEYBOARD_DOWN = "keyboard_down",
  KEYBOARD_SPACE = "keyboard_space",
  PICTURE_IN_PICTURE_WINDOW_RESIZE = "picture_in_picture_window_resize",
  TECHCHANGED = "techChanged"
}

// video标签事件
export enum VideoEvents {
  ABORT = "abort",
  CANPLAY = "canplay",
  CANPLAYTHROUGH = "canplaythrough",
  DURATIONCHANGE = "durationchange",
  EMPTIED = "emptied",
  ENDED = "ended",
  ERROR = "error",
  LOADEDDATA = "loadeddata",
  LOADEDMETADATA = "loadedmetadata",
  LOADSTART = "loadstart",
  PAUSE = "pause",
  PLAY = "play",
  PLAYING = "playing",
  PROGRESS = "progress",
  RATECHANGE = "ratechange",
  SEEKED = "seeked",
  SEEKING = "seeking",
  STALLED = "stalled",
  SUSPEND = "suspend",
  TIMEUPDATE = "timeupdate",
  VOLUMECHANGE = "volumechange",
  WAITING = "waiting",
  ENTERPICTUREINPICTURE = "enterpictureinpicture",
  LEAVEPICTUREINPICTURE = "leavepictureinpicture"
}
