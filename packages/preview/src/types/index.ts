export type PreviewListItem = {
  // 时间点
  time: number;
  // 图片地址
  url: string;
  // 其他数据
  [key: string]: any;
};

export type PreviewList = Array<PreviewListItem>;

export interface PreviewOptions {
  // 提示点列表
  list?: PreviewList;
  barPreviewUrl?: string;
}
