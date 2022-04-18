import { isMobile, parseHtmlToDom, updateStyle } from "@lin-media/utils";
import {
  FLOATBUTTONENTERCLASSNAME,
  FLOATBUTTONLEAVECLASSNAME
} from "../config/constant";
import { PlayButtonIconEnum } from "../config/enum";
import { PlayerEvents, VideoEvents } from "../config/event";
import Player from "../player";
import FloatButtonTpl from "../templates/float-button";
import Component from "./component";

const isPhone = isMobile();

class VideoFloatButton extends Component {
  static componentName = "VideoFloatButton";

  private iconElement: HTMLElement;

  private isShow = true;

  constructor(player: Player, slotElement: HTMLElement, options = {}) {
    super(player, slotElement, options);
    // 初始化dom
    this.initDom(slotElement);
    this.initListener();
    this.initComponent(VideoFloatButton.componentName);
  }

  private initDom(slotElement: HTMLElement) {
    const html = FloatButtonTpl();
    this.rootElement = parseHtmlToDom(html);
    slotElement.appendChild(this.rootElement);
    this.iconElement = this.rootElement.querySelector(
      ".player-float-button-icon"
    )!;
  }

  private initListener() {
    this.player.$on(VideoEvents.PLAY, this.onPlay.bind(this));
    this.player.$on(VideoEvents.PAUSE, this.onPause.bind(this));
    if (isPhone) {
      this.player.$on(
        PlayerEvents.SHOW_CONTROLS,
        this.showPlayButtonAnimation.bind(this)
      );
      this.player.$on(
        PlayerEvents.HIDE_CONTROLS,
        this.hidePlayButtonAnimation.bind(this)
      );
    }
    this.eventManager.addEventListener({
      element: this.rootElement,
      eventName: "click",
      handler: this.onPlayButtonClick.bind(this)
    });
    this.eventManager.addEventListener({
      element: this.rootElement,
      eventName: "animationend",
      handler: this.onAnimationend.bind(this)
    });
  }

  private onPlayButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this.player.toggle();
  }

  private onPlay() {
    this.showPlayIcon();
    if (!isPhone) {
      this.hidePlayButtonAnimation();
    }
  }

  private onPause() {
    this.showPauseIcon();
    if (!isPhone) {
      this.showPlayButtonAnimation();
    }
  }

  // 显示播放图标
  private showPlayIcon() {
    this.iconElement.classList.remove(PlayButtonIconEnum.Pause);
    this.iconElement.classList.add(PlayButtonIconEnum.Play);
  }
  // 显示暂停图标
  private showPauseIcon() {
    this.iconElement.classList.add(PlayButtonIconEnum.Pause);
    this.iconElement.classList.remove(PlayButtonIconEnum.Play);
  }
  private hidePlayButtonAnimation() {
    this.rootElement.classList.remove(FLOATBUTTONENTERCLASSNAME);
    this.rootElement.classList.add(FLOATBUTTONLEAVECLASSNAME);
    this.isShow = false;
  }

  private showPlayButtonAnimation() {
    this.showPlayButton();
    this.rootElement.classList.remove(FLOATBUTTONLEAVECLASSNAME);
    this.rootElement.classList.add(FLOATBUTTONENTERCLASSNAME);
    this.isShow = true;
  }
  // 显示播放按钮
  private showPlayButton() {
    updateStyle(this.rootElement, {
      opacity: "",
      pointerEvents: ""
    });
  }
  // 隐藏播放按钮
  private hidePlayButton() {
    updateStyle(this.rootElement, {
      opacity: "0",
      pointerEvents: "none"
    });
  }

  private onAnimationend(event: Event) {
    const target = event.target as HTMLElement;
    if (this.isShow) {
      target.classList.remove(FLOATBUTTONENTERCLASSNAME);
    } else {
      this.hidePlayButton();
      target.classList.remove(FLOATBUTTONLEAVECLASSNAME);
    }
  }
}

export default VideoFloatButton;
