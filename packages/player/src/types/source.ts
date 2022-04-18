import { SourceItem } from "./player";

export type SourceHandleCallback = (
  data: SourceItem
) => SourceItem | Promise<SourceItem>;
