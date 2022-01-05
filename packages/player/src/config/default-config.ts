import { LangTypeEnum } from "@lin-media/utils";
import { PlayerOptions } from "../types";
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
  VIDEOPROGRESS,
  VIDEOSPEED,
  VIDEOTIME,
  VIDEOTIP,
  VIDEOVOLUME
} from "./constant";

const defaultOptions: Partial<PlayerOptions> = {
  live: false,
  autoplay: false,
  muted: false,
  preload: "auto",
  crossorigin: true,
  controls: {
    [VIDEOPLAYBUTTON]: true,
    [VIDEOVOLUME]: true,
    [VIDEOLIVE]: true,
    [VIDEOSPEED]: true,
    [VIDEOFULLSCREEN]: true,
    [VIDEODEFINITION]: true,
    [VIDEOPROGRESS]: true,
    [VIDEOTIP]: true,
    [VIDEOTIME]: true,
    [VIDEOLOADING]: true,
    [VIDEOFLOATBUTTON]: true,
    [VIDEOMASK]: true,
    [VIDEOCONTROLS]: true,
    [DOMRESIZEOBSERVER]: true,
    [SHORTCUTKEY]: true
  },
  //   插件
  plugins: [] as Array<Function>,
  // 语言
  lang: LangTypeEnum.zh,
  // 自定义语言包
  customLanguage: {}
};

export default defaultOptions;
