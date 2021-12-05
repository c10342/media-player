export type HighlightListItem = {
  // 时间点
  time: number;
  // 显示文本
  text: string;
  // 其他数据
  [key: string]: any;
};

export type HighlightList = Array<HighlightListItem>;

export interface HighlightOptions {
  // 点击是否自动跳转
  jump?: boolean;
  // 点击是否显示提示
  showTip?: boolean;
  // 提示点列表
  list?: HighlightList;
}
