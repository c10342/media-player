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
- build    打包构建
- docs     官网和文档
- examples 本地开发测试demo
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
- scripts  文档上传等脚本
- tests    单元测试相关
- types    全局类型声明文件
```

## 脚本

提交代码：

```bash
npm run commit
```

运行本地开发测试demo：

```bash
npm run dev
```

打包构建：

```bash
npm run build
```

ts代码检查：

```bash
npm run lint-fix
```

css代码检查：

```bash
npm run lint:style-fix
```

运行文档：

```bash
npm run docs:dev
```

打包文档：

```bash
npm run docs:build
```

运行单元测试

```bash
npm run test
```

## 包名与文件夹名称

为了方便`webpack`找到包的入口文件，我们对包名跟文件夹名称做出如下约定：

- 包名必须以`@lin-media/`开头

- 文件夹名称取`@lin-media/$1`中`$1`的名称。比如包名叫`@lin-media/demo`，那么文件夹名称就必须叫`demo`

## 代码结构

每个子项目的目录结构如下：

- demo
    |
    |- index.ts        子项目的入口文件，必选
    |- package.json    package.json文件，必选
    |- README.md       说明文件，可选
    |- \_\_tests\_\_       存放单元测试用例，可选
    |

## 测试

单元测试文件都要分别存放在每个子项目的 `__tests__` 文件夹下，测试文件后缀名是 `.test.ts`。

目前测试代码并不多，后续慢慢补上✊。

## 文档

如果要编写文档，请运行：

```bash
npm run docs:dev
```

文档在 `docs` 文件夹

更多请参考 [官方文档](http://player.linjiafu.top)。
