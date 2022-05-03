# 架构设计

本章节将介绍播放器的整体架构设计。通过了解播放器的整体架构设计将有助于你对播放器进行二次开发或者开发组件、插件等定制化需求

## 初始化流程

播放器参考了`express`的中间件模型，通过中间件的形式将插件、组件、钩子函数、Tech 等初始化串联起来的。整个播放器初始化流程可能同步的，也可能是异步的，这取决于你的操作。如果你的操作中包含了异步操作，那么整个流程就是异步的，此时如果你需要使用播放器实例上面的功能，你需要在`player.ready(()=>{})`函数的回调函数中进行使用。

整个初始化流程如下：

![初始化流程](/images/init.png)

**执行 beforeSetup 钩子函数**

`beforeSetup`钩子函数是通过`Player.registerHook`进行注册的，代码如下:

```javascript
Player.registerHook("beforeSetup", (options, next) => {
  next(options);
});
```

在钩子函数中，你可以获得两个参数：

- `options`：用户所设置的初始化配置

- `next`：在钩子函数执行结束之后，必须调用`next`函数，并且把修改过后的`options`初始化配置回传回去，否则，将无法进行下一步的初始化

如果钩子函数中包含了异步的操作，你可以这样子：

```javascript
Player.registerHook("beforeSetup", (options, next) => {
  setTimeout(() => {
    next(options);
  }, 1000);
});
```

虽然钩子函数中可以进行异步操作，但是不建议进行耗时的异步操作，因为这样子会使整个播放器初始化完成时间变长

**合并配置**

这个阶段将会把用户配置跟默认的配置进行合并，形成一个新的配置，并挂载到播放器实例中

**初始化国际化语言包**

这个阶段将会根据初始化配置对语言包进行性初始化，目前支持中文和英文，当然你也可以进行自定义

**初始化插件**

这个阶段将会对插件进行初始化。关于对插件的介绍，详情可查看[插件章节](/plugins/guide/)

**初始化 DOM 容器**

这个阶段主要做的是生成一个 `DOM` 容器，并插入到用户指定的节点当中。这个阶段的目的是提供一些插槽给组件插入 `DOM` 节点

**初始化组件**

这个阶段将会对组件进行初始化。关于对组件的介绍，详情可查看[组件章节](/components/guide/)

**执行 source 资源中间件**

`source`资源中间件是通过如下方式进行注册的：

```javascript
VideoPlayer.useSource("video/mp4", (source, next) => {
  next(source);
});
```

如果播放的视频`type`类型是`video/mp4`，就会执行该中间件。

在函数中，你可以获得两个参数:

- `source`：将要播放的视频信息

- `next`：在函数执行结束之后，必须调用`next`函数，并且把`source`视频信息回传回去，否则，将无法执行下一步的操作

如果钩子函数中包含了异步的操作，你可以这样子：

```javascript
VideoPlayer.useSource("video/mp4", (source, next) => {
  setTimeout(() => {
    next(source);
  }, 1000);
});
```

**初始化 Tech**

这个阶段将会对 Tech 进行初始化。关于对 Tech 的介绍，详情可查看[Tech 章节](/techs/guide/)

**执行 afterSetup 钩子函数**

`afterSetup`钩子函数是通过`Player.registerHook`进行注册的，代码如下:

```javascript
Player.registerHook("afterSetup", (player, next) => {
  next(player);
});
```

在钩子函数中，你可以获得两个参数：

- `player`：播放器实例，此时的播放器实例已经完全初始化完毕了

- `next`：在钩子函数执行结束之后，必须调用`next`函数，并且把`player`播放器实例回传回去，否则，将无法执行下一个中间件

如果钩子函数中包含了异步的操作，你可以这样子：

```javascript
Player.registerHook("afterSetup", (player, next) => {
  setTimeout(() => {
    next(player);
  }, 1000);
});
```

## 销毁流程

![销毁流程](/images/destroy.png)

## 播放器组成

![销毁流程](/images/framework.png)
