<template>
  <demo-player ref="demoPlayer" />
</template>

<script>
import DemoPlayer from "./demo-player.vue";
import Highlight from "@lin-media/highlight";

const highlightList = [
  {
    time: 10,
    text: "这是第 10 秒"
  },
  {
    time: 20,
    text: "这是第 20 秒"
  },
  {
    time: 30,
    text: "这是第 30 秒"
  },
  {
    time: 40,
    text: "这是第 40 秒"
  },
  {
    time: 50,
    text: "这是第 60 秒"
  },
  {
    time: 60,
    text: "这是第 60 秒"
  },
  {
    time: 70,
    text: "这是第 70 秒"
  },
];

export default {
  components: { DemoPlayer },
  mounted() {
    this.$refs.demoPlayer.initPlayer({
      highlightOptions: {
        list: highlightList
      },
      plugins: [Highlight]
    });
  }
};
</script>

<style>
</style>
