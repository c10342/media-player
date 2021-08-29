import { PlayButtonIconEnum } from "../config/enum";
import { PlayerEvents, VideoEvents } from "../config/event";
import PlayerConstructor from "../constructor";

class MobilePlayButton {
  private playerInstance: PlayerConstructor;
  constructor(playerInstance: PlayerConstructor) {
    this.playerInstance = playerInstance;
    this.initListener();
  }

  get mobilePlayButton() {
    return this.playerInstance.templateInstance.mobilePlayButton;
  }

  initListener() {
    this.playerInstance.$on(VideoEvents.PLAY, this.showPlayIcon.bind(this));
    this.playerInstance.$on(VideoEvents.PAUSE, this.showPauseIcon.bind(this));
    this.playerInstance.$on(
      PlayerEvents.SHOW_CONTROLS,
      this.showPlayButton.bind(this)
    );
    this.playerInstance.$on(
      PlayerEvents.HIDE_CONTROLS,
      this.hidePlayButton.bind(this)
    );
  }
  // 显示播放图标
  showPlayIcon() {
    this.mobilePlayButton.classList.remove(PlayButtonIconEnum.Pause);
    this.mobilePlayButton.classList.add(PlayButtonIconEnum.Play);
  }
  // 显示暂停图标
  showPauseIcon() {
    this.mobilePlayButton.classList.add(PlayButtonIconEnum.Pause);
    this.mobilePlayButton.classList.remove(PlayButtonIconEnum.Play);
  }
  // 显示播放按钮
  showPlayButton() {
    this.mobilePlayButton.style.opacity = "";
    this.mobilePlayButton.style.pointerEvents = "";
  }
  // 隐藏播放按钮
  hidePlayButton() {
    this.mobilePlayButton.style.opacity = "0";
    this.mobilePlayButton.style.pointerEvents = "none";
  }
}

export default MobilePlayButton;
