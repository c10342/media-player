import VideoPlayer from "@media/player";
import Highlight from "@media/highlight";
import Screenshot from "@media/screenshot";
VideoPlayer.use(Highlight);
// VideoPlayer.use(Screenshot);
import "./index.scss";

// VideoPlayer.setLang("en");
// import Hls from "hls.js";

const highlightList = [
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
  plugins: [Screenshot],
  highlightOptions: {
    jump: true,
    showTip: true,
    list: highlightList
  },
  screenshotOptions: {
    // 是否开启功能
    open: true,
    // 点击后自动下载,默认true，你可以设置为false，然后通过事件监听来自定义点击之后的操作
    download: true
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
  // player.destroy();
  // (player as any).destroyHighlight()
  (player as any).screenshot();
});
