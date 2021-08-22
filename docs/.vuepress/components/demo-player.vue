<template>
  <div class="demo-player-container">
    <div class="demo-player-wrapper" ref="wrapper"></div>
  </div>
</template>

<script>
import MediaPlayer from "@media/player";
export default {
  props: {
    playerOptions: {
      type: Object
    }
  },
  watch: {
    playerOptions() {
      if (this.playerOptions && this.playerOptions.videoList) {
        this.initPlayer();
      }
    }
  },
  created() {
    this.player = null;
  },
  methods: {
    initPlayer() {
      this.destroyPlayer();
      this.player = new MediaPlayer({
        el: this.$refs.wrapper,
        ...this.playerOptions
      });
      this.$emit('init-success',this.player)
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
