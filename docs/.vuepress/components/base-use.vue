<template>
  <demo-player ref="demoPlayer" />
</template>

<script>
import DemoPlayer from "./demo-player.vue";
export default {
  components: { DemoPlayer },
  mounted() {
    this.$refs.demoPlayer.initPlayer()
  }
};
</script>
