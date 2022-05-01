# 组件介绍

## 组件开发

所有的组件都必须是一个类，因为播放器内部是通过`new`的形式对组件进行初始化。并且需要通过继承`Component`基类来实现。我们来看一个最简单的组件实现

```typescript
const Component = Player.getComponent<TitleBarOptions>("Component");

class TitleBar extends Component {
  //   组件是否需要进行初始化，可选
  static shouldInit(options: PlayerConfig) {
    return !options.live;
  }

  constructor(
    player: Player,
    slotElement: HTMLElement,
    options: TitleBarOptions = {},
    parentComponent: any
  ) {
    super(player, slotElement, options, parentComponent);
    this.initDom(slotElement);
    this.initComponent();
  }

  private initDom(slotElement: HTMLElement) {
    const div = document.createElement("div");
    div.innerHTML = "hello";
    slotElement.appendChild(div);
  }

  //   可选
  destroy() {
    super.destroy();
  }
}
```

**shouldInit**

静态函数（可选），是用来控制组件是否需要进行初始化，优先级最高。详细可看下文`组件初始化`

**constructor**

组件在初始化的时候会接受到三个参数：

- `player`：播放器实例

- `slotElement`：父组件`DOM`元素

- `options`：初始化配置

- `parentComponent`：父组件实例

**destroy**

成员函数（可选），播放器在销毁的时候，会调用`destroy`来执行销毁操作。如果你需要自己实现`destroy`成员函数，请务必调用`super.destroy()`，否则可能会导致某些副作用代码无法被销毁

**注意事项**

- 此时的`player`播放器实例还没完全初始化完成，如果你需要使用到其他组件的功能，因为组件的初始化顺序的问题，可能你所需要的组件还没进行初始化，你可以等待播放器初始化完成或者监听`afterComponentSetup`钩子函数，然后在使用其他组件的功能

- 你需要在自定义组件初始化完成之后，调用`this.triggerReady()`方法。如果没有进行调用，会导致注册在该组件下面的子组件无法被初始化

## 注册组件

注册组件的代码示例如下：

```typescript
Player.registerComponent("TitleBar", TitleBar, options);
```

**options 参数格式**

| 参数            | 说明                                                               | 类型    | 可选值 | 默认值 |
| --------------- | ------------------------------------------------------------------ | ------- | ------ | ------ |
| init            | 是否默认进行初始化，有优先级                                       | boolean | —      | —      |
| level           | 初始化优先级，数字越大，优先级越高                                 | number  | —      | —      |
| parentComponent | 父组件，当指定父组件后，该组件将会在父组件初始化完成之后进行初始化 | string  | —      | —      |
| defaults        | 默认配置参数                                                       | Object  | —      | —      |

## 组件的初始化

有三个地方可以控制组件是否需要进行初始化，分别如下：

**组件静态函数`shouldInit`：**

```typescript
class TitleBar extends Component {
  static shouldInit(options: PlayerConfig) {
    return !options.live;
  }
}
```

这种用法适用于通过播放器初始化配置来对组件的初始化进行动态的控制

**注册组件的`init`选项：**

```javascript
Player.registerComponent("TitleBar", TitleBar, { init: true });
```

这种方法可以对组件进行默认初始化

**初始化配置选项：**

```javascript
const player = new Player({
  components: {
    TitleBar: true
  }
});
```

这种方式适用于用户手动控制组件是否需要进行初始化。如果需要给组件传递参数，此时需要填写的是一个`JSON`对象，而不是一个`boolean`类型

以上三种控制组件是否需要进行初始化的方式从高到低的优先级如下：

`shouldInit` -> `配置选项` -> `init`

## 组件初始化顺序

默认情况下，组件的初始化顺序是按照组件的注册先后顺序来进行的。组件的初始化顺序可能会影响到`UI`的排版，先初始化的组件`UI`在前，后初始化的`UI`在后。如果你想调整组件的初始化顺序，可以在注册组件的时候使用`level`选项来调整，值越大的就会被优先初始化。

```typescript
Player.registerComponent("TitleBar", TitleBar, {
  // 调整初始化顺序
  level: 10
});
```

## 传递参数

如果你想在组件初始化的时候传递一些参数。你可以在注册组件的时候通过`defaults`选项给组件提供默认的参数。或者在初始化配置中传入一个`JSON`对象。组件初始化的时候，会将默认参数和初始化配置中的参数进行合并，传递给组件进行初始化。

```typescript
Player.registerComponent("TitleBar", TitleBar, {
  // 提供默认的参数
  defaults: {
    age: 14
  }
});
```

```typescript
const player = new Player({
  components: {
    TitleBar: {
      name: "张三"
    }
  }
});
```

最终传入到组件中的参数是：

```json
{
  "age": 14,
  "name": "张三"
}
```

## 钩子函数

播放器提供了`beforeComponentSetup`，`afterComponentSetup`，`beforeComponentDestroy`，`afterComponentDestroy`四个钩子函数来让外部知道组件是何时进行初始化的，何时进行销毁的。

对于某些组件需要依赖于其他的组件的时候，可以通过这些个钩子函数来得知所依赖的组件的初始化和销毁时机，从而执行某些任务

使用如下方法进行监听：

```typescript
player.$on("beforeComponentSetup", ({ name }: { name: string }) => {
  console.log("beforeComponentSetup", name);
});
```

| 事件名称               | 说明               | 回调参数                              |
| ---------------------- | ------------------ | ------------------------------------- |
| beforeComponentSetup   | 组件开始初始化前   | { name: string }                      |
| afterComponentSetup    | 组件初始化完成之后 | { name: string,component: Component } |
| beforeComponentDestroy | 组件开始销毁前     | { name: string,component: Component } |
| afterComponentDestroy  | 组件销毁完成之后   | { name: string }                      |

- `name`：组件的名称，使用注册的时候的名称

- `component`：组件的实例

## 其他

**获取组件**

所有的组件获取都是通过`Player.getComponent`静态函数获取的

```typescript
const Component = Player.getComponent("Component");
```

**移除组件**

所有的组件移除都是通过`Player.removeComponent`静态函数移除的

```typescript
Player.removeComponent("VideoTip");
```
