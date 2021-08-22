<template>
  <demo-player :playerOptions="playerOptions" />
</template>

<script>
import DemoPlayer from "./demo-player.vue";
export default {
  components: { DemoPlayer },
  data() {
    return {
      playerOptions: null
    };
  },
  mounted() {
    this.playerOptions = {
      videoList: [
        {
          label: "标清",
          url: "/demo.mp4"
        },
        {
          label: "高清",
          url: "/demo.mp4"
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
      ],
      hotkey: true,
      autoplay: true,
    //   muted: true
    };
  }
};
</script>

<style>
</style>
