import VideoPlayer from "@media/player";
import "./index.scss";

// console.log(a);

const player = new VideoPlayer({
  el: ".container",
  videoList: [
    {
      label: "高清",
      url: "https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4"
    }
  ]
});
