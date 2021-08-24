<template>
  <demo-player ref="demoPlayer" />
</template>

<script>
import DemoPlayer from "./demo-player.vue";
import Screenshot from "@lin-media/screenshot";
export default {
  components: { DemoPlayer },
  mounted() {
    this.$refs.demoPlayer.initPlayer({
      plugins: [Screenshot]
    });
  }
};
</script>

<style>
</style>
