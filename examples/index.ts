import VideoPlayer from "@lin-media/player";
import "@lin-media/contextmenu";
import "@lin-media/danmaku";
import "@lin-media/highlight";
import "@lin-media/preview";
import "@lin-media/screenshot";
import "@lin-media/zoom";

import "./index.scss";

import DanmukuTest from "./danmaku";

import {
  speedList,
  getContextMenuList,
  highlightList,
  previewList
} from "./list";

const videoList = [
  {
    label: "标清",
    url: "https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4",
    type: "video/mp4"
  },
  {
    label: "高清",
    url: "https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4",
    type: "video/mp4"
    // default:true
  }
];

const player = new VideoPlayer({
  el: document.querySelector(".container") as HTMLElement,
  source: videoList,
  // live:true,
  speedList,
  components: {
    Contextmenu: {
      menuList: getContextMenuList()
    },
    Danmaku: {
      fontColors: ["red", "yellow", "blue", "green"]
    },
    Highlight: {
      list: highlightList
    },
    Preview: {
      list: previewList
    },
    Screenshot: true,
    Zoom: true
  }
});

player.ready(() => {
  DanmukuTest(player);
});

player.$on("beforeComponentSetup:Zoom", () => {
  console.log("beforeComponentSetup:Zoom");
});
player.$on("afterComponentSetup:Zoom", () => {
  console.log("afterComponentSetup:Zoom");
});
player.$on("beforePluginSetup:ShortcutKey", () => {
  console.log("beforePluginSetup:ShortcutKey");
});
player.$on("afterPluginSetup:ShortcutKey", () => {
  console.log("afterPluginSetup:ShortcutKey");
});
