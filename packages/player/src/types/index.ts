export interface PlayerOptions {
  el: string | HTMLElement;
  type?: string;
}

export type HtmlElementProp = HTMLElement | null;

export interface AnimationClassName {
  enter: string;
  "enter-to": string;
  leave: string;
  "leave-to": string;
}
