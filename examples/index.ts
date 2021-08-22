import VideoPlayer from "@media/player";
import Highlight from "@media/highlight";
import Screenshot from "@media/screenshot";
import Preview from "@media/preview";
import Zoom from "@media/zoom";
import Danmaku from "@media/danmaku";
VideoPlayer.use(Highlight);
VideoPlayer.use(Preview);
// VideoPlayer.use(Screenshot);
import "./index.scss";

import DanmukuTest from "./danmaku";
// import { LangTypeEnum } from "@media/utils";

// VideoPlayer.setLang(LangTypeEnum.en);
// import Hls from "hls.js";

const highlightList = [
  {
    time: 0,
    text: "这是第 20 秒"
  },
  {
    time: 20,
    text: "这是第 20 秒"
  },
  {
    time: 60,
    text: "这是第 60 秒"
  },
  {
    time: 100,
    text: "这是第 100 秒"
  }
];

// const previewList = [
//   {
//     time: 40,
//     url: "http://xxx/demo.png"
//   },
//   {
//     time: 80,
//     url: "http://xxx/demo.png"
//   }
// ];

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
  speedList: [
    {
      label: "0.5x",
      value: 0.5
    },
    {
      label: "1x",
      value: 1,
      default: true
    },
    {
      label: "1.5x",
      value: 1.5
    }
  ],
  plugins: [Screenshot, Zoom, Danmaku],
  highlightOptions: {
    jump: true,
    showTip: true
    // list: highlightList
  },
  screenshotOptions: {
    // 是否开启功能
    open: true,
    // 点击后自动下载,默认true，你可以设置为false，然后通过事件监听来自定义点击之后的操作
    download: true
  },
  previewOptions: {
    // list: previewList,
    barPreviewUrl: "https://i.loli.net/2019/06/06/5cf8c5d9cec8510758.jpg"
  },
  zoomOptions: {
    // y:false,
    // open:false,
    minWidth: 300,
    minHeight: 300
  },
  danmakuOptions: {
    fontColors: ["blue", "red", "green", "#fff", "yellow"],
    fontSizes: [16, 18, 20, 22, 24, 26, 28]
  }
  // hotkey:true
  // live:true
  // autoplay: true,
  // muted:true
  // customType(videoElement, videoObj) {
  //   const hls = new Hls();
  //   hls.loadSource(videoObj.url);
  //   hls.attachMedia(videoElement);
  // }
});

// (player as any).setHighlight(highlightList);

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

document.querySelector(".setoptions")?.addEventListener("click", () => {
  // (player as any).setBarView('https://i.loli.net/2019/06/06/5cf8c5d9cec8510758.jpg');
  // (player as any).highlight.set(highlightList);
  (player as any).screenshot.snapshot();
});
document.querySelector(".destroyoptions")?.addEventListener("click", () => {
  (player as any).destroyPreview();
});
document.querySelector(".play")?.addEventListener("click", function () {
  player.play();
});
document.querySelector(".pause")?.addEventListener("click", function () {
  player.pause();
});
document.querySelector(".seek")?.addEventListener("click", function () {
  player.seek(100);
});
document.querySelector(".setNotice")?.addEventListener("click", function () {
  player.setNotice("你好", 1000);
});
document
  .querySelector(".switchQuality")
  ?.addEventListener("click", function () {
    player.switchDefinition(1);
  });
document.querySelector(".setSpeed")?.addEventListener("click", function () {
  player.setSpeed(1.7);
});
document.querySelector(".setVolume")?.addEventListener("click", function () {
  player.setVolume(0.8);
});
document.querySelector(".toggle")?.addEventListener("click", function () {
  player.toggle();
});
document.querySelector(".fullscreen")?.addEventListener("click", function () {
  player.fullScreen.request("web");
});
document.querySelector(".videoElement")?.addEventListener("click", function () {
  console.log(player.videoElement);
});
document.querySelector(".currentTime")?.addEventListener("click", function () {
  console.log(player.currentTime);
});
document.querySelector(".duration")?.addEventListener("click", function () {
  console.log(player.duration);
});
document.querySelector(".volume")?.addEventListener("click", function () {
  console.log(player.volume);
});
document.querySelector(".paused")?.addEventListener("click", function () {
  console.log(player.paused);
});

document.querySelector(".destroy")?.addEventListener("click", function () {
  player.destroy();
  // (player as any).destroyHighlight()
  // (player as any).screenshot();
});

DanmukuTest(player);
