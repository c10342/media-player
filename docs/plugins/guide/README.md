# 插件介绍

## 示例

所有的插件都必须是一个类，因为播放器内部是通过`new`的形式对插件进行初始化。并且需要通过继承`Plugin`基类来实现。我们来看一个最简单的插件实现

```javascript
const Plugin = Player.getPlugin<DomResizeObserverOptions>("Plugin");

class DomResizeObserver extends Plugin {
      //   插件是否需要进行初始化，可选
  static shouldInit(options: PlayerConfig) {
    return true
  }
  private resizeObserver: ResizeObserver | null;

// 等待播放器初始化完毕
  onPlayerReady() {
    this.initDomResizeObserver();
    this.triggerReady();
  }

  private initDomResizeObserver() {
    if (!isUndef(ResizeObserver)) {
      this.resizeObserver = new ResizeObserver(
        debounce((entries: ResizeObserverEntry[]) => {
          this.player.$emit(PlayerEvents.RESIZE, entries);
        }, 500)
      );
      this.resizeObserver.observe(this.player.rootElement);
    }
  }

  destroy() {
    this.resizeObserver?.disconnect();
    super.destroy();
  }
}

```

**shouldInit**

静态函数（可选），是用来控制插件是否需要进行初始化，优先级最高。详细可看下文`插件初始化`

**constructor**

插件在初始化的时候会接受到两个参数：

- `player`：播放器实例

- `options`：初始化配置

**destroy**

成员函数（可选），播放器在销毁的时候，会调用`destroy`来执行销毁操作。如果你需要自己实现`destroy`成员函数，请务必调用`super.destroy()`，否则可能会导致某些副作用代码无法被销毁

**onPlayerReady**

成员函数（可选），播放器实例初始化完毕就会调用该函数

**注意事项**

- 此时的`player`播放器实例还没完全初始化完成，如果你需要使用到其他组件/插件的功能，因为组件/插件的初始化顺序的问题，可能你所需要的组件/插件还没进行初始化，你可以等待播放器初始化完成，然后在使用其他组件/插件的功能

::: warning 警告
在插件初始化完毕之后，必须调用`this.triggerReady()`方法
:::

## 注册

注册插件的方式如下：

```typescript
Player.registerPlugin("DomResizeObserver", DomResizeObserver, options);
```

**options 参数格式**

| 参数     | 说明                         | 类型    | 可选值 | 默认值 |
| -------- | ---------------------------- | ------- | ------ | ------ |
| init     | 是否默认进行初始化，有优先级 | boolean | —      | —      |
| defaults | 默认配置参数                 | Object  | —      | —      |

## 初始化

有三个地方可以控制插件是否需要进行初始化，分别如下：

插件静态函数`shouldInit`：

```typescript
class DomResizeObserver extends Plugin {
  static shouldInit(options: PlayerConfig) {
    return true;
  }
}
```

这种用法适用于通过播放器初始化配置来对插件的初始化进行动态的控制

注册插件的`init`选项：

```javascript
Player.registerComponent("DomResizeObserver", DomResizeObserver, {
  init: true
});
```

这种方法可以对插件进行默认初始化

初始化配置选项：

```javascript
const player = new Player({
  plugins: {
    DomResizeObserver: true
  }
});
```

这种方式适用于用户手动控制插件是否需要进行初始化。如果需要给插件传递参数，此时需要填写的是一个`JSON`对象，而不是一个`boolean`类型

以上三种控制插件是否需要进行初始化的方式从高到低的优先级如下：

`shouldInit` -> `配置选项` -> `init`

## 传递参数

如果你想在插件初始化的时候传递一些参数。你可以在注册插件的时候通过`defaults`选项给插件提供默认的参数。或者在初始化配置中传入一个`JSON`对象。插件初始化的时候，会将默认参数和初始化配置中的参数进行合并，传递给插件进行初始化。

```typescript
Player.registerComponent("DomResizeObserver", DomResizeObserver, {
  // 提供默认的参数
  defaults: {
    age: 14
  }
});
```

```typescript
const player = new Player({
  plugins: {
    DomResizeObserver: {
      name: "张三"
    }
  }
});
```

最终传入到插件中的参数是：

```json
{
  "age": 14,
  "name": "张三"
}
```

## 其他

**获取插件**

所有的插件获取都是通过`Player.getPlugin`静态函数获取的

```typescript
const Plugin = Player.getPlugin("Plugin");
```

**移除插件**

所有的插件移除都是通过`Player.removePlugin`静态函数移除的

```typescript
Player.removePlugin("DomResizeObserver");
```
