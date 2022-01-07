<template>
  <div class="demo-player-container">
    <div class="demo-player-wrapper" ref="wrapper"></div>
  </div>
</template>

<script>
import MediaPlayer from "@lin-media/player";
const playerOptions = {
  videoList: [
    {
      label: "标清",
      url: "/test.mp4"
    },
    {
      label: "高清",
      url: "/test.mp4"
    }
  ],
  speedList: [
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
  ]
};
export default {
  created() {
    this.player = null;
  },
  methods: {
    initPlayer(options = {}) {
      this.destroyPlayer();
      this.player = new MediaPlayer({
        el: this.$refs.wrapper,
        ...playerOptions,
        ...options
      });
      this.$emit("init-success", this.player);
      return this.player
    },
    destroyPlayer() {
      if (this.player) {
        this.player.destroy();
        this.player = null;
      }
    }
  },
  beforeDestroy() {
    this.destroyPlayer();
  }
};
</script>

<style>
</style>
