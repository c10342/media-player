import Player from "../player";

export type LangType = "en" | "zh";

// 视频列表项
export type SourceItem = {
  label: string;
  url: string;
  default?: boolean;
  type: string;
};
// 视频列表
export type VideoListParams = Array<SourceItem>;
// 倍数列表项
export type SpeedItem = { label: string; value: number; default?: boolean };

export interface PlayerConfig {
  // 插件配置
  plugins?: { [key: string]: any };
  // 组件配置
  components?: { [key: string]: any };
  // tech配置
  techs?: { [key: string]: any };
  el: HTMLElement;
  // 视频播放列表
  sources: VideoListParams;
  live?: boolean;
  customLanguage?: Record<string, any>;
  lang?: LangType;
  // 倍数列表
  speedList?: Array<SpeedItem>;
  // 是否自动播放
  autoplay?: boolean;
  // 是否静音，一般配合 autoplay 属性实现自动播放
  muted?: boolean;
  // 是否开启跨域
  crossorigin?: boolean;
  // 视频预加载
  preload?: string;
  // 视频封面
  poster?: string;
  // tech执行顺序
  techsOrder?: string[];
  [key: string]: any;
}

export type PlayerNextCallbackFn<T = PlayerConfig | Player> = (data: T) => void;
