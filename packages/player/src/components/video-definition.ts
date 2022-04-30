import { isFunction, parseHtmlToDom } from "@lin-media/utils";
import { LISTACTIVECLASSNAME } from "../config/constant";
import { PlayerEvents } from "../config/event";
import Player from "../player";
import DefinitionTpl from "../templates/definition";
import { PlayerConfig } from "../types/player";
import Component from "./component";
class VideoDefinition extends Component {
  static shouldInit(options: PlayerConfig) {
    return options.sources && options.sources.length > 0;
  }

  // 当前正在播放的视频索引
  private currentIndex = -1;

  private definitionItemsElement: NodeListOf<Element>;
  private definitionLabelElement: HTMLElement;

  // 查询元素
  private querySelector<T extends HTMLElement>(selector: string) {
    return this.rootElement.querySelector(selector) as T;
  }
  private querySelectorAll(selector: string) {
    return this.rootElement.querySelectorAll(selector) as NodeListOf<Element>;
  }

  constructor(player: Player, slotElement: HTMLElement, options = {}) {
    super(player, slotElement, options);

    // 初始化dom
    this.initDom(slotElement);
    // 设置索引，播放的是哪个视频
    this.setCurrentIndex(this.getDefaultIndex());
    this.initListener();
    this.triggerReady();
  }

  private initDom(slotElement: HTMLElement) {
    const parentElement = slotElement.querySelector(".player-controls-right")!;
    const html = DefinitionTpl({
      ...this.player.options
    });
    this.rootElement = parseHtmlToDom(html);
    parentElement.appendChild(this.rootElement);
    this.definitionItemsElement = this.querySelectorAll(
      ".player-definition-item"
    );
    this.definitionLabelElement = this.querySelector(
      ".player-definition-label"
    );
  }

  // 获取默认播放的视频，有default的就是默认得了
  private getDefaultIndex() {
    const sources = this.player.options.sources;
    if (sources.length > 0) {
      const index = sources.findIndex((video) => video.default);
      if (index > -1) {
        return index;
      }
      return 0;
    }
    return -1;
  }

  // 判断能否进行切换,因为可能越界
  private isCanSwitchQuality(index: number) {
    const playerInstance = this.player;
    if (index < 0 || index > playerInstance.options.sources.length - 1) {
      playerInstance.setNotice(playerInstance.i18n.t("invalidDefinition"));
      return false;
    }
    return true;
  }

  private setCurrentIndex(index: number) {
    if (index !== this.currentIndex && this.isCanSwitchQuality(index)) {
      this.currentIndex = index;
      // 设置当前活跃的清晰度标签样式
      this.handelDefinitionItemsElement((element, i) => {
        this.setElementActive(element, i === index);
      });
      // 设置标签文本
      this.setCurrentLabel();
    }
  }

  // 设置标签文本
  private setCurrentLabel() {
    const definitionLabelElement = this.definitionLabelElement;

    const sources = this.player.options.sources;
    if (sources.length > 0 && definitionLabelElement) {
      definitionLabelElement.innerHTML = sources[this.currentIndex].label;
    }
  }

  // 这里对元素进行判断是否为空，然后执行回调函数
  private handelDefinitionItemsElement(
    callback: (element: Element, index: number) => void
  ) {
    if (isFunction(callback)) {
      const definitionItemsElement = this.definitionItemsElement;
      const length = definitionItemsElement.length;
      if (length > 0) {
        for (let i = 0; i < definitionItemsElement.length; i++) {
          const element = definitionItemsElement[i];
          callback(element, i);
        }
      }
    }
  }

  private initListener() {
    this.player.$on(
      PlayerEvents.SWITCH_DEFINITION_END,
      this.onSwitchDefinition.bind(this)
    );

    this.eventManager.addEventListener({
      element: this.querySelector(".player-definition-wrapper"),
      eventName: "click",
      handler: this.onWrapperClick.bind(this)
    });
  }

  private onSwitchDefinition({ index }: { index: number }) {
    this.setCurrentIndex(index);
  }

  private onWrapperClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    let index = target.dataset?.index ?? -1;
    index = Number(index);
    this.switchDefinition(index);
  }

  private switchDefinition(index: number) {
    if (index !== this.currentIndex && this.isCanSwitchQuality(index)) {
      // 设置当前视频索引
      this.setCurrentIndex(index);
      // 切换video标签
      this.player.switchDefinition(index);
    }
  }

  private setElementActive(element: Element, isActive: boolean) {
    if (isActive) {
      // 添加活跃状态的类名
      this.addElementActive(element);
    } else {
      // 移除活跃状态的类名
      this.delElementActive(element);
    }
  }

  private delElementActive(element: Element) {
    if (element.classList.contains(LISTACTIVECLASSNAME)) {
      element.classList.remove(LISTACTIVECLASSNAME);
    }
  }

  private addElementActive(element: Element) {
    if (!element.classList.contains(LISTACTIVECLASSNAME)) {
      element.classList.add(LISTACTIVECLASSNAME);
    }
  }
}

export default VideoDefinition;
