import VideoPlayer from "@lin-media/player";
import "@lin-media/contextmenu";
import "@lin-media/danmaku";
import "@lin-media/highlight";
import "@lin-media/preview";
import "@lin-media/screenshot";
import "@lin-media/zoom";

import addEventListener from "./dom";

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
    url: "http://player.linjiafu.top/test.mp4",
    type: "video/mp4",
    default: true
  }
];

VideoPlayer.registerHook("beforeSetup", (data) => {
  console.log(data);

  return data;
});
VideoPlayer.registerHook("afterSetup", (data) => {
  console.log(data);

  return data;
});
VideoPlayer.registerSource("video/mp4", (data, next) => {
  console.log(data);

  next(data);
});

const player = new VideoPlayer({
  el: document.querySelector(".container") as HTMLElement,
  sources: videoList,
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
  addEventListener(player);
});

player.$on("beforeComponentSetup", ({ name }: { name: string }) => {
  console.log("beforeComponentSetup", name);
});
player.$on("afterComponentSetup", ({ name }: { name: string }) => {
  console.log("afterComponentSetup", name);
});
player.$on("beforePluginSetup", ({ name }: { name: string }) => {
  console.log("beforePluginSetup", name);
});
player.$on("afterPluginSetup", ({ name }: { name: string }) => {
  console.log("afterPluginSetup", name);
});
player.$on("afterComponentDestroy", ({ name }: { name: string }) => {
  console.log("afterComponentDestroy", name);
});
player.$on("beforeComponentDestroy", ({ name }: { name: string }) => {
  console.log("beforeComponentDestroy", name);
});
player.$on("afterPluginDestroy", ({ name }: { name: string }) => {
  console.log("afterPluginDestroy", name);
});
player.$on("beforePluginDestroy", ({ name }: { name: string }) => {
  console.log("beforePluginDestroy", name);
});
player.$on("afterTechSetup", ({ name }: { name: string }) => {
  console.log("afterTechSetup", name);
});
player.$on("beforeTechSetup", ({ name }: { name: string }) => {
  console.log("beforeTechSetup", name);
});
