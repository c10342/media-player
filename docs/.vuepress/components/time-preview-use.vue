<template>
  <demo-player ref="demoPlayer" />
</template>

<script>
import DemoPlayer from "./demo-player.vue";

const previewList = [
  {
    time: 5,
    url: "/images/preview-5.png"
  },
  {
    time: 10,
    url: "/images/preview-10.png"
  },
  {
    time: 15,
    url: "/images/preview-15.png"
  },
  {
    time: 20,
    url: "/images/preview-20.png"
  },
  {
    time: 25,
    url: "/images/preview-25.png"
  }
];

export default {
  components: { DemoPlayer },
  mounted() {
    this.$refs.demoPlayer.initPlayer({
      components: {
        Preview: {
          // 通过参数传入或者通过setPreview方法设置
          list: previewList
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
