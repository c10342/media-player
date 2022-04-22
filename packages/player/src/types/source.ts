import { SourceItem } from "./player";

export type NextFunction = (data: SourceItem) => void;

export type SourceHandleCallback = (
  data: SourceItem,
  next: NextFunction
) => void;

export interface SourceArrItem {
  type: string;
  handler: SourceHandleCallback;
}
