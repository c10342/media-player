import VideoPlayer from "@media/player";
import "./index.scss";
// import Hls from "hls.js";

// console.log(a);

const player = new VideoPlayer({
  el: ".container",
  videoList: [
    // {
    //   label: "标清",
    //   url: "https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4"
    // },
    // {
    //   label: "高清",
    //   url: "https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4",
    //   // default:true
    // }
    {
      label: "标清",
      url: "http://192.168.35.204/upload/video/2082/1_2082.mp4"
    },
    {
      label: "高清",
      url: "http://192.168.35.204/upload/video/2082/2_2082.mp4"
    },
    {
      label: "超清",
      url: "http://192.168.35.204/upload/video/2082/3_2082.mp4"
    }
  ]
  // speedList:[
  //   {
  //     label:'0.5x',
  //     value:0.5
  //   },
  //   {
  //     label:'1x',
  //     value:1
  //   },
  //   {
  //     label:'1.5x',
  //     value:1.5,
  //     default:true
  //   }
  // ],
  // autoplay: true,
  // muted:true
  // customType(videoElement, videoObj) {
  //   const hls = new Hls();
  //   hls.loadSource(videoObj.url);
  //   hls.attachMedia(videoElement);
  // }
});

// const destroyButton = document.querySelector(".destroy");

// destroyButton?.addEventListener("click", function () {
//   player.destroy();
// });
