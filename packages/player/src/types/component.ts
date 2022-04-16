import { ClassType } from "./index";

export interface ComponentApi {
  destroy: () => void;
  [key: string]: any;
}
export interface DefaultComponentOptions {
  init?: boolean;
  defaults?: { [key: string]: any };
  level?: number;
  parentComponent?: string;
}

export interface ComponentItem {
  name: string;
  options: DefaultComponentOptions;
  handler: ClassType<ComponentApi>;
}

export type FullscreenType = "web" | "browser";
