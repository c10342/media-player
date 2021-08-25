<template>
  <demo-player ref="demoPlayer" />
</template>

<script>
import DemoPlayer from "./demo-player.vue";
import Zoom from "@lin-media/zoom";
export default {
  components: { DemoPlayer },
  mounted() {
    this.$refs.demoPlayer.initPlayer({
      Zoom: {
        // 最大缩放宽度
        minWidth: 400,
        // 最大缩放高度
        minHeight: 200
      },
      plugins: [Zoom]
    });
  }
};
</script>


<style>
.zoom-relative {
  position: absolute;
}
</style>