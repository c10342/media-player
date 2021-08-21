module.exports = {
  title: "MediaPlayer",
  description: "欢迎使用 MediaPlayer",
  plugins: {
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
    // ['link', { rel: 'icon', href: `/logo.png` }],
    // ['script', { src: 'https://cdn.jsdelivr.net/npm/flv.js/dist/flv.min.js' }],
    // ['script', { src: 'https://cdn.jsdelivr.net/npm/hls.js/dist/hls.min.js' }],
    // ['script', { src: 'https://cdn.jsdelivr.net/npm/dashjs/dist/dash.all.min.js' }],
    // ['script', { src: 'https://cdn.jsdelivr.net/webtorrent/latest/webtorrent.min.js' }],
    // ['script', { src: 'https://cdn.jsdelivr.net/npm/dplayer/dist/DPlayer.min.js' }],
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
        text: '插件',
        items: [
          { text: '弹幕', link: '/danmaku/' },
          { text: '自定义进度条提示点', link: '/highlight/' },
          { text: '视频缩略图预览', link: '/preview/' },
          { text: '截图', link: '/screenshot/' },
          { text: '缩放', link: '/zoom/' },
        ]
      }
    ],
    sidebarDepth: 2,
    sidebar: 'auto',
    // sidebar: [
    //   {
    //     title: "指南",
    //     collapsable: false,
    //     children: ["/guide/"]
    //   }
    // ]
  }
};
