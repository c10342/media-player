const inputElement = document.querySelector(".input") as HTMLInputElement;
const buttonElement = document.querySelector(".send-button");
const moreElement = document.querySelector(".more-button");
const pauseElement = document.querySelector(".pause-button");
const playElement = document.querySelector(".play-button");

const messages = [
  "坚决同时打赢疫情防控和经济社会发展“两大战役”",
  "国际社会高度评价中国为全球抗疫作出贡献",
  "五粮液斥资25亿跨界造车，车标似酒杯售价不超8万",
  "蔚来中国项目完成注资，今年已累计完成超百亿融资",
  "老iPhone降速 苹果同意赔偿美国用户最多5亿美元",
  '四门轿跑设计 比亚迪旗舰车"汉"车长近5米',
  "虎牙创始人古丰加盟，百度直播跃进",
  "印度宣布禁用59款中国应用，包括TikTok和微信",
  "特斯拉德国厂三月底动工 马斯克将出席奠基仪式",
  "特斯拉车主反映，中国本土制造生产的特斯拉Model3采用的控制器硬件代码与实际的环保信息随车清单不一致",
  '特斯拉电池缺陷被曝隐瞒8年!品控问题"埋下"隐患',
  "一颗小行星预计5月初飞掠地球 735万千米外与地球交会",
  "比特币挖矿耗电惊人：每年耗电量等于智利全国耗电量",
  "广州又出台新政刺激车市复苏，新能源车可获1万元补贴",
  "《哥斯拉大战金刚》试映会好评不断！",
  "《神奇女侠1984》编剧确认：《神奇女侠3》故事线将设定于现代",
  "教育部：全国义务教育阶段辍学人数下降近99%",
  "哈哈哈哈哈",
  "呵呵呵",
  "嘻嘻"
];

export default function DanmukuTest(player: any) {
  inputElement?.addEventListener("keyup", (event: KeyboardEvent) => {
    if (event.keyCode === 13) {
      sendDanmu();
    }
  });

  buttonElement?.addEventListener("click", () => {
    sendDanmu();
  });

  playElement?.addEventListener("click", () => {
    player.play();
  });

  pauseElement?.addEventListener("click", () => {
    console.log(111);

    player.pause();
  });

  function getRandomItem(list: any) {
    const index = Math.floor(Math.random() * list.length);
    return list[index];
  }

  moreElement?.addEventListener("click", () => {
    const message = [];
    for (let i = 0; i < 500; i++) {
      // danmaku.add({
      //   text: messages[parseInt(Math.random() * messages.length)],
      //   fontSize: Math.floor(Math.random() * 20) + 20,
      // });
      // danmaku.add(messages[parseInt(Math.random() * messages.length)]);
      message.push({
        text: getRandomItem(messages)
      });
    }
    player.send(message);
  });

  function sendDanmu() {
    if (!inputElement?.value) {
      return;
    }
    player.send({
      text: inputElement.value
    });
  }
}
