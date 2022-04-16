import Player from "./player";
import VideoPlayer from "./components/video-player";
import VideoMask from "./components/video-mask";
import VideoFloatButton from "./components/video-float-button";
import VideoControls from "./components/video-controls";
import VideoLoading from "./components/video-loading";
import VideoTip from "./components/video-tip";

import VideoProgress from "./components/video-progress";
import VideoPlayButton from "./components/video-play-button";
import VideoVolume from "./components/video-volume";
import VideoTime from "./components/video-time";
import VideoFullscreen from "./components/video-fullscreen";
import VideoSpeed from "./components/video-speed";
import VideoDefinition from "./components/video-definition";
import VideoLive from "./components/video-live";

const options = {
  init: true
};

Player.registerComponent("VideoPlayer", VideoPlayer, options);
Player.registerComponent("VideoMask", VideoMask, options);
Player.registerComponent("VideoFloatButton", VideoFloatButton, options);
Player.registerComponent("VideoControls", VideoControls, options);
Player.registerComponent("VideoLoading", VideoLoading, options);
Player.registerComponent("VideoTip", VideoTip, options);

VideoControls.registerComponent("VideoProgress", VideoProgress, options);
VideoControls.registerComponent("VideoPlayButton", VideoPlayButton, options);
VideoControls.registerComponent("VideoVolume", VideoVolume, options);
VideoControls.registerComponent("VideoTime", VideoTime, options);
VideoControls.registerComponent("VideoLive", VideoLive, options);
VideoControls.registerComponent("VideoSpeed", VideoSpeed, options);
VideoControls.registerComponent("VideoDefinition", VideoDefinition, options);
VideoControls.registerComponent("VideoFullscreen", VideoFullscreen, options);
