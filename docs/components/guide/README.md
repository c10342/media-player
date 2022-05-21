# 组件介绍

## 示例

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
    this.triggerReady();
  }

  private initDom(slotElement: HTMLElement) {
    const div = document.createElement("div");
    div.innerHTML = "hello";
    slotElement.appendChild(div);
    this.rootElement = div;
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

**onPlayerReady**

成员函数（可选），播放器实例初始化完毕就会调用该函数

**destroy**

成员函数（可选），播放器在销毁的时候，会调用`destroy`来执行销毁操作。如果你需要自己实现`destroy`成员函数，请务必调用`super.destroy()`，否则可能会导致某些副作用代码无法被销毁

**注意事项**

- 此时的`player`播放器实例还没完全初始化完成，如果你需要使用到其他组件的功能，因为组件的初始化顺序的问题，可能你所需要的组件还没进行初始化，你可以等待播放器初始化完成，然后在使用其他组件的功能

::: warning 警告
在组件初始化完毕之后，必须调用`this.triggerReady()`方法，否则其子组件（如果存在）将会无法初始化
:::

## 注册

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

## 初始化

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

## 初始化顺序

默认情况下，组件的初始化顺序是按照组件的注册先后顺序来进行的。组件的初始化顺序可能会影响到`UI`的排版，先初始化的组件`UI`在前，后初始化的`UI`在后。如果你想调整组件的初始化顺序，可以在注册组件的时候使用`level`选项来调整，值越大的就会被优先初始化。

```typescript
Player.registerComponent("TitleBar", TitleBar, {
  // 调整初始化顺序
  level: 10
});
```

## 父子组件

默认情况下，组件的父组件是`Player`。在注册组件的时候，我们可以通过`parentComponent`来指定组件的父组件是谁

```typescript
Player.registerComponent("TitleBar", TitleBar, {
  parentComponent: "VideoControls"
});
```

通过上述的注册方式，`TitleBar`和`VideoControls`组件就形成父子关系，`VideoControls`是父组件，`TitleBar`是子组件。

`TitleBar`组件将会在父组件`VideoControls`初始化完毕之后进行初始化。如果用户设置了`VideoControls`组件不进行初始化，那么`TitleBar`也不会被初始化

在`TitleBar`组件实例中，可通过`parentComponent`属性查询到其父组件。在`VideoControls`组件实例中，可通过`components`属性，查询到其所有的子组件

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
