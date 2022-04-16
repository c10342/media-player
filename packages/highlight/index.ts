import Player from "@lin-media/player";
import Highlight from "./src/index";

const VideoProgress = Player.getComponent("VideoProgress");

VideoProgress.registerComponent("Highlight", Highlight);

export default Highlight;
