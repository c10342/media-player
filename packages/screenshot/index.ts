import Player from "@lin-media/player";
import Screenshot from "./src/index";

const VideoControls = Player.getComponent("VideoControls");

VideoControls.registerComponent("Screenshot", Screenshot);

export default Screenshot;
