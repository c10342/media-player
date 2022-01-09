import MediaPlayer from "@lin-media/player";

export const highlightList = [
  {
    time: 0,
    text: "这是第 20 秒"
  },
  {
    time: 20,
    text: "这是第 20 秒"
  },
  {
    time: 60,
    text: "这是第 60 秒"
  },
  {
    time: 100,
    text: "这是第 100 秒"
  }
];

export const previewList = [
  {
    time: 40,
    url: "http://xxx/demo.png"
  },
  {
    time: 80,
    url: "http://xxx/demo.png"
  }
];

export const speedList = [
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

export function getContextMenuList(player: MediaPlayer) {
  return [
    {
      label: "播放",
      desc: "描述信息",
      type: "MenuItem",
      callback: () => {
        player.play();
      },
      eventName: "click-play"
    },
    {
      label: "暂停",
      type: "MenuItem",
      callback: () => {
        player.pause();
      }
    },
    {
      label: "播放/暂停",
      type: "MenuItem",
      callback: () => {
        player.toggle();
      }
    },
    {
      type: "MenuLine"
    },
    {
      type: "SubMenuItem",
      label: "倍数",
      subMenuList: [
        {
          label: "0.5x",
          callback: () => {
            player.setSpeed(0.5);
          }
        },
        {
          label: "1x",
          callback: () => {
            player.setSpeed(1);
          }
        },
        {
          label: "1.5x",
          callback: () => {
            player.setSpeed(1.5);
          }
        }
      ]
    },
    {
      type: "SubMenuItem",
      label: "清晰度",
      subMenuList: [
        {
          label: "标清",
          callback: () => {
            player.switchDefinition(0);
          }
        },
        {
          label: "高清",
          callback: () => {
            player.switchDefinition(1);
          }
        }
      ]
    }
  ];
}
