<template>
  <demo-player ref="demoPlayer" />
</template>

<script>
import DemoPlayer from "./demo-player.vue";
export default {
  components: { DemoPlayer },
  mounted() {
    this.$refs.demoPlayer.initPlayer({
      components: {
        Zoom: {
          // 最大缩放宽度
          minWidth: 400,
          // 最大缩放高度
          minHeight: 200
        }
      }
    });
  }
};
</script>


<style>
.zoom-relative {
  position: absolute;
}
</style>