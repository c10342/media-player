import Player from "@lin-media/player";
import Danmaku from "./src/index";

const VideoControls = Player.getComponent("VideoControls");

VideoControls.registerComponent("Danmaku", Danmaku);

export default Danmaku;
