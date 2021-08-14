// 播放器自定义事件
export enum CustomEvents {
  DESTROY = "destroy",
  SWITCH_DEFINITION_START = "switch_definition_start",
  SWITCH_DEFINITION_END = "switch_definition_end",
  ENTER_BROWSER_SCREEN = "enter_browser_screen",
  EXIT_BROWSER_SCREEN = "exit_browser_screen",
  ENTER_WEB_SCREEN = "enter_web_screen",
  EXIT_WEB_SCREEN = "exit_web_screen",
  SHOW_CONTROLS = "show_controls",
  HIDE_CONTROLS = "hide_controls",
  RESIZE = "resize"
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
  WAITING = "waiting"
}
