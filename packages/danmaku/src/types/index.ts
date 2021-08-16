// 弹幕参数
export interface BulletChatOptions {
  container: HTMLElement;
  trackSize?: number;
  fontColors?: Array<string>;
  fontSizes?: Array<number>;
  discardTime?: number;
  speedArg?: number;
  renderInterval?: number;
  // [key:string]:any
}

// 弹幕数据
export interface QueueItem {
  text: string;
  // 字体大小
  fontSize: number;
  // 字体颜色
  fontColor: string;
  //   弹幕移动时间
  rollTime: number;
  //   弹幕已经移动的距离
  rolledDistance: number;
  //   弹幕距离顶部的距离
  top: number;
  // 弹幕总的位移距离
  totalDistance: number;
  // 弹幕进入数据队列的时间
  timestamp: number;
  // 弹幕id
  id: number;
  // 弹幕需要使用多少条轨道
  useTracks: number;
  // 弹幕宽度
  width: number;
  // 弹幕的移动速度
  rollSpeed: number;
  // 弹幕开始执行动画的时间
  startTime: number;
  // 占用的轨道
  y?: Array<number>;
  node?: HTMLElement;
}

// add函数的参数
export interface PushData {
  text: string;
  fontSize?: number;
  fontColor?: string;
}

export interface DanmakuOptions {
  trackSize?: number;
  fontColors?: Array<string>;
  fontSizes?: Array<number>;
  discardTime?: number;
  speedArg?: number;
  renderInterval?: number;
}
