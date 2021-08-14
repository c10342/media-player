export interface ZoomOptions {
  x?: boolean;
  y?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  minHeight?: number;
  minWidth?: number;
  open?: boolean;
}

export interface ZoomData {
  width: number;
  height: number;
}
