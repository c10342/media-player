import PlayerConstructor from "../constructor";
import i18n from "../locale";
import templateTpl from "../template/layout.art";
import { PlayerEvents } from "../config/event";
import { isUndef, debounce } from "@lin-media/utils";

type ElementType = HTMLElement | HTMLVideoElement;

class Template {
  private playerInstance: PlayerConstructor;

  private resizeObserver: ResizeObserver | null;

  containerElement: HTMLElement;

  playElement: HTMLElement;

  videoElement: HTMLVideoElement;

  currentTimeElement: HTMLElement;

  totalTimeElement: HTMLElement;

  videoLoadedElement: HTMLElement;

  videoPlayedElement: HTMLElement;

  progressMaskElement: HTMLElement;

  progressBallElement: HTMLElement;

  videoMaskElement: HTMLElement;

  fullscreenBrowserElement: HTMLElement;

  fullscreenWebElement: HTMLElement;

  loadingWrapperElement: HTMLElement;

  processTimeElement: HTMLElement;

  volumeMaskElement: HTMLElement;

  volumeBallElement: HTMLElement;

  volumeButtonElement: HTMLElement;

  volumeWrapperElement: HTMLElement;

  volumeProcessElement: HTMLElement;

  volumeContainerElement: HTMLElement;

  volumeAnimationElement: HTMLElement;

  speedWrapperElement: HTMLElement;

  speedLabelElement: HTMLElement;

  speedItemsElement: NodeListOf<Element>;

  definitionWrapperElement: HTMLElement;

  definitionLabelElement: HTMLElement;

  definitionItemsElement: NodeListOf<Element>;

  tipElement: HTMLElement;

  controlsElement: HTMLElement;

  mobilePlayButton: HTMLElement;

  constructor(playerInstance: PlayerConstructor) {
    this.playerInstance = playerInstance;
    // 初始化模板，插入元素
    this.initTemplate();
    // 获取所需要的元素，统一在这里获取，到时候也方便修改
    this.initElement();
    // 初始化事件监听
    this.initListener();
    this.initResizeObserver();
  }

  private initTemplate() {
    const el = this.playerInstance.options.el as HTMLElement;
    const html = templateTpl({
      ...this.playerInstance.options,
      $t: i18n.t,
      isMobile: this.playerInstance.isMobile
    });
    el.innerHTML = html;
  }

  private getElement<T extends ElementType>(selector: string): T {
    const el = this.playerInstance.options.el as HTMLElement;
    return el.querySelector(selector) as T;
  }

  private getElementList(selector: string) {
    const el = this.playerInstance.options.el as HTMLElement;
    return el.querySelectorAll(selector) as NodeListOf<Element>;
  }

  private initElement() {
    this.containerElement = this.getElement(".player-container");
    this.videoElement = this.getElement(".player-video");
    this.videoMaskElement = this.getElement(".player-video-mask");
    this.playElement = this.getElement(".player-status-button");
    this.currentTimeElement = this.getElement(".player-currentTime");
    this.totalTimeElement = this.getElement(".player-totalTime");
    this.videoLoadedElement = this.getElement(".player-process-loaded");
    this.videoPlayedElement = this.getElement(".player-process-played");
    this.progressMaskElement = this.getElement(".player-process-mask");
    this.progressBallElement = this.getElement(".player-process-ball");
    this.processTimeElement = this.getElement(".player-process-time");
    this.fullscreenBrowserElement = this.getElement(
      ".player-fullscreen-browser"
    );
    this.fullscreenWebElement = this.getElement(".player-fullscreen-web");
    this.loadingWrapperElement = this.getElement(".player-loading-container");
    this.volumeMaskElement = this.getElement(".player-volume-mask");
    this.volumeBallElement = this.getElement(".player-volume-ball");
    this.volumeButtonElement = this.getElement(".player-volume-button");
    this.volumeWrapperElement = this.getElement(".player-volume-wrapper");
    this.volumeProcessElement = this.getElement(".player-volume-process");
    this.volumeContainerElement = this.getElement(".player-volume-container");
    this.volumeAnimationElement = this.getElement(".player-volume-animation");
    this.speedWrapperElement = this.getElement(".player-speed-wrapper");
    this.speedLabelElement = this.getElement(".player-speed-label");
    this.speedItemsElement = this.getElementList(".player-speed-item");
    this.definitionWrapperElement = this.getElement(
      ".player-definition-wrapper"
    );
    this.definitionLabelElement = this.getElement(".player-definition-label");
    this.definitionItemsElement = this.getElementList(
      ".player-definition-item"
    );
    this.tipElement = this.getElement(".player-tip");
    this.controlsElement = this.getElement(".player-controls");
    this.mobilePlayButton = this.getElement(".player-mobile-play-button");
  }

  private initListener() {
    // 切换清晰度结束事件
    this.playerInstance.$on(
      PlayerEvents.SWITCH_DEFINITION_END,
      this.onElementReload.bind(this)
    );
    this.playerInstance.$on(PlayerEvents.DESTROY, this.destroy.bind(this));
  }

  private onElementReload() {
    // 切换清晰度结束后需要刷新video标签元素
    this.videoElement = this.getElement(".player-video");
  }

  private initResizeObserver() {
    if (!isUndef(this.containerElement)) {
      this.resizeObserver = new ResizeObserver(
        debounce((entries: ResizeObserverEntry[]) => {
          const entrie = entries[0];
          this.playerInstance.$emit(PlayerEvents.RESIZE, entrie.contentRect);
        }, 500)
      );
      this.resizeObserver.observe(this.containerElement);
    }
  }

  private destroy() {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }
}

export default Template;
