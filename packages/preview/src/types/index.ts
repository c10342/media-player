export type PreviewListItem = {
  // 时间点
  time: number;
  // 图片地址
  url: string;
  // alt属性
  alt?: string;
  // 其他数据
  [key: string]: any;
};

export type PreviewList = Array<PreviewListItem>;

export interface PreviewOptions {
  // 预览点列表
  list?: PreviewList;
  barPreviewUrl?: string;
}
