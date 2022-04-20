const path = require("path");

module.exports = {
  title: "MediaPlayer",
  description: "一个插件化的H5视频播放器",
  plugins: {
    "vuepress-plugin-typescript": {
      tsLoaderOptions: {
        configFile: path.resolve(__dirname, "../../tsconfig.json"),
        compilerOptions: {
          composite: true
        }
      }
    },
    "@vuepress/back-to-top": true,
    "@vuepress/pwa": {
      serviceWorker: true,
      updatePopup: {
        "/": {
          message: "发现新内容可用",
          buttonText: "刷新"
        }
      }
    }
  },
  head: [
    // ['link', { rel: 'icon', href: `/logo.png` }]
  ],
  themeConfig: {
    repo: "c10342/media-player",
    editLinks: true,
    docsDir: "docs",
    editLinkText: "帮助我们改善此页面！",
    nav: [
      { text: "首页", link: "/" },
      { text: "指南", link: "/player/" },
      { text: "架构设计", link: "/framework/" },
      {
        text: "组件",
        items: [
          { text: "介绍", link: "/components/guide/" },
          { text: "内置组件", link: "/components/built-in/" },
          { text: "弹幕", link: "/components/danmaku/" },
          { text: "截图", link: "/components/screenshot/" },
          { text: "缩放", link: "/components/zoom/" },
          { text: "右键菜单", link: "/components/contextmenu/" },
          { text: "视频缩略图预览", link: "/components/preview/" },
          { text: "自定义进度条提示点", link: "components//highlight/" }
        ]
      },
      {
        text: "插件",
        items: [
          { text: "介绍", link: "/plugins/guide/" },
          { text: "内置组件", link: "/plugins/built-in/" }
        ]
      },
      { text: "生态", link: "/ecology/" },
      {
        text: "其他",
        items: [
          { text: "vue2组件库", link: "http://ui.linjiafu.top/" },
          { text: "axios源码解析", link: "http://axios.linjiafu.top/" },
          { text: "微信小程序组件库", link: "http://wxui.linjiafu.top/" }
        ]
      },
      {
        text: "更新日志",
        items: [
          { text: "播放器", link: "/logs/player" },
          { text: "弹幕", link: "/logs/danmaku" },
          { text: "截图", link: "/logs/screenshot" },
          { text: "缩放", link: "/logs/zoom" },
          { text: "右键菜单", link: "/logs/contextmenu" },
          { text: "视频缩略图预览", link: "/logs/preview" },
          { text: "自定义进度条提示点", link: "/logs/highlight" }
        ]
      }
    ],
    sidebarDepth: 2,
    sidebar: "auto"
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@lin-media": path.resolve(__dirname, "../../packages")
      },
      mainFields: ["doc", "main"]
    }
  }
};
