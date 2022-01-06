import { LangTypeEnum } from "@lin-media/utils";
import {
  DOMRESIZEOBSERVER,
  SHORTCUTKEY,
  VIDEOCONTROLS,
  VIDEODEFINITION,
  VIDEOFLOATBUTTON,
  VIDEOFULLSCREEN,
  VIDEOLIVE,
  VIDEOLOADING,
  VIDEOMASK,
  VIDEOPLAYBUTTON,
  VIDEOPLAYER,
  VIDEOPROGRESS,
  VIDEOSPEED,
  VIDEOTIME,
  VIDEOTIP,
  VIDEOVOLUME
} from "../config/constant";
import MediaPlayer from "../index";

// 视频列表项
export type VideoListItem = { label: string; url: string; default?: boolean };
// 视频列表
export type VideoListParams = Array<VideoListItem>;
// 倍数列表项
export type SpeedItem = { label: string; value: number; default?: boolean };

export interface ControlsObj {
  // pc端播放按钮控件
  [VIDEOPLAYBUTTON]?: boolean;
  // 音量控件
  [VIDEOVOLUME]?: boolean;
  // 直播提示控件
  [VIDEOLIVE]?: boolean;
  // 倍速控件
  [VIDEOSPEED]?: boolean;
  // 全屏控件
  [VIDEOFULLSCREEN]?: boolean;
  // 清晰度控件
  [VIDEODEFINITION]?: boolean;
  // 进度条控件
  [VIDEOPROGRESS]?: boolean;
  // 通知提示控件
  [VIDEOTIP]?: boolean;
  // 时间控件
  [VIDEOTIME]?: boolean;
  // loading控件
  [VIDEOLOADING]?: boolean;
  // 悬浮的播放按钮控件
  [VIDEOFLOATBUTTON]?: boolean;
  // 视频遮罩层控件
  [VIDEOMASK]?: boolean;
  // 下方控制条
  [VIDEOCONTROLS]?: boolean;
  // 播放器`DOM`元素大小发生变化监听
  [DOMRESIZEOBSERVER]?: boolean;
  // 快捷键控件功能
  [SHORTCUTKEY]?: boolean;
  // 播放器控件
  [VIDEOPLAYER]?: boolean;
}

// 播放器参数
export interface PlayerOptions {
  // 插入的元素
  el: string | HTMLElement;
  // 自定义esm
  customType?: (videoElement: HTMLVideoElement, options: VideoListItem) => void;
  // 视频播放列表
  videoList: VideoListParams;
  // 是否自动播放
  autoplay?: boolean;
  // 是否静音，一般配合 autoplay 属性实现自动播放
  muted?: boolean;
  // 倍数列表
  speedList?: Array<SpeedItem>;
  // 是否为直播
  live?: boolean;
  // 局部插件
  plugins?: Array<PluginClass>;
  // 是否开启跨域
  crossorigin?: boolean;
  // 视频预加载
  preload?: string;
  // 视频封面
  poster?: string;
  // 控件相关
  controls?: false | ControlsObj;
  // 语言
  lang?: LangTypeEnum;
  // 自定义语言包
  customLanguage?: {
    [key: string]: any;
  };
  // 加这个是给插件使用的
  [key: string]: any;
}

// dom元素
export type HtmlElementProp = HTMLElement | null;

// 动画类名
export interface AnimationClassName {
  enter: string;
  "enter-to": string;
  leave: string;
  "leave-to": string;
}

// 语言
export interface LangOptions {
  [key: string]: any;
}

// 插件类型
export type PluginsType = Array<Function>;

export interface DragDataInfo {
  offsetX: number;
  offsetY: number;
  percentX: number;
  percentY: number;
}

export interface PlayerOptionsParams extends PlayerOptions {
  el: HTMLElement;
}

export interface PluginsOptions {
  [key: string]: any;
}

// 插件的定义
export interface PluginClass {
  new (player: MediaPlayer, el: HTMLElement): Object;
  pluginName: string;
}
