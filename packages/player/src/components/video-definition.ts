import { EventManager, isFunction, parseHtmlToDom } from "@lin-media/utils";
import { LISTACTIVECLASSNAME, VIDEODEFINITION } from "../config/constant";
import { PlayerEvents } from "../config/event";
import MediaPlayer from "../index";
import DefinitionTpl from "../templates/definition";
class VideoDefinition {
  static pluginName = VIDEODEFINITION;
  // 播放器实例
  private _playerInstance: MediaPlayer;
  // dom事件管理器
  private _eventManager = new EventManager();
  // 组件根元素
  private _compRootElement: HTMLElement;
  // 当前正在播放的视频索引
  private _currentIndex = -1;

  private _definitionItemsElement: NodeListOf<Element>;
  private _definitionLabelElement: HTMLElement;

  // 查询元素
  private _querySelector<T extends HTMLElement>(selector: string) {
    return this._compRootElement.querySelector(selector) as T;
  }
  private _querySelectorAll(selector: string) {
    return this._compRootElement.querySelectorAll(
      selector
    ) as NodeListOf<Element>;
  }

  constructor(playerInstance: MediaPlayer, slotElement: HTMLElement) {
    // 播放器实例
    this._playerInstance = playerInstance;
    // 初始化dom
    this._initDom(slotElement);
    // 设置索引，播放的是哪个视频
    this._setCurrentIndex(this._getDefaultIndex());
    this._initListener();
  }

  private _initDom(slotElement: HTMLElement) {
    const html = DefinitionTpl({
      ...this._playerInstance.$options
    });
    this._compRootElement = parseHtmlToDom(html);
    slotElement.appendChild(this._compRootElement);
    this._definitionItemsElement = this._querySelectorAll(
      ".player-definition-item"
    );
    this._definitionLabelElement = this._querySelector(
      ".player-definition-label"
    );
  }

  // 获取默认播放的视频，有default的就是默认得了
  private _getDefaultIndex() {
    const videoList = this._playerInstance.$options.videoList;
    if (videoList.length > 0) {
      const index = videoList.findIndex((video) => video.default);
      if (index > -1) {
        return index;
      }
      return 0;
    }
    return -1;
  }

  // 判断能否进行切换,因为可能越界
  private _isCanSwitchQuality(index: number) {
    const playerInstance = this._playerInstance;
    if (index < 0 || index > playerInstance.$options.videoList.length - 1) {
      playerInstance.setNotice(playerInstance.$i18n.t("invalidDefinition"));
      return false;
    }
    return true;
  }

  private _setCurrentIndex(index: number) {
    if (index !== this._currentIndex && this._isCanSwitchQuality(index)) {
      this._currentIndex = index;
      // 设置当前活跃的清晰度标签样式
      this._handelDefinitionItemsElement((element, i) => {
        this._setElementActive(element, i === index);
      });
      // 设置标签文本
      this._setCurrentLabel();
    }
  }

  // 设置标签文本
  private _setCurrentLabel() {
    const definitionLabelElement = this._definitionLabelElement;

    const videoList = this._playerInstance.$options.videoList;
    if (videoList.length > 0 && definitionLabelElement) {
      definitionLabelElement.innerHTML = videoList[this._currentIndex].label;
    }
  }

  // 这里对元素进行判断是否为空，然后执行回调函数
  private _handelDefinitionItemsElement(
    callback: (element: Element, index: number) => void
  ) {
    if (isFunction(callback)) {
      const definitionItemsElement = this._definitionItemsElement;
      const length = definitionItemsElement.length;
      if (length > 0) {
        for (let i = 0; i < definitionItemsElement.length; i++) {
          const element = definitionItemsElement[i];
          callback(element, i);
        }
      }
    }
  }

  private _initListener() {
    this._on(PlayerEvents.DESTROY, this._destroy.bind(this));
    this._on(
      PlayerEvents.SWITCH_DEFINITION_END,
      this._onSwitchDefinition.bind(this)
    );

    this._eventManager.addEventListener({
      element: this._querySelector(".player-definition-wrapper"),
      eventName: "click",
      handler: this._onWrapperClick.bind(this)
    });
  }

  private _onSwitchDefinition({ index }: { index: number }) {
    this._setCurrentIndex(index);
  }

  private _onWrapperClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    let index = target.dataset?.index ?? -1;
    index = Number(index);
    this._switchDefinition(index);
  }

  private _switchDefinition(index: number) {
    if (index !== this._currentIndex && this._isCanSwitchQuality(index)) {
      // 设置当前视频索引
      this._setCurrentIndex(index);
      // 切换video标签
      this._playerInstance.switchDefinition(index);
    }
  }

  private _setElementActive(element: Element, isActive: boolean) {
    if (isActive) {
      // 添加活跃状态的类名
      this._addElementActive(element);
    } else {
      // 移除活跃状态的类名
      this._delElementActive(element);
    }
  }

  private _delElementActive(element: Element) {
    if (element.classList.contains(LISTACTIVECLASSNAME)) {
      element.classList.remove(LISTACTIVECLASSNAME);
    }
  }

  private _addElementActive(element: Element) {
    if (!element.classList.contains(LISTACTIVECLASSNAME)) {
      element.classList.add(LISTACTIVECLASSNAME);
    }
  }

  // 监听事件
  private _on(eventName: string, handler: Function) {
    this._playerInstance.$eventBus.$on(eventName, handler);
  }
  private _destroy() {
    this._eventManager.removeEventListener();
  }
}

export default VideoDefinition;
