import { pluginName } from "../config/constant";
import { PushData } from "../types";

export function initMethod(ctro: any) {
  Object.defineProperty(ctro.prototype, "danmaku", {
    get() {
      const danmakuInstance = this.plugins[pluginName];
      return {
        // 发送弹幕
        send: (data: string | PushData | Array<PushData>) => {
          danmakuInstance._bulletChat?.add(data);
          return this;
        },
        // 开始弹幕
        play: () => {
          danmakuInstance._bulletChat?.play();
          danmakuInstance._isPauseDanmaku = false;
          danmakuInstance._switchPlayOrPause();
          return this;
        },
        // 暂停弹幕
        pause: () => {
          danmakuInstance._bulletChat?.pause();
          danmakuInstance._isPauseDanmaku = true;
          danmakuInstance._switchPlayOrPause();
          return this;
        },
        // 容器发生变化
        resize: () => {
          danmakuInstance._bulletChat?.resize();
          return this;
        },
        // 清屏
        clearScreen: () => {
          danmakuInstance._bulletChat?.clearScreen();
          return this;
        },
        // 设置速度
        setSpeed: (percent: number) => {
          danmakuInstance._bulletChat?.setSpeed(percent);
          return this;
        },
        // 关闭弹幕
        close: () => {
          danmakuInstance._bulletChat?.close();
          danmakuInstance._isShowDanmaku = false;
          danmakuInstance._switchShowOrHide();
          return this;
        },
        // 打开弹幕
        open: () => {
          danmakuInstance._bulletChat?.open();
          danmakuInstance._isShowDanmaku = true;
          danmakuInstance._switchShowOrHide();
          return this;
        }
      };
    }
  });
}
