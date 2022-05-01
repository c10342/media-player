import { LangTypeEnum } from "@lin-media/utils";
import { PlayerConfig } from "../types/index";

const defaultOptions: Partial<PlayerConfig> = {
  live: false,
  autoplay: false,
  muted: false,
  preload: "auto",
  crossorigin: true,
  // 语言
  lang: LangTypeEnum.zh,
  // 自定义语言包
  customLanguage: {}
};

export default defaultOptions;
