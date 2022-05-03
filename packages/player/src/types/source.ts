import { SourceItem } from "./player";

export type SourceNextFunction = (data: SourceItem) => void;

export type SourceHandleCallback = (
  data: SourceItem,
  next: SourceNextFunction
) => void;

export interface SourceArrItem {
  type: string;
  handler: SourceHandleCallback;
}
