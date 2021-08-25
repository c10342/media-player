<template>
  <demo-player ref="demoPlayer" />
</template>

<script>
import DemoPlayer from "./demo-player.vue";
import Contextmenu from "@lin-media/contextmenu";

const contextMenuList = [
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

export default {
  components: { DemoPlayer },
  mounted() {
    this.$refs.demoPlayer.initPlayer({
      Contextmenu: {
        // 一级菜单宽度
        meunItemWidth: "300px",
        // 二级菜单宽度
        subMenuItemWidth: "100px"
      },
      plugins: [Contextmenu]
    });
  }
};
</script>
