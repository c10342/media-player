import { LangTypeEnum } from "@lin-media/utils";
import VideoControls from "../components/video-controls";
import VideoFullscreen from "../components/video-fullscreen";
import VideoLoading from "../components/video-loading";
import VideoMask from "../components/video-mask";
import VideoPlayer from "../components/video-player";
import VideoTip from "../components/video-tip";

// 视频列表项
export type VideoListItem = { label: string; url: string; default?: boolean };
// 视频列表
export type VideoListParams = Array<VideoListItem>;
// 倍数列表项
export type SpeedItem = { label: string; value: number; default?: boolean };

export interface ControlsObj {
  // pc端播放按钮控件
  playButton?: boolean;
  // 音量控件
  volume?: boolean;
  // 直播提示控件
  live?: boolean;
  // 倍速控件
  speed?: boolean;
  // 全屏控件
  fullscreen?: boolean;
  // 清晰度控件
  definition?: boolean;
  // 进度条控件
  progress?: boolean;
  // 通知提示控件
  tip?: boolean;
  // 时间控件
  time?: boolean;
  // loading控件
  loading?: boolean;
  // 移动端播放按钮控件
  mobilePlayButton?: boolean;
  // 视频遮罩层控件
  videoMask?: boolean;
  // 下方控制条
  controlBar?: boolean;
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
  // 开启热键（快捷键）
  hotkey?: boolean;
  // 局部插件
  plugins?: Array<Function>;
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
    MediaPlayer: any;
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
  videoTip?: VideoTip;
  videoControls?: VideoControls;
  videoPlayer?: VideoPlayer;
  videoFullscreen?: VideoFullscreen;
  [key: string]: any;
}
