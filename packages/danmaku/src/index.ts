import { Drag, updateStyle } from "@lin-media/utils";
import { CheckboxClassNameEnum, DanmakuAreaEnum } from "./config/enum";
import BulletChat from "./js/bullet-chat";
import { DanmakuOptions, PushData } from "./types";
import settingTpl from "./template/setting";
import "./style/index.scss";
import initLocale from "./locale";
import Player from "@lin-media/player";

interface DataInfo {
  offsetX: number;
  offsetY: number;
  percentX: number;
  percentY: number;
}

const Component = Player.getComponent<DanmakuOptions>("Component");

class Danmaku extends Component {
  // 弹幕类
  private bulletChat: BulletChat | null;
  // 弹幕容器
  private danmakuWrapperElement: HTMLElement;
  // 弹幕设置容器
  private settingWrapperElement: HTMLElement;
  // 透明度进度条容器
  private opacityWrapperElement: HTMLElement;
  // 透明度进度条
  private opacityProgressElement: HTMLElement;
  // 透明度小球
  private opacityBallElement: HTMLElement;
  // 透明度小球
  private opacityDragInstance: Drag | null;

  // 弹幕速度相关
  private speedWrapperElement: HTMLElement;
  private speedProgressElement: HTMLElement;
  private speedBallElement: HTMLElement;
  private speedDragInstance: Drag | null;

  // 显示或者隐藏弹幕相关
  private showLabelElement: HTMLElement;
  private isShowDanmaku = true;

  // 暂停或者显示弹幕相关
  private pauseLabelElement: HTMLElement;
  private isPauseDanmaku = false;

  // 弹幕显示区域相关
  private danmakuAreaWrapperElement: HTMLElement;
  private danmakuAreaPosition = DanmakuAreaEnum.all;

  private i18n = initLocale();

  constructor(
    player: Player,
    slotElement: HTMLElement,
    options: DanmakuOptions = {},
    parentComponent: any
  ) {
    super(player, slotElement, options, parentComponent);

    // 初始化语言
    this.initLang();
    // 生成dom元素
    this.initElement();
    // 获取相关元素
    this.initHTMLElement();
    // 初始化弹幕
    this.initDanmaku();
    // 初始化弹幕透明度
    this.initOpacitySetting();
    // 初始化弹幕速度
    this.initSpeedSetting();
    // 初始化监听
    this.initListener();
    // 挂载方法给外部用
    this.initMethods();
    this.triggerReady();
  }

  private initMethods() {
    Object.defineProperty(this.player, "danmaku", {
      get: () => {
        return {
          // 发送弹幕
          send: (data: string | PushData | Array<PushData>) => {
            this.bulletChat?.add(data);
          },
          // 开始弹幕
          play: () => {
            this.bulletChat?.play();
            this.isPauseDanmaku = false;
            this.switchPlayOrPause();
          },
          // 暂停弹幕
          pause: () => {
            this.bulletChat?.pause();
            this.isPauseDanmaku = true;
            this.switchPlayOrPause();
          },
          // 容器发生变化
          resize: () => {
            this.bulletChat?.resize();
          },
          // 清屏
          clearScreen: () => {
            this.bulletChat?.clearScreen();
          },
          // 设置速度
          setSpeed: (percent: number) => {
            this.bulletChat?.setSpeed(percent);
          },
          // 关闭弹幕
          close: () => {
            this.bulletChat?.close();
            this.isShowDanmaku = false;
            this.switchShowOrHide();
          },
          // 打开弹幕
          open: () => {
            this.bulletChat?.open();
            this.isShowDanmaku = true;
            this.switchShowOrHide();
          }
        };
      }
    });
  }

  private initLang() {
    // 先设置中英文
    const options = this.player.options;
    this.i18n.setLang(options.lang);
    // 最后才设置自定义语言包，否则i18n.setLang会覆盖掉自定义语言包
    this.i18n.use(options.customLanguage?.Danmaku);
  }

  private initElement() {
    const danmuDiv = document.createElement("div");
    danmuDiv.className = "danmaku-container danmaku-container-all";

    this.player.rootElement.appendChild(danmuDiv);
    this.danmakuWrapperElement = danmuDiv;
    const i18n = this.i18n;
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
    const parentElement = this.slotElement.querySelector(
      ".player-controls-right"
    ) as HTMLElement;
    parentElement.insertBefore(settingDiv, parentElement?.firstElementChild);
    this.settingWrapperElement = settingDiv;
  }

  private initDanmaku() {
    this.bulletChat = new BulletChat({
      ...this.options,
      container: this.danmakuWrapperElement
    });
  }

  private initListener() {
    this.player.$on(Player.Events.RESIZE, () => {
      this.bulletChat?.resize();
    });
    this.eventManager?.addEventListener({
      element: this.showLabelElement,
      eventName: "click",
      handler: this.onShowOrHideChange.bind(this)
    });
    this.eventManager?.addEventListener({
      element: this.pauseLabelElement,
      eventName: "click",
      handler: this.onPlayOrPauseChange.bind(this)
    });
    this.eventManager?.addEventListener({
      element: this.danmakuAreaWrapperElement,
      eventName: "click",
      handler: this.onAreaClick.bind(this)
    });
  }

  private getSettingElement(selector: string) {
    return this.settingWrapperElement.querySelector(selector) as HTMLElement;
  }

  private initHTMLElement() {
    this.opacityWrapperElement = this.getSettingElement(
      ".danmu-opacity-wrapper"
    );
    this.opacityProgressElement = this.getSettingElement(
      ".danmu-opacity-progress"
    );
    this.opacityBallElement = this.getSettingElement(".danmu-opacity-ball");
    this.showLabelElement = this.getSettingElement(".danmaku-show-label");
    this.pauseLabelElement = this.getSettingElement(".danmaku-pause-label");
    this.danmakuAreaWrapperElement = this.getSettingElement(".danmaku-area");

    this.speedWrapperElement = this.getSettingElement(".danmu-speed-wrapper");
    this.speedProgressElement = this.getSettingElement(".danmu-speed-progress");
    this.speedBallElement = this.getSettingElement(".danmu-speed-ball");
  }

  private initOpacitySetting() {
    this.opacityDragInstance = new Drag({
      wrapperElement: this.opacityWrapperElement,
      dragElement: this.opacityBallElement
    });
    this.opacityDragInstance.$on("mousemove", this.setOpacity.bind(this));
    this.opacityDragInstance.$on("click", this.setOpacity.bind(this));
  }

  private initSpeedSetting() {
    this.speedDragInstance = new Drag({
      wrapperElement: this.speedWrapperElement,
      dragElement: this.speedBallElement
    });
    updateStyle(this.speedProgressElement, {
      width: "50%"
    });
    this.speedDragInstance.$on("mousemove", (event: DataInfo) => {
      updateStyle(this.speedProgressElement, {
        width: `${event.percentX * 100}%`
      });
    });
    this.speedDragInstance.$on("mouseup", this.setSpeed.bind(this));
    this.speedDragInstance.$on("click", this.setSpeed.bind(this));
  }

  private setOpacity(event: DataInfo) {
    updateStyle(this.opacityProgressElement, {
      width: `${event.percentX * 100}%`
    });
    updateStyle(this.danmakuWrapperElement, {
      opacity: `${event.percentX}`
    });
  }

  private setSpeed(event: DataInfo) {
    updateStyle(this.speedProgressElement, {
      width: `${event.percentX * 100}%`
    });
    this.bulletChat?.setSpeed(event.percentX * 2);
  }

  private onShowOrHideChange() {
    this.isShowDanmaku = !this.isShowDanmaku;
    this.switchShowOrHide();
  }

  private onPlayOrPauseChange() {
    this.isPauseDanmaku = !this.isPauseDanmaku;
    this.switchPlayOrPause();
  }

  // 切换播放/暂停弹幕状态
  private switchPlayOrPause() {
    if (this.isPauseDanmaku) {
      this.pauseLabelElement.classList.remove(CheckboxClassNameEnum.close);
      this.pauseLabelElement.classList.add(CheckboxClassNameEnum.open);
      this.bulletChat?.pause();
    } else {
      this.pauseLabelElement.classList.remove(CheckboxClassNameEnum.open);
      this.pauseLabelElement.classList.add(CheckboxClassNameEnum.close);
      this.bulletChat?.play();
    }
  }

  // 切换显示/隐藏弹幕状态
  private switchShowOrHide() {
    if (this.isShowDanmaku) {
      this.showLabelElement.classList.remove(CheckboxClassNameEnum.close);
      this.showLabelElement.classList.add(CheckboxClassNameEnum.open);
      this.bulletChat?.open();
    } else {
      this.showLabelElement.classList.remove(CheckboxClassNameEnum.open);
      this.showLabelElement.classList.add(CheckboxClassNameEnum.close);
      this.bulletChat?.close();
    }
  }

  private onAreaClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dataset = target.dataset;
    if (
      dataset &&
      dataset.position &&
      this.danmakuAreaPosition !== dataset.position
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
      this.danmakuWrapperElement.className = className;
      this.switchAreaActive(dataset.position);
      this.danmakuAreaPosition = dataset.position as DanmakuAreaEnum;
      this.bulletChat?.resize();
    }
  }

  private switchAreaActive(position: string) {
    const list =
      this.danmakuAreaWrapperElement.querySelectorAll(".danmaku-area-span");
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

  destroy() {
    this.bulletChat?.destroy();
    this.danmakuWrapperElement.remove();
    this.settingWrapperElement.remove();
    this.opacityDragInstance?.destroy();
    this.bulletChat = null;
    super.destroy();
  }
}

export default Danmaku;
