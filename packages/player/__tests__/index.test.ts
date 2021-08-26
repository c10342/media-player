import MediaPlayer from "@lin-media/player";
import { describe, it, expect } from "@jest/globals";
const videoList = [
  {
    label: "标清",
    url: "/demo1.mp4"
  },
  {
    label: "高清",
    url: "/demo2.mp4"
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
  videoList,
  speedList,
  hotkey: true
};

describe("render", () => {
  it("base", () => {
    const div = document.createElement("div");
    const player = new MediaPlayer({
      el: div,
      ...playerOptions
    });
    expect(div.querySelector(".player-video")).toBeTruthy();
  });
});
