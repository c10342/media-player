<template>
  <demo-player ref="demoPlayer" />
</template>

<script>
import DemoPlayer from "./demo-player.vue";
import Highlight from "@lin-media/highlight";

const highlightList = [
  {
    time: 5,
    text: "这是第 5 秒"
  },
  {
    time: 10,
    text: "这是第 10 秒"
  },
  {
    time: 15,
    text: "这是第 15 秒"
  },
  {
    time: 20,
    text: "这是第 20 秒"
  },
  {
    time: 25,
    text: "这是第 25 秒"
  }
];

export default {
  components: { DemoPlayer },
  mounted() {
    this.$refs.demoPlayer.initPlayer({
      Highlight: {
        list: highlightList
      },
      plugins: [Highlight]
    });
  }
};
</script>

<style>
</style>
