export type HighlightListItem = {
  time: number;
  text: string;
  [key: string]: any;
};
export type HighlightList = Array<HighlightListItem>;
export interface HighlightOptions {
  jump?: boolean;
  showTip?: boolean;
  list?: HighlightList;
}
