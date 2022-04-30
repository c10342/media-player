import Player from "@lin-media/player";
import Danmaku from "./src/index";

Player.registerComponent("Danmaku", Danmaku, {
  parentComponent: "VideoControls"
});

export default Danmaku;
