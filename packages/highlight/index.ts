import Player from "@lin-media/player";
import Highlight from "./src/index";

Player.registerComponent("Highlight", Highlight, {
  parentComponent: "VideoProgress"
});

export default Highlight;
