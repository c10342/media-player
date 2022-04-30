import Player from "@lin-media/player";
import Screenshot from "./src/index";

Player.registerComponent("Screenshot", Screenshot, {
  parentComponent: "VideoControls"
});

export default Screenshot;
