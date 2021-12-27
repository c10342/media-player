<template>
  <div class="danmaku-player-wrapper">
    <demo-player ref="demoPlayer" @init-success="onInitSuccess" />
    <div class="operation-wrapper">
      <input
        class="input"
        type="text"
        v-model.trim="content"
        @keyup.enter="onSend"
      />
      <button class="button" @click="onSend">发送弹幕</button>
      <button class="button" @click="moreDanmaku">海量弹幕</button>
    </div>
  </div>
</template>

<script>
import DemoPlayer from "./demo-player.vue";
import Danmaku from "@lin-media/danmaku";

const messages = [
  "你可以通过下面的参数来自定义你的播放器具体需要什么功能",
  "npm i @lin-media/player",
  "我们先初始化一个最简单的播放器",
  "一个简单的MediaPlayer实例已经初始化完成了，它已经具有一些基本的功能了",
  "你可以把MediaPlayer用在直播中，你只需要把live参数设置为true即可",
  "播放器提供了了插件功能，可自己定制一些需求，比如自定义进度条提示点，截图，弹幕等等",
  "插件分为全局插件和局部插件，使用全局插件时，每个播放器实例都会具备全局插件的功能。使用局部插件时，只有当前播放器实例才会存在局部插件的功能",
  "全局插件是通过MediaPlayer.use(ctor: Function)进行注册的",
  "局部插件是通过 options 参数中的plugins字段进行注册的",
  "每一个插件都需要是一个构造器函数（类）",
  "由于浏览器的策略问题，很多时候就算我们设置了autoplay属性也无法实现自动播放的",
  "浏览器是不允许有声音的视频进行自动播放的，但是允许静音的视频进行播放的",
  "设置了autoplay属性，然后通过监听canplaythrough事件，手动去播放，这样子是不能实现自动播放的",
  "你可以通过 customType 参数与任何 MSE 库一起使用",
  "自定义语言包，会跟默认的语言包进行合并",
  "视频是否处于暂停状态",
  "切换视频播放状态，播放/暂停",
  "hello world",
  "你好世界",
  "嘻嘻",
  "生活就像海洋，只有我才能到达彼岸"
];
function getRandomItem(list) {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

export default {
  components: { DemoPlayer },
  data() {
    return {
      content: ""
    };
  },
  mounted() {
    this.$refs.demoPlayer.initPlayer({
      Danmaku: {
        fontColors: ["blue", "red", "green", "purple", "yellow"],
        fontSizes: [16, 18, 20, 22, 24, 26, 28],
        speedArg: 0.009
      },
      plugins: [Danmaku]
    });
    window.addEventListener('resize',this.onResize)
  },
  methods: {
    onResize(){
      this.player.danmaku.resize()
    },
    onInitSuccess(player) {
      this.player = player;
    },
    onSend() {
      if (!this.content || !this.player) {
        return;
      }
      this.player.danmaku.send({
        text: this.content
      });
      this.content = "";
    },
    moreDanmaku() {
      if (!this.player) {
        return;
      }
      const message = [];
      for (let i = 0; i < 500; i++) {
        message.push({
          text: getRandomItem(messages)
        });
      }
      this.player.danmaku.send(message);
    }
  },
  beforeDestroy(){
    window.removeEventListener('resize',this.onResize)
  }
};
</script>

<style lang="scss" scoped>
.danmaku-player-wrapper {
  .operation-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
  }

  .button {
    box-sizing: border-box;
    display: inline-block;
    height: 32px;
    padding: 0 15px;
    margin-left: 10px;
    font-size: 12px;
    font-weight: 500;
    line-height: 32px;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    background-color: #3eaf7c;
    border: none;
    border-radius: 3px;
    outline: none;
    transition: 0.1s;
    appearance: none;

    &:hover {
      background-color: lighten(#3eaf7c, 5%);
    }
  }

  .input {
    box-sizing: border-box;
    display: inline-block;
    flex: 1;
    height: 32px;
    padding: 0 15px;
    line-height: 32px;
    color: #606266;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    appearance: none;

    &:focus {
      border-color: #3eaf7c;
    }
  }
}
</style>
