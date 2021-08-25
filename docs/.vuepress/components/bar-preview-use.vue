<template>
  <demo-player ref="demoPlayer" />
</template>

<script>
import DemoPlayer from "./demo-player.vue";
import Preview from "@lin-media/preview";


export default {
  components: { DemoPlayer },
  mounted() {
    this.$refs.demoPlayer.initPlayer({
      Preview: {
        barPreviewUrl:'/images/screenshot.png'
      },
      plugins: [Preview]
    });
  }
};
</script>

<style>
.preview-image {
  max-width: unset !important;
}
</style>
