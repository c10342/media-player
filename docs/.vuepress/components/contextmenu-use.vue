<template>
  <demo-player ref="demoPlayer" @init-success="onInitSuccess" />
</template>

<script>
import DemoPlayer from "./demo-player.vue";

export default {
  components: { DemoPlayer },
  created() {
    this.player = null;
    this.contextMenuList = [
      {
        label: "播放",
        desc: "描述信息",
        type: "MenuItem",
        callback: () => {
          this.player.play();
        },
        eventName: "click-play"
      },
      {
        label: "暂停",
        type: "MenuItem",
        callback: () => {
          this.player.pause();
        }
      },
      {
        label: "播放/暂停",
        type: "MenuItem",
        callback: () => {
          this.player.toggle();
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
              this.player.setSpeed(0.5);
            }
          },
          {
            label: "1x",
            callback: () => {
              this.player.setSpeed(1);
            }
          },
          {
            label: "1.5x",
            callback: () => {
              this.player.setSpeed(1.5);
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
              this.player.switchDefinition(0);
            }
          },
          {
            label: "高清",
            callback: () => {
              this.player.switchDefinition(1);
            }
          }
        ]
      }
    ];
  },
  mounted() {
    this.$refs.demoPlayer.initPlayer({
      components: {
        Contextmenu: {
          menuList: this.contextMenuList,
          // 一级菜单宽度
          menuItemWidth: "200px",
          // 二级菜单宽度
          subMenuItemWidth: "100px"
        }
      }
    });
  },
  methods: {
    onInitSuccess(player) {
      this.player = player;
    }
  }
};
</script>
