import pointListTpl from "./template/point-list.art";
import "./style/index.scss";
import { EventManager, isArray } from "@media/utils";
import { HighlightList, HighlightOptions } from "./types";

const defaultOptions = {
  jump: true,
  showTip: true
};

class Highlight {
  // 插件名称.
  static pluginName = "Highlight";
  // 播放器的dom
  private el: HTMLElement;
  // 播放器实例
  private instance: any;
  // 播放器构造函数
  private Player: any;
  // 是否正在加载标志位
  private load = true;
  // 提示点的dom元素
  private element: HTMLElement | null;
  // 事件管理器
  private eventManager: EventManager | null;
  // 提示点参数
  private options: HighlightOptions;

  constructor(el: HTMLElement, instance: any, Player: any) {
    // 保存一下播放器给来的参数
    this.el = el;
    this.instance = instance;
    this.Player = Player;
    // 合并默认参数
    const options = this.instance.options?.highlightOptions ?? {};
    this.options = { ...defaultOptions, ...options };
    this.initVar();
    // 往播放器实例中挂在方法
    this.extendMethods();
    // 开始初始化
    this.init();
    // 销毁
    this.instance.$on("destroy", () => {
      this.destroyHighlight();
    });
  }

  initVar() {
    this.eventManager = new EventManager();
  }

  private get duration() {
    return this.instance.duration;
  }

  private extendMethods() {
    this.instance.extend({
      // 设置提示点列表
      setHighlight: (list: HighlightList) => this.setHighlight(list),
      // 销毁提示点列表
      destroyHighlight: () => this.destroyHighlight()
    });
  }

  // 初始化
  private init() {
    // 提示点需要获取总时长，计算出提示点的位置
    if (this.duration && this.duration > 0) {
      // 总时长存在并且大于0，说明视频已经加载好了
      this.load = true;
      this.initElement();
    } else {
      // 获取不到总时长说明视频没有加载完成，需要等待加载完成在执行下一步操作
      this.instance.$once("loadedmetadata", () => {
        this.load = true;
        this.initElement();
      });
    }
  }

  // 设置提示点列表
  setHighlight(list: HighlightList) {
    this.options.list = list;
    this.initElement();
  }

  initElement() {
    const highlightList = this.options.list;
    if (!this.load || !isArray(highlightList) || highlightList.length === 0) {
      // 视频没加载完成或者提示点列表为空不做任何操作
      return;
    }
    // 为防止重复设置,每次设置需要销毁上一次的
    this.destroyHighlight();
    // 找到进度条的dom元素
    const progressBar = this.el.querySelector(".player-process-content");
    // 开始渲染提示点列表
    const div = document.createElement("div");
    div.innerHTML = pointListTpl({
      highlightList,
      duration: this.duration
    });
    // 保存渲染出来的提示点元素
    this.element = div;
    // 插入到进度条中
    progressBar?.appendChild(div);
    // 事件监听
    this.initListener();
  }

  initListener() {
    // 事件委托，不要去监听单个元素的
    this.eventManager?.addEventListener({
      element: this.element,
      eventName: "click",
      handler: this.onClick.bind(this)
    });
  }

  removeListener() {
    this.eventManager?.removeEventListener();
  }

  onClick(event: MouseEvent) {
    const { jump, showTip } = this.options;
    const target = event.target as HTMLElement;
    const dataset = target.dataset;
    if (dataset && dataset.index) {
      // 点击的是提示点
      const highlightList = this.options.list as HighlightList;
      const item = highlightList[dataset.index as any];
      if (jump) {
        // 跳转
        this.instance.seek(item.time);
      }
      if (showTip) {
        // 显示提示
        this.instance.setNotice(item.text);
      }
      // 发射自定义事件
      this.instance.$emit("highlight-click", item);
    }
  }

  // 销毁提示点列表
  destroyHighlight() {
    this.removeListener();
    if (this.element) {
      this.element.parentNode?.removeChild(this.element);
      this.element = null;
    }
  }
}

export default Highlight;
