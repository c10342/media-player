# 视频缩略图预览

## 安装

```bash
npm i @lin-media/preview
```

## 初始化

```javascript
import MediaPlayer from "@lin-media/player";
import Preview from "@lin-media/preview";
MediaPlayer.use(Preview);
```

缩略图有 2 中形式，一种是通过列表传入对应时间点的缩略图，另一种是传入整个视频的缩略图地址（这种是可以查看任意时间点的缩略图，但是缩略图必须是完整的）

第一种：

```javascript
const previewList = [
  {
    time: 40,
    url: "http://xxx/demo1.png"
  },
  {
    time: 80,
    url: "http://xxx/demo2.png"
  }
];
const player = new MediaPlayer({
  // ...
  Preview: {
    // 通过参数传入或者通过setPreview方法设置
    list: previewList
  }
});

// player.preview.setPreview(previewList)

player.$on("preview-click", (item: any) => {
  console.log(item);
});
```

第二种：

```javascript
const player = new MediaPlayer({
  // ...
  Preview: {
    // 通过参数传入或者通过setBarView方法设置
    barPreviewUrl: "https://xxx/demo.jpg"
  }
});
// player.preview.setBarView('https://xxx/demo.jpg')
```

## Preview 参数

| 参数          | 说明                         | 类型   | 可选值 | 默认值 |
| ------------- | ---------------------------- | ------ | ------ | ------ |
| list          | 时间点缩略图列表，格式见下方 | Array  | —      | —      |
| barPreviewUrl | 完整的视频缩略图地址         | string | —      | —      |

## 事件

| 事件名称      | 说明             | 回调参数 |
| ------------- | ---------------- | -------- |
| preview-click | 点击缩略点时触发 | item     |

## API

- `player.preview.setPreview(list:Array)` : 设置时间点缩略图列表

- `player.preview.destroyPreview()` : 销毁时间点缩略图列表

- `player.preview.setBarView(barPreviewUrl:string)` : 设置进度条预览

- `player.preview.destroyBarView()` : 销毁进度条预览

## list 格式

| 字段 | 说明     | 类型   |
| ---- | -------- | ------ |
| time | 时间点   | number |
| url  | 图片地址 | string |
| alt  | alt 属性 | string |
