# 参与贡献

首先非常感谢您能为项目做出贡献

## 拉取代码

从 main 分支拉取代码，然后再合并到 main 分支即可。

## 本地开发测试

首先安装依赖：

```bash
npm i
```

运行开发测试demo

```bash
npm run dev
```

项目是 `monorepo（多包）` 的形式，由 `typescript` 和 `scss` 编写，`eslint` 和 `stylelint` 控制代码风格，`jest`运行测试，`webpack` 打包。

## 项目结构

```
- .vscode  eslint等插件配置
- examples 本地开发测试demo
    |
    |- danmaku.ts 弹幕插件
    |- index.html html模板
    |- index.scss 样式
    |- index.ts   入口文件
    |
- packages 播放器和插件源码
    |
    |- contextmenu  右键菜单插件
    |- danmaku      弹幕插件
    |- highlight    自定义进度条提示点插件
    |- player       播放器
    |- preview      预览插件
    |- screenshot   截图插件
    |- utils        通用方法
    |- zoom         缩放插件
    |
- types    全局类型声明文件
- scripts  文档上传等脚本
- docs     官网和文档
- build    打包构建
```

## 脚本



## 别名

```typescript
import MediaPlayer from '@lin-media/player'
```

其他项目比较简单所以没有别名，请使用相对路径导入。

## 代码结构

每个项目都有 `src` 文件夹和其中的入口文件 `index.ts`。其他代码则在 `ts` 目录下，css 在 `scss` 目录下（本来想 css 跟着组件拆分，在一个目录，但是现在样式并不多所以直接完全拆开了）。

项目中除了入口文件，其他文件都不用 `export default`，因为这样可以让你不用手动写导入代码，你只需要写相关变量名 vscode 就会自动提示，回车就可以自动导入，或者用 vscode 自动修复功能里面的自动导入。

## 测试

测试文件都在项目代码下的 `__tests__` 文件夹，测试文件名后缀是 `.test.ts`。

目前测试代码并不多，后续慢慢补上✊。

## 文档 & 官网

MediaPlayer 使用的是 [Docusaurus](http://player.linjiafu.top)。

如果要编写文档或修改官网，请进入到 `website` 文件夹，运行：

```bash
yarn
```

安装依赖。

然后运行：

```bash
yarn start
```

启动本地开发，它会自动打开 [http://localhost:3000/](http://localhost:3000/)。

文档在 `docs` 文件夹，官网在 `src` 文件夹。

更多请参考 [Docusaurus 官方文档](http://player.linjiafu.top)。
