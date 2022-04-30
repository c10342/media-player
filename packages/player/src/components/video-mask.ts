import { isMobile, parseHtmlToDom } from "@lin-media/utils";
import Player from "../player";
import MaskTpl from "../templates/mask";
import Component from "./component";

class VideoMask extends Component {
  constructor(player: Player, slotElement: HTMLElement, options = {}) {
    super(player, slotElement, options);

    // 初始化dom
    this.initDom(slotElement);
    this.initListener();
    this.initComponent(VideoMask.id);
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
}

export default VideoMask;
