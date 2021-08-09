import Player from "../index";
import Template from "../js/template";

export type VideoListItem = { label: string; url: string; default?: boolean };

export type VideoListParams = Array<VideoListItem>;

export type SpeedItem = { label: string; value: number; default?: boolean };

export interface PlayerOptions {
  el: string | HTMLElement;
  customType?: (videoElement: HTMLVideoElement, options: VideoListItem) => void;
  videoList: VideoListParams;
  autoplay?: boolean;
  muted?: boolean;
  speedList?: Array<SpeedItem>;
}

export type HtmlElementProp = HTMLElement | null;

export type HTMLVideoElementProp = HTMLVideoElement | null;

export type NodeListElement = NodeListOf<Element> | null;

export type HTMLImageElementProp = HTMLImageElement | null;

export interface AnimationClassName {
  enter: string;
  "enter-to": string;
  leave: string;
  "leave-to": string;
}

export interface ComponentOptions extends PlayerOptions {
  templateInstance: Template;
  instance: Player;
}
