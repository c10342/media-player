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

import "./hls";

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
  },
  {
    label: "超清",
    url: "https://api.dogecloud.com/player/get.m3u8?vcode=5ac682e6f8231991&userId=17&ext=.m3u8",
    type: "video/hls"
    // default: true
  }
];

// VideoPlayer.useHook("beforeSetup", (data,next) => {
//   // console.log(data);
// // throw new Error('beforeSetup')
//   // console.log(data);

//   setTimeout(() => {
//     next(data)
//   })
// });
// VideoPlayer.useHook()
VideoPlayer.useHook("beforeDestroy", (data: any, next) => {
  console.log("beforeDestroy", data);

  next(data);
});
// VideoPlayer.useHook('afterDestroy', (data, next) => {
//   console.log('afterDestroy',data);

//   next(data)
// })
// VideoPlayer.useHook("afterSetup", (player,next) => {
//   // console.log(data);
//   // throw new Error('11')
//   next(player)
//   // return data;
// });
// VideoPlayer.useSource("video/mp4", (data, next) => {
//   console.log(data);

//   next(data);
// });

const player = new VideoPlayer({
  el: document.querySelector(".container") as HTMLElement,
  sources: videoList,
  // live:true,
  speedList,
  // lang:'zh',
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
  },
  techs: {
    HlsHandler: {
      name: "张三"
    }
  }
});

player.ready(() => {
  DanmukuTest(player);
  addEventListener(player);
  console.log(player);
});

// player.$on("beforeComponentSetup", ({ name }: { name: string }) => {
//   console.log("beforeComponentSetup", name);
// });
// player.$on("afterComponentSetup", ({ name }: { name: string }) => {
//   console.log("afterComponentSetup", name);
// });
// player.$on("beforePluginSetup", (data:any) => {
//   console.log("beforePluginSetup", data);
// });
// player.$on("afterPluginSetup", (data:any) => {
//   console.log("afterPluginSetup", data);
// });
// player.$on("afterComponentDestroy", ({ name }: { name: string }) => {
//   console.log("afterComponentDestroy", name);
// });
// player.$on("beforeComponentDestroy", ({ name }: { name: string }) => {
//   console.log("beforeComponentDestroy", name);
// });
// player.$on("afterPluginDestroy", ({ name }: { name: string }) => {
//   console.log("afterPluginDestroy", name);
// });
// player.$on("beforePluginDestroy", ({ name }: { name: string }) => {
//   console.log("beforePluginDestroy", name);
// });
// player.$on("afterTechSetup", ({ name }: { name: string }) => {
//   console.log("afterTechSetup", name);
// });
// player.$on("beforeTechSetup", ({ name }: { name: string }) => {
//   console.log("beforeTechSetup", name);
// });
