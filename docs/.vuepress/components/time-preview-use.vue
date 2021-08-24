<template>
  <demo-player ref="demoPlayer" />
</template>

<script>
import DemoPlayer from "./demo-player.vue";
import Preview from "@lin-media/preview";

const previewList = [
  {
    time: 20,
    url: "/images/preview-20.png"
  },
  {
    time: 40,
    url: "/images/preview-40.png"
  },
  {
    time: 60,
    url: "/images/preview-60.png"
  }
];

export default {
  components: { DemoPlayer },
  mounted() {
    this.$refs.demoPlayer.initPlayer({
      previewOptions: {
        // 通过参数传入或者通过setPreview方法设置
        list: previewList
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
