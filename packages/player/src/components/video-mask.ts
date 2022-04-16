import { EventManager, isMobile, parseHtmlToDom } from "@lin-media/utils";
import Player from "../player";
import MaskTpl from "../templates/mask";
import { ComponentApi } from "../types/component";

class VideoMask implements ComponentApi {
  // 播放器实例
  private player: Player;
  // dom事件管理器
  private eventManager = new EventManager();
  // 组件根元素
  private rootElement: HTMLElement;

  constructor(player: Player, slotElement: HTMLElement) {
    // 播放器实例
    this.player = player;
    // 初始化dom
    this.initDom(slotElement);
    this.initListener();
  }

  private initDom(slotElement: HTMLElement) {
    const html = MaskTpl();
    this.rootElement = parseHtmlToDom(html);
    slotElement.appendChild(this.rootElement);
  }

  private initListener() {
    this.eventManager.addEventListener({
      element: this.rootElement,
      eventName: "click",
      handler: this.onMaskClick.bind(this)
    });
  }
  //   点击遮罩层
  private onMaskClick() {
    if (isMobile()) {
      this.player.toggleControls();
    } else {
      // pc端处理方式
      this.player.toggle();
    }
  }

  // 销毁
  destroy() {
    this.eventManager.removeEventListener();
  }
}
Player.registerComponent("VideoMask", VideoMask, {
  init: true
});

export default VideoMask;
