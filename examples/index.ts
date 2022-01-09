import VideoPlayer from "@lin-media/player";
import Highlight from "@lin-media/highlight";
import Screenshot from "@lin-media/screenshot";
import Preview from "@lin-media/preview";
import Zoom from "@lin-media/zoom";
import Danmaku from "@lin-media/danmaku";
import Contextmenu from "@lin-media/contextmenu";
VideoPlayer.use(Highlight);
VideoPlayer.use(Preview);
VideoPlayer.use(Screenshot);
import "./index.scss";

import DanmukuTest from "./danmaku";
import addEventListener from "./dom";
import {
  getContextMenuList,
  highlightList,
  previewList,
  speedList
} from "./list";
// import { LangTypeEnum } from "@lin-media/utils";

// VideoPlayer.setLang(LangTypeEnum.en);
// import Hls from "hls.js";

// @ts-ignore
const player = new VideoPlayer({
  el: ".container",
  videoList: [
    {
      label: "标清",
      url: "https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4"
    },
    {
      label: "高清",
      url: "https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4"
      // default:true
    }
    // {
    //   label: "标清",
    //   url: "https://api.dogecloud.com/player/get.m3u8?vcode=5ac682e6f8231991&userId=17&ext=.m3u8"
    // },
    // {
    //   label: "高清",
    //   url: "https://api.dogecloud.com/player/get.m3u8?vcode=5ac682e6f8231991&userId=17&ext=.m3u8"
    // },
    // {
    //   label: "超清",
    //   url: "https://api.dogecloud.com/player/get.m3u8?vcode=5ac682e6f8231991&userId=17&ext=.m3u8"
    // }
  ],
  speedList,
  plugins: [
    // Screenshot,
    Zoom,
    Danmaku,
    Contextmenu
  ],
  Highlight: {
    jump: true,
    showTip: true,
    list: highlightList
  },
  // Screenshot: {
  //   // 是否开启功能
  //   open: true,
  //   // 点击后自动下载,默认true，你可以设置为false，然后通过事件监听来自定义点击之后的操作
  //   download: true
  // },
  Preview: {
    list: previewList
    // barPreviewUrl: "https://i.loli.net/2019/06/06/5cf8c5d9cec8510758.jpg"
  },
  // Zoom: {
  //   // y:false,
  //   // open:false,
  //   minWidth: 300,
  //   minHeight: 300
  // },
  Danmaku: {
    fontColors: ["blue", "red", "green", "#fff", "yellow"],
    fontSizes: [16, 18, 20, 22, 24, 26, 28]
  },
  Contextmenu: {
    // @ts-ignore
    menuList: getContextMenuList(player),
    menuItemWidth: "200px",
    subMenuItemWidth: "100px"
  }
  // controls:false
  // live: true
  // autoplay: true,
  // muted:true
  // customType(videoElement, videoObj) {
  //   const hls = new Hls();
  //   hls.loadSource(videoObj.url);
  //   hls.attachMedia(videoElement);
  // }
});

player.$on("play", () => {
  console.log("play");
});
player.$on("ratechange", () => {
  console.log("ratechange");
});
player.$on("highlight-click", (item: any) => {
  console.log(item);
});
player.$on("preview-click", (item: any) => {
  console.log(item);
});

DanmukuTest(player);

addEventListener(player);
