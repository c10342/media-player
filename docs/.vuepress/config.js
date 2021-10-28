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
      { text: "指南", link: "/guide/" },
      {
        text: "插件",
        items: [
          { text: "弹幕", link: "/danmaku/" },
          { text: "截图", link: "/screenshot/" },
          { text: "缩放", link: "/zoom/" },
          { text: "右键菜单", link: "/contextmenu/" },
          { text: "视频缩略图预览", link: "/preview/" },
          { text: "自定义进度条提示点", link: "/highlight/" }
        ]
      },
      { text: "生态", link: "/ecology/" },
      {
        text: "组件库",
        items: [
          { text: "微信小程序", link: "http://wxui.linjiafu.top/" },
          { text: "vue2组件库", link: "http://ui.linjiafu.top/" }
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
    },
    module: {
      rules: [
        {
          test: /\.art$/,
          loader: "art-template-loader"
        }
      ]
    }
  }
};
