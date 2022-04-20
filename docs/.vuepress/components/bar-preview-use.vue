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
        Preview: {
          barPreviewUrl: "/images/screenshot.png"
        }
      }
    });
  }
};
</script>

<style>
.preview-image {
  max-width: unset !important;
}
</style>
