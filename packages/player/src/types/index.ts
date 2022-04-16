export interface DragDataInfo {
  offsetX: number;
  offsetY: number;
  percentX: number;
  percentY: number;
}

export interface ClassType<T = any> {
  new (...data: any): T;
  [key: string]: any;
}
