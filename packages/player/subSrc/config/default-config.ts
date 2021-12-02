import { LangTypeEnum } from "@lin-media/utils";

const defaultOptions = {
  live: false,
  hotkey: true,
  autoplay: false,
  muted: false,
  preload: "auto",
  crossorigin: true,
  controls: {
    playButton: true,
    volume: true,
    live: true,
    speed: true,
    fullscreen: true,
    definition: true,
    progress: true,
    tip: true,
    time: true,
    loading: true,
    mobilePlayButton: true,
    videoMask: true
  },
  //   插件
  plugins: [] as Array<Function>,
  // 语言
  lang: LangTypeEnum.zh,
  // 自定义语言包
  customLanguage: {}
};

export default defaultOptions;
