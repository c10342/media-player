# 架构设计

本章节将介绍播放器的整体架构设计。通过了解播放器的整体架构设计将有助于你对播放器进行二次开发或者开发组件、插件等定制化需求

## 初始化流程

播放器整个初始化流程是通过`Promise`将插件、组件、钩子函数等初始化串联起来的，所以整个初始化过程是异步的。如果你需要访问插件/组件实例，或者插件/组件提供的功能，你可以在`player.ready(()=>{})`函数的回调函数中访问或者使用。

整个初始化流程如下：

![初始化流程](/images/init.png)

**执行 beforeSetup 钩子函数**

`beforeSetup`钩子函数是通过`Player.registerHook`进行注册的，代码如下:

```javascript
Player.registerHook("beforeSetup", (options) => {
  return options;
});
```

在钩子函数中，你可以获取得到用户所设置的配置，并且可以修改用户的配置。你需要返回一个`options`，返回的`options`将会跟默认的配置进行合并，生成一个新的`options`，这个新的`options`将会作为播放器的初始化配置。

如果钩子函数中包含了异步的操作，你需要返回一个`Promise`的实例，代码如下：

```javascript
Player.registerHook("beforeSetup", (options) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(options);
    }, 1000);
  });
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

**初始化 Tech**

这个阶段将会对 Tech 进行初始化。关于对 Tech 的介绍，详情可查看[Tech章节](/techs/guide/)

**执行 afterSetup 钩子函数**

`afterSetup`钩子函数是通过`Player.registerHook`进行注册的，代码如下:

```javascript
Player.registerHook("afterSetup", (player) => {
  return player;
});
```

在钩子函数中，你可以获取到播放器的实例，此时的播放器已经完全初始化完毕了。你需要返回一个播放器的实例，否则后面注册的钩子函数将获取不到播放器的实例

如果钩子函数中包含了异步的操作，你需要返回一个`Promise`的实例，代码如下：

```javascript
Player.registerHook("afterSetup", (player) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(player);
    }, 1000);
  });
});
```

## 销毁流程

![销毁流程](/images/destroy.png)

## 播放器组成

![销毁流程](/images/framework.png)
