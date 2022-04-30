import Player from "@lin-media/player";
import Preview from "./src/index";

Player.registerComponent("Preview", Preview, {
  parentComponent: "VideoProgress"
});

export default Preview;
