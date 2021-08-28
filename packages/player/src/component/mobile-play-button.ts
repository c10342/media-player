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
  showPlayIcon() {
    this.mobilePlayButton.classList.remove(PlayButtonIconEnum.Pause);
    this.mobilePlayButton.classList.add(PlayButtonIconEnum.Play);
  }

  showPauseIcon() {
    this.mobilePlayButton.classList.add(PlayButtonIconEnum.Pause);
    this.mobilePlayButton.classList.remove(PlayButtonIconEnum.Play);
  }

  showPlayButton() {
    this.mobilePlayButton.style.opacity = "";
  }

  hidePlayButton() {
    this.mobilePlayButton.style.opacity = "0";
  }
}

export default MobilePlayButton;
