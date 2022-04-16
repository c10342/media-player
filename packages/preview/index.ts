import Player from "@lin-media/player";
import Preview from "./src/index";

const VideoProgress = Player.getComponent("VideoProgress");

VideoProgress.registerComponent("Preview", Preview);

export default Preview;
