import Template from "../js/template";

export type VideoListItem = { label: string; url: string };

export type VideoListParams = Array<VideoListItem>;

export interface PlayerOptions {
  el: string | HTMLElement;
  customType?: (videoElement: HTMLVideoElement, options: VideoListItem) => void;
  videoList: VideoListParams;
}

export type HtmlElementProp = HTMLElement | null;

export type HTMLVideoElementProp = HTMLVideoElement | null;

export interface AnimationClassName {
  enter: string;
  "enter-to": string;
  leave: string;
  "leave-to": string;
}

export interface ComponentOptions extends PlayerOptions {
  templateInstance: Template;
}
