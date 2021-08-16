import { isPlainObject, isString, isArray } from "@media/utils";
import { BulletChatOptions, PushData, QueueItem } from "../types";

import { getRandomItem, getTranslateX } from "./utils";

// 弹幕数据的默认结构
const defaultDanmakuData = {
  // 字体大小
  fontSize: 24,
  // 字体颜色
  fontColor: "#000",
  //   弹幕移动时间
  rollTime: 0,
  //   弹幕已经移动的距离
  rolledDistance: 0,
  //   弹幕距离顶部的距离
  top: 0,
  // 弹幕总的位移距离
  totalDistance: 0,
  // 弹幕进入数据队列的时间
  timestamp: 0,
  // 弹幕id
  id: 0,
  // 弹幕需要使用多少条轨道
  useTracks: 0,
  // 弹幕宽度
  width: 0,
  // 弹幕的移动速度
  rollSpeed: 0,
  // 弹幕开始执行动画的时间
  startTime: 0
};

const defaultOptions = {
  // 轨道高度
  trackSize: 12,
  // 默认轮询间隔时间
  renderInterval: 150,
  // 移动速率
  speedArg: 0.0058,
  // 弹幕的超时时间
  discardTime: 5 * 60 * 1000
};

class BulletChat {
  private options: BulletChatOptions;
  //   容器总高度
  private _totalHeight = 0;
  //   容器总宽度
  private _totalWidth = 0;
  //   定时器
  private _renderTimer: number | null = null;
  //   弹幕数据队列
  private _queue: Array<QueueItem> = [];
  //   轨道信息，二维数组
  private _tracks: Array<Array<QueueItem>> = [];
  // 弹幕累加器id
  private _id = 0;
  // 是否暂停弹幕的标志
  private _paused = false;
  //   同时渲染多少条
  private _maxAmountPerRender = 0;
  private _speedPercent = 1;
  constructor(options: BulletChatOptions) {
    this.options = { ...defaultOptions, ...options };
    this.resize();
    //   重置轨道
    this._resetTracks();
  }

  // 弹幕容器发生大小时调用
  resize() {
    const container = this.options.container;
    this._totalWidth = container.offsetWidth;
    this._totalHeight = container.offsetHeight;
    //   清屏
    this.clearScreen();
  }

  // 清除所有弹幕
  clearScreen() {
    this._clearDanmakuNodes();
    this._resetTracks();
  }

  // 添加弹幕数据到队列
  add(data: string | PushData | Array<PushData>) {
    if (isString(data)) {
      data = [
        {
          text: data
        }
      ];
    } else if (isPlainObject(data)) {
      data = [data] as Array<PushData>;
    }
    if (!isArray(data)) {
      return;
    }
    data.forEach((item) => {
      this._queue.push(this._parseData(item));
    });
    //   启动定时器
    if (!this._renderTimer && this._paused === false) {
      this._render();
    }
  }

  // 暂停弹幕
  pause() {
    this._clearRenderTimer();
    if (this._paused) {
      return;
    }
    this._paused = true;
    this._eachDanmakuNode((node: HTMLElement, id: number, y: number) => {
      const data = this._findData(y, id);
      if (data) {
        data.rolledDistance = -getTranslateX(node);
        // 移除动画，计算出弹幕所在的位置，固定样式
        node.style.transition = "";
        node.style.transform = `translateX(-${data.rolledDistance}px)`;
      }
    });
  }

  // 开始弹幕
  play() {
    if (!this._paused) {
      return;
    }
    this._eachDanmakuNode((node: HTMLElement, id: number, y: number) => {
      const data = this._findData(y, id);
      if (data) {
        data.startTime = Date.now();
        // 重新计算滚完剩余距离需要多少时间
        data.rollTime =
          (data.totalDistance - data.rolledDistance) / data.rollSpeed;
        node.style.transition = `transform ${data.rollTime}s linear`;
        node.style.transform = `translateX(-${data.totalDistance}px)`;
      }
    });
    this._paused = false;
    if (!this._renderTimer) {
      this._render();
    }
  }

  setSpeed(percent: number) {
    if (percent <= 0) {
      return;
    }
    this._speedPercent = percent;
  }

  _clearRenderTimer() {
    if (this._renderTimer) {
      clearTimeout(this._renderTimer);
      this._renderTimer = null;
    }
  }

  // 循环遍历弹幕节点
  _eachDanmakuNode(callback: Function) {
    const children = this.options.container.querySelectorAll(".danmaku-item");
    const length = children.length;
    for (let i = 0; i < length; i++) {
      const child = children[i] as HTMLElement;
      const dataset = child.dataset;
      if (dataset && dataset.id && dataset.y) {
        callback(child, Number(dataset.id), Number(dataset.y));
      }
    }
  }

  // 通过 y 和 id 获取弹幕数据
  _findData(y: number, id: number) {
    const track = this._tracks[y];
    for (let j = 0; j < track.length; j++) {
      if (track[j].id === id) {
        return track[j];
      }
    }
  }

  // 生成轨道
  _resetTracks() {
    const totalTracks = Math.floor(
      this._totalHeight / (this.options.trackSize as number)
    );
    this._tracks = new Array(totalTracks);
    for (let i = 0; i < totalTracks; i++) {
      this._tracks[i] = [];
    }
    this._maxAmountPerRender = Math.floor(totalTracks / 3);
  }

  // 清除所有弹幕节点
  _clearDanmakuNodes() {
    this.options.container.innerHTML = "";
  }

  // 构造数据
  _parseData(data: PushData): QueueItem {
    const fontColors = this.options.fontColors;
    const fontSizes = this.options.fontSizes;
    const commonParams: { fontColor?: string; fontSize?: number } = {};
    if (isArray(fontColors) && fontColors.length > 0) {
      commonParams.fontColor = getRandomItem<string>(fontColors);
    }
    if (isArray(fontSizes) && fontSizes.length > 0) {
      commonParams.fontSize = getRandomItem(fontSizes);
    }
    // 优先级：默认->全局->单项
    return {
      ...defaultDanmakuData,
      ...commonParams,
      ...data,
      id: ++this._id,
      timestamp: Date.now()
    };
  }

  // 把数据放到轨道上面
  _addToTrack(data: QueueItem) {
    // 弹幕数据的轨道索引，弹幕可能会占用多条数据，所以是个数组
    let y = [];
    const length = this._tracks.length;
    for (let i = 0; i < length; i++) {
      // 单条轨道
      const track = this._tracks[i];

      if (track.length !== 0) {
        // 轨道上已经有数据了，需要计算是否重叠

        // 轨道的最后一个弹幕数据
        const lastItem = track[track.length - 1];

        //   获取已经移动的距离，减少dom操作，虽然会有误差，但是误差小
        // const distance = -getTranslateX(lastItem.node);
        const distance =
          lastItem.rolledDistance +
          (lastItem.rollSpeed * (Date.now() - lastItem.startTime)) / 1000;
        //   计算是否会重叠
        //   前置条件 distance>lastItem.width ，否则说明弹幕还没完全移动到可视区域当中
        //   如果当前弹幕的移动速度小于最后一个弹幕的速度，那么不会重叠
        const flag1 = data.rollSpeed <= lastItem.rollSpeed;
        //   当当前弹幕的速度大于最后一个弹幕速度时，需要看看会不会撞车，列车碰撞数学问题
        // (distance - lastItem.width) / (data.rollSpeed - lastItem.rollSpeed) 当前弹幕追上最后一个弹幕的所需要的的时间
        // (this._totalWidth + lastItem.width - distance) / lastItem.rollSpeed 列车完全到站的时间
        const flag2 =
          (distance - lastItem.width) / (data.rollSpeed - lastItem.rollSpeed) >
          (this._totalWidth + lastItem.width - distance) / lastItem.rollSpeed;
        if (distance > lastItem.width && (flag1 || flag2)) {
          // 不会重叠
          y.push(i);
        } else {
          //   轨道1不会重叠，但是多轨道的情况下，轨道2可能会重叠，所以这里需要把轨道1也清空掉
          y = [];
        }
      } else {
        //   轨道上面没有数据
        y.push(i);
      }
      // 轨道数量足够是可以新增弹幕了，否则等待下一次轮询
      if (y.length >= data.useTracks) {
        data.y = y;
        // 往所需要的占用的轨道中添加数据
        y.forEach((j) => {
          this._tracks[j].push(data);
        });
        // 退出循环
        break;
      }
    }
  }

  // 从轨道上删除数据
  _removeFromTrack(y: Array<number>, id: number) {
    y.forEach((i) => {
      const track = this._tracks[i];
      const length = track.length;
      for (let j = 0; j < length; j++) {
        if (track[j].id === id) {
          track.splice(j, 1);
          break;
        }
      }
    });
  }

  // 轮询渲染
  _render() {
    try {
      this._renderToDOM();
    } finally {
      this._renderEnd();
    }
  }

  // 渲染dom节点
  _renderToDOM() {
    let count = this._maxAmountPerRender;
    let i = 0;
    while (count && i < this._queue.length) {
      const data = this._queue[i];
      // 生成弹幕节点
      const result = this._createNode(data, i);
      if (result === false) {
        continue;
      }
      // 添加进轨道
      this._addToTrack(data);
      //   有轨道显示弹幕
      if (data.y) {
        this._startAnimation(data, i);
      } else {
        i++;
      }
      count--;
    }
  }

  // 生成弹幕节点
  _createNode(data: QueueItem, index: number) {
    let node = data.node;
    if (!node) {
      // 丢弃排队时间过长的弹幕
      if (
        this._queue.length > this._tracks.length * 2 &&
        Date.now() - data.timestamp > (this.options.discardTime as number)
      ) {
        this._queue.splice(index, 1);
        return false;
      }
      // 还没生成dom节点
      data.node = node = document.createElement("span");
      node.innerHTML = data.text;
      node.className = "danmaku-item";
      node.style.color = data.fontColor;
      node.style.fontSize = `${data.fontSize}px`;
      this.options.container.appendChild(node);
      // 该弹幕需要占用的轨道数量
      data.useTracks = Math.ceil(
        node.offsetHeight / (this.options.trackSize as number)
      );
      // 占用的轨道数大于轨道总数，忽略这个数据
      if (data.useTracks > this._tracks.length) {
        // 删除这个数据
        this._queue.splice(index, 1);
        node.remove();
        return false;
      }
      // 弹幕宽度
      data.width = node.offsetWidth;
      // 弹幕的需要移动的距离
      data.totalDistance = data.width + this._totalWidth;
      const defaultTime = Math.floor(
        data.totalDistance *
          (this.options.speedArg as number) *
          (Math.random() * 0.3 + 0.7)
      );

      // 弹幕移动时间
      data.rollTime = (data.rollTime || defaultTime) * this._speedPercent;

      // 弹幕的移动速度
      data.rollSpeed = data.totalDistance / data.rollTime;
    }

    return true;
  }

  // 开启动画
  _startAnimation(data: QueueItem, index: number) {
    if (data.y) {
      const node = data.node as HTMLElement;
      data.startTime = Date.now() + 80;
      this._queue.splice(index, 1);
      node.setAttribute("data-id", data.id + "");
      node.setAttribute("data-y", data.y[0] + "");
      //   设置距离顶部的距离
      node.style.top = `${data.y[0] * (this.options.trackSize as number)}px`;
      node.style.transition = `transform ${data.rollTime}s linear`;
      node.style.transform = `translateX(-${data.totalDistance}px)`;
      const onTransitionend = () => {
        this._removeFromTrack(data.y as Array<number>, data.id);
        node.remove();
        node.removeEventListener("transitionend", onTransitionend, false);
      };
      const onTransitionstart = () => {
        data.startTime = Date.now();
        node.removeEventListener("transitionstart", onTransitionend, false);
      };
      node.addEventListener("transitionend", onTransitionend, false);
      node.addEventListener("transitionstart", onTransitionstart, false);
    }
  }

  // 轮询结束后，根据队列长度继续执行或停止执行
  _renderEnd() {
    if (this._queue.length > 0) {
      this._renderTimer = window.setTimeout(() => {
        this._render();
      }, this.options.renderInterval);
    } else {
      // 如果已经没有数据，就不再轮询了，等有数据时（add 方法中）再开启轮询
      this._renderTimer = null;
    }
  }
}

export default BulletChat;
