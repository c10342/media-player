import { Drag, EventManager } from "@lin-media/utils";
import { CheckboxClassNameEnum, DanmakuAreaEnum } from "./config/enum";
import BulletChat from "./js/bullet-chat";
import { DanmakuOptions, PushData } from "./types";
import settingTpl from "./template/setting.art";
import "./style/index.scss";
import i18n from "./locale";
import MediaPlayer, { PlayerEvents } from "@lin-media/player";
import { pluginName } from "./config/constant";

interface DataInfo {
  offsetX: number;
  offsetY: number;
  percentX: number;
  percentY: number;
}

class Danmaku {
  static pluginName = pluginName;

  private options: DanmakuOptions;
  // 播放器的dom
  private _el: HTMLElement;
  // 播放器实例
  private _instance: MediaPlayer;
  private _eventManager: EventManager | null;
  // 弹幕类
  private _bulletChat: BulletChat | null;
  // 弹幕容器
  private _danmakuWrapperElement: HTMLElement;
  // 弹幕设置容器
  private _settingWrapperElement: HTMLElement;
  // 透明度进度条容器
  private _opacityWrapperElement: HTMLElement;
  // 透明度进度条
  private _opacityProgressElement: HTMLElement;
  // 透明度小球
  private _opacityBallElement: HTMLElement;
  // 透明度小球
  private _opacityDragInstance: Drag | null;

  // 弹幕速度相关
  private _speedWrapperElement: HTMLElement;
  private _speedProgressElement: HTMLElement;
  private _speedBallElement: HTMLElement;
  private _speedDragInstance: Drag | null;

  // 显示或者隐藏弹幕相关
  private _showLabelElement: HTMLElement;
  private _isShowDanmaku = true;

  // 暂停或者显示弹幕相关
  private _pauseLabelElement: HTMLElement;
  private _isPauseDanmaku = false;

  // 弹幕显示区域相关
  private _danmakuAreaWrapperElement: HTMLElement;
  private _danmakuAreaPosition = DanmakuAreaEnum.all;

  constructor(el: HTMLElement, instance: MediaPlayer) {
    this._el = el;
    this._instance = instance;
    const options = instance.options[pluginName] ?? {};
    this.options = options;
    // 初始化语言
    this._initLang();
    // 初始化变量
    this._initVar();
    // 生成dom元素
    this._initElement();
    // 获取相关元素
    this._initHTMLElement();
    // 初始化弹幕
    this._initDanmaku();
    // 初始化弹幕透明度
    this._initOpacitySetting();
    // 初始化弹幕速度
    this._initSpeedSetting();
    // 初始化监听
    this._initListener();
    // 挂载方法给外部用
    this._initMethods();
  }

  private _initMethods() {
    Object.defineProperty(this._instance, "danmaku", {
      get: () => {
        return {
          // 发送弹幕
          send: (data: string | PushData | Array<PushData>) => {
            this._bulletChat?.add(data);
          },
          // 开始弹幕
          play: () => {
            this._bulletChat?.play();
            this._isPauseDanmaku = false;
            this._switchPlayOrPause();
          },
          // 暂停弹幕
          pause: () => {
            this._bulletChat?.pause();
            this._isPauseDanmaku = true;
            this._switchPlayOrPause();
          },
          // 容器发生变化
          resize: () => {
            this._bulletChat?.resize();
          },
          // 清屏
          clearScreen: () => {
            this._bulletChat?.clearScreen();
          },
          // 设置速度
          setSpeed: (percent: number) => {
            this._bulletChat?.setSpeed(percent);
          },
          // 关闭弹幕
          close: () => {
            this._bulletChat?.close();
            this._isShowDanmaku = false;
            this._switchShowOrHide();
          },
          // 打开弹幕
          open: () => {
            this._bulletChat?.open();
            this._isShowDanmaku = true;
            this._switchShowOrHide();
          }
        };
      }
    });
  }

  private _initLang() {
    // 先设置中英文
    i18n.setLang(MediaPlayer.lang);
    // 设置i18n处理函数
    i18n.i18n(MediaPlayer.i18nFn);
    // 最后才设置自定义语言包，否则i18n.setLang会覆盖掉自定义语言包
    i18n.use((MediaPlayer.langObject as any).danmaku);
  }

  private _initVar() {
    this._eventManager = new EventManager();
  }

  private _initElement() {
    const danmuDiv = document.createElement("div");
    danmuDiv.className = "danmaku-container danmaku-container-all";
    this._el.appendChild(danmuDiv);
    this._danmakuWrapperElement = danmuDiv;

    const settingDiv = document.createElement("div");
    settingDiv.className = "danmaku-setting-container";
    settingDiv.innerHTML = settingTpl({
      areaList: [
        {
          label: i18n.t("full"),
          position: "all",
          checked: true
        },
        {
          label: i18n.t("top"),
          position: "top"
        },
        {
          label: i18n.t("bottom"),
          position: "bottom"
        }
      ],
      switchList: [
        {
          label: i18n.t("pause"),
          className: "danmaku-pause-label",
          open: false
        },
        {
          label: i18n.t("show"),
          className: "danmaku-show-label",
          open: true
        }
      ],
      progressList: [
        {
          label: i18n.t("opacity"),
          wrapperClassName: "danmu-opacity-wrapper",
          progressClassName: "danmu-opacity-progress",
          ballClassName: "danmu-opacity-ball"
        },
        {
          label: i18n.t("speed"),
          wrapperClassName: "danmu-speed-wrapper",
          progressClassName: "danmu-speed-progress",
          ballClassName: "danmu-speed-ball"
        }
      ],
      showArea: i18n.t("showArea")
    });
    const parentNode = this._el.querySelector(
      ".player-controls-right"
    ) as HTMLElement;
    parentNode.insertBefore(settingDiv, parentNode?.firstElementChild);
    this._settingWrapperElement = settingDiv;
  }

  private _initDanmaku() {
    this._bulletChat = new BulletChat({
      ...this.options,
      container: this._danmakuWrapperElement
    });
  }

  private _initListener() {
    this._instance.$on(PlayerEvents.DESTROY, () => {
      this._destroy();
    });
    this._instance.$on(PlayerEvents.RESIZE, () => {
      this._bulletChat?.resize();
    });
    this._eventManager?.addEventListener({
      element: this._showLabelElement,
      eventName: "click",
      handler: this._onShowOrHideChange.bind(this)
    });
    this._eventManager?.addEventListener({
      element: this._pauseLabelElement,
      eventName: "click",
      handler: this._onPlayOrPauseChange.bind(this)
    });
    this._eventManager?.addEventListener({
      element: this._danmakuAreaWrapperElement,
      eventName: "click",
      handler: this._onAreaClick.bind(this)
    });
  }

  private _getSettingElement(selector: string) {
    return this._settingWrapperElement.querySelector(selector) as HTMLElement;
  }

  private _initHTMLElement() {
    this._opacityWrapperElement = this._getSettingElement(
      ".danmu-opacity-wrapper"
    );
    this._opacityProgressElement = this._getSettingElement(
      ".danmu-opacity-progress"
    );
    this._opacityBallElement = this._getSettingElement(".danmu-opacity-ball");
    this._showLabelElement = this._getSettingElement(".danmaku-show-label");
    this._pauseLabelElement = this._getSettingElement(".danmaku-pause-label");
    this._danmakuAreaWrapperElement = this._getSettingElement(".danmaku-area");

    this._speedWrapperElement = this._getSettingElement(".danmu-speed-wrapper");
    this._speedProgressElement = this._getSettingElement(
      ".danmu-speed-progress"
    );
    this._speedBallElement = this._getSettingElement(".danmu-speed-ball");
  }

  private _initOpacitySetting() {
    this._opacityDragInstance = new Drag({
      wrapperElement: this._opacityWrapperElement,
      dragElement: this._opacityBallElement
    });
    this._opacityDragInstance.$on("mousemove", this._setOpacity.bind(this));
    this._opacityDragInstance.$on("click", this._setOpacity.bind(this));
  }

  private _initSpeedSetting() {
    this._speedDragInstance = new Drag({
      wrapperElement: this._speedWrapperElement,
      dragElement: this._speedBallElement
    });
    this._speedProgressElement.style.width = "50%";
    this._speedDragInstance.$on("mousemove", (event: DataInfo) => {
      this._speedProgressElement!.style.width = `${event.percentX * 100}%`;
    });
    this._speedDragInstance.$on("mouseup", this._setSpeed.bind(this));
    this._speedDragInstance.$on("click", this._setSpeed.bind(this));
  }

  private _setOpacity(event: DataInfo) {
    this._opacityProgressElement.style.width = `${event.percentX * 100}%`;
    this._danmakuWrapperElement.style.opacity = `${event.percentX}`;
  }

  private _setSpeed(event: DataInfo) {
    this._speedProgressElement.style.width = `${event.percentX * 100}%`;
    this._bulletChat?.setSpeed(event.percentX * 2);
  }

  private _onShowOrHideChange() {
    this._isShowDanmaku = !this._isShowDanmaku;
    this._switchShowOrHide();
  }

  private _onPlayOrPauseChange() {
    this._isPauseDanmaku = !this._isPauseDanmaku;
    this._switchPlayOrPause();
  }

  // 切换播放/暂停弹幕状态
  private _switchPlayOrPause() {
    if (this._isPauseDanmaku) {
      this._pauseLabelElement.classList.remove(CheckboxClassNameEnum.close);
      this._pauseLabelElement.classList.add(CheckboxClassNameEnum.open);
      this._bulletChat?.pause();
    } else {
      this._pauseLabelElement.classList.remove(CheckboxClassNameEnum.open);
      this._pauseLabelElement.classList.add(CheckboxClassNameEnum.close);
      this._bulletChat?.play();
    }
  }

  // 切换显示/隐藏弹幕状态
  private _switchShowOrHide() {
    if (this._isShowDanmaku) {
      this._showLabelElement.classList.remove(CheckboxClassNameEnum.close);
      this._showLabelElement.classList.add(CheckboxClassNameEnum.open);
      this._bulletChat?.open();
    } else {
      this._showLabelElement.classList.remove(CheckboxClassNameEnum.open);
      this._showLabelElement.classList.add(CheckboxClassNameEnum.close);
      this._bulletChat?.close();
    }
  }

  private _onAreaClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dataset = target.dataset;
    if (
      dataset &&
      dataset.position &&
      this._danmakuAreaPosition !== dataset.position
    ) {
      let className = "danmaku-container ";
      switch (dataset.position) {
        case DanmakuAreaEnum.all:
          className += " danmaku-container-all";
          break;
        case DanmakuAreaEnum.top:
          className += " danmaku-container-top";
          break;
        case DanmakuAreaEnum.bottom:
          className += " danmaku-container-bottom";
          break;
      }
      this._danmakuWrapperElement.className = className;
      this._switchAreaActive(dataset.position);
      this._danmakuAreaPosition = dataset.position as DanmakuAreaEnum;
      this._bulletChat?.resize();
    }
  }

  private _switchAreaActive(position: string) {
    const list =
      this._danmakuAreaWrapperElement.querySelectorAll(".danmaku-area-span");
    const length = list.length;
    for (let i = 0; i < length; i++) {
      const element = list[i] as HTMLElement;

      if (element.dataset.position === position) {
        element.classList.add("danmaku-radio-checked");
      } else {
        element.classList.remove("danmaku-radio-checked");
      }
    }
  }

  private _destroy() {
    this._bulletChat?.destroy();
    this._danmakuWrapperElement.remove();
    this._settingWrapperElement.remove();
    this._opacityDragInstance?.destroy();
    this._bulletChat = null;
    this._eventManager?.removeEventListener();
  }
}

export default Danmaku;
