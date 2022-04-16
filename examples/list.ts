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

export function getContextMenuList() {
  return [
    {
      label: "播放",
      desc: "描述信息",
      type: "MenuItem",
      callback() {
        (this as any).play();
      },
      eventName: "click-play"
    },
    {
      label: "暂停",
      type: "MenuItem",
      callback() {
        (this as any).pause();
      }
    },
    {
      label: "播放/暂停",
      type: "MenuItem",
      callback() {
        (this as any).toggle();
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
          callback() {
            (this as any).setSpeed(0.5);
          }
        },
        {
          label: "1x",
          callback() {
            (this as any).setSpeed(1);
          }
        },
        {
          label: "1.5x",
          callback() {
            (this as any).setSpeed(1.5);
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
          callback() {
            (this as any).switchDefinition(0);
          }
        },
        {
          label: "高清",
          callback() {
            (this as any).switchDefinition(1);
          }
        }
      ]
    }
  ];
}
