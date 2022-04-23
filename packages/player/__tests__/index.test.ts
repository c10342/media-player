import MediaPlayer from "@lin-media/player";
import { describe, it, expect } from "@jest/globals";

function createEvent(eventName: string) {
  const event = document.createEvent("HTMLEvents");
  event.initEvent(eventName, false, false);
  return event;
}

function nextTick(time = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

const videoList = [
  {
    label: "标清",
    url: "/demo1.mp4",
    type: "video/mp4"
  },
  {
    label: "高清",
    url: "/demo2.mp4",
    type: "video/mp4"
  }
];
const speedList = [
  {
    label: "0.5x",
    value: 0.5
  },
  {
    label: "1x",
    value: 1,
    default: true
  },
  {
    label: "1.5x",
    value: 1.5
  }
];

const playerOptions = {
  sources: videoList,
  speedList
};

describe("render", () => {
  it("base", async () => {
    const div = document.createElement("div");
    const player = new MediaPlayer({
      el: div,
      ...playerOptions
    });
    await nextTick();

    // 检查video标签是否存在
    const videoElement = div.querySelector(".player-video") as HTMLVideoElement;

    expect(videoElement).toBeTruthy();
    // 检查video的播放地址
    expect(videoElement.src).toContain(videoList[0].url);
    // 检查清晰度相关的东西
    const definitionLabel = div.querySelector(".player-definition-label");
    const definitionList = div.querySelectorAll(".player-definition-item");
    expect(definitionLabel?.innerHTML).toBe(videoList[0].label);
    expect(definitionList.length).toBe(videoList.length);
    (definitionList[1] as HTMLElement).click();
    expect(definitionLabel?.innerHTML).toBe(videoList[1].label);
    // 检查倍数相关的东西
    const speedLabel = div.querySelector(".player-speed-label");
    const speedItemList = div.querySelectorAll(".player-speed-item");
    expect(speedLabel?.innerHTML).toBe(speedList[1].label);
    expect(speedItemList.length).toBe(speedList.length);
    (speedItemList[0] as HTMLElement).click();
    expect(speedLabel?.innerHTML).toBe(speedList[0].label);
    expect(videoElement.playbackRate).toBe(speedList[0].value);
    // 播放按钮
    const playButton = div.querySelector(
      ".player-status-button"
    ) as HTMLElement;
    expect(playButton?.classList.contains("player-icon-play")).toBeTruthy();
    playButton?.click();
    expect(playButton.classList.contains("player-icon-pause")).toBeTruthy();
    // 时间
    const currentTimeLabel = div.querySelector(".player-currentTime");
    const totalTimeLabel = div.querySelector(".player-totalTime");
    expect(currentTimeLabel?.innerHTML).toBe("00:00");
    expect(totalTimeLabel?.innerHTML).toBe("00:00");
    player.seek(60);
    videoElement.dispatchEvent(createEvent("timeupdate"));
    expect(currentTimeLabel?.innerHTML).toBe("01:00");
    // 音量
    const volumeButton = div.querySelector(
      ".player-volume-button"
    ) as HTMLElement;
    expect(videoElement.volume).toBe(1);
    volumeButton.click();
    expect(videoElement.volume).toBe(0);
    // 直播
    const liveElement = div.querySelector(".player-live-tip-container");
    expect(liveElement).toBeFalsy();
  });
  it("live", async () => {
    const div = document.createElement("div");
    const player = new MediaPlayer({
      el: div,
      ...playerOptions,
      live: true
    });
    await nextTick();
    // 时间
    const timeElement = div.querySelector(".player-time-tip");
    expect(timeElement).toBeFalsy();
    // 进度条
    const progressElement = div.querySelector(".player-process-container");
    expect(progressElement).toBeFalsy();
    // 直播
    const liveElement = div.querySelector(".player-live-tip-container");
    expect(liveElement).toBeTruthy();
    // 倍数
    const speedElement = div.querySelector(".player-speed-label");
    expect(speedElement).toBeFalsy();
  });

  it("mobile", async () => {
    Object.defineProperty(global.window.navigator, "userAgent", {
      get() {
        return "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.4(0x17000428) NetType/4G Language/zh_CN";
      }
    });
    const div = document.createElement("div");
    const player = new MediaPlayer({
      el: div,
      ...playerOptions
    });
    await nextTick();
    // pc端播放按钮
    const playButton = div.querySelector(".player-status-button");
    expect(playButton).toBeFalsy();
    // 移动端播放按钮
    // const mobilePlayButton = div.querySelector(".player-mobile-play-button");
    // expect(mobilePlayButton).toBeTruthy();
    // 音量
    const volumeElement = div.querySelector(".player-volume-container");
    expect(volumeElement).toBeFalsy();
  });
});
