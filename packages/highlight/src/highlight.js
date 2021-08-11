import { isArray } from "@ava/multi-utils";
import ponintListTpl from "./template/point-list.art";
import "./style/index.scss";

class Highlight {
  // 插件名称.
  static name = "Highlight";
  // 播放器的dom
  el = null;
  // 播放器实例
  instance = null;
  // 播放器构造函数
  MultiPlayer = null;
  // 是否正在加载标志位
  load = true;
  // 高亮的列表
  highlightList = [];
  // 高亮的dom元素
  dom = null;

  constructor(el, instance, MultiPlayer) {
    // 保存一下播放器给来的参数
    this.el = el;
    this.instance = instance;
    this.MultiPlayer = MultiPlayer;
    // 获取高亮列表，开发者可以通过options传进来
    this.highlightList = this.instance.options?.highlightList ?? [];
    // 往播放器构造函数中挂在方法
    this.extendMethods();
    // 开始初始化
    this.init();
  }

  extendMethods() {
    this.MultiPlayer.extend({
      // 设置高亮列表
      setHighlight: (...args) => this.setHighlight(...args),
      // 销毁高亮列表
      destroyHighlight: () => this.destroyHighlight()
    });
  }

  // 初始化
  init() {
    // 高亮需要获取总时长，计算出高亮点的位置
    const totalTime = this.instance.totalTime;
    if (totalTime && totalTime > 0) {
      // 总时长存在并且大于0，说明视频已经加载好了
      this.load = true;
      this.initDom();
    } else {
      // 获取不到总时长说明视频没有加载完成，需要等待加载完成在执行下一步操作
      const opts = { once: true };
      this.instance.on(
        "loadedmetadata",
        () => {
          this.load = true;
          this.initDom();
        },
        opts
      );
    }
  }

  // 设置高亮列表
  setHighlight(list) {
    this.highlightList = list;
    this.initDom();
  }

  initDom() {
    const highlightList = this.highlightList;
    if (!this.load || !isArray(highlightList) || highlightList.length === 0) {
      // 视频没加载完成或者高亮列表为空不做任何操作
      return;
    }
    // 为防止重复设置,每次设置需要销毁上一次的
    this.destroyHighlight();
    // 找到进度条的dom元素
    const progressBar = this.el.querySelector(".amp-progress-wrapper");
    // 开始渲染高亮列表
    const div = document.createElement("div");
    div.innerHTML = ponintListTpl({
      highlightList,
      totalTime: this.instance.totalTime
    });
    // 保存渲染出来的高亮列表
    this.dom = div;
    // 插入到进度条中
    progressBar.appendChild(div);
  }

  // 销毁高亮列表
  destroyHighlight() {
    if (this.dom) {
      this.dom.parentNode.removeChild(this.dom);
      this.dom = null;
    }
  }
}

export default Highlight;
