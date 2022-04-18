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
import Component from "./components/component";
import { isMobile } from "@lin-media/utils";

const options = {
  init: true
};

Player.registerComponent(Component.componentName, Component);
Player.registerComponent(VideoPlayer.componentName, VideoPlayer, options);
Player.registerComponent(VideoMask.componentName, VideoMask, options);
Player.registerComponent(
  VideoFloatButton.componentName,
  VideoFloatButton,
  options
);
Player.registerComponent(VideoControls.componentName, VideoControls, options);
Player.registerComponent(VideoLoading.componentName, VideoLoading, options);
Player.registerComponent(VideoTip.componentName, VideoTip, options);

VideoControls.registerComponent(
  VideoProgress.componentName,
  VideoProgress,
  options
);
VideoControls.registerComponent(
  VideoPlayButton.componentName,
  VideoPlayButton,
  { init: !isMobile() }
);
VideoControls.registerComponent(VideoVolume.componentName, VideoVolume, {
  init: !isMobile()
});
VideoControls.registerComponent(VideoTime.componentName, VideoTime, options);
VideoControls.registerComponent(VideoLive.componentName, VideoLive, options);
VideoControls.registerComponent(VideoSpeed.componentName, VideoSpeed, options);
VideoControls.registerComponent(
  VideoDefinition.componentName,
  VideoDefinition,
  options
);
VideoControls.registerComponent(
  VideoFullscreen.componentName,
  VideoFullscreen,
  options
);
