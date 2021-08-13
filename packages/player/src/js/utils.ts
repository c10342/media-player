import { AnimationClassName } from "../types";

// 根据动画名拼接成css类名
export function getAnimationClassName(name: string): AnimationClassName {
  return {
    enter: `${name}-enter ${name}-enter-active`,
    "enter-to": `${name}-enter-to ${name}-enter-active`,
    leave: `${name}-leave ${name}-leave-active`,
    "leave-to": `${name}-leave-to ${name}-leave-active`
  };
}

// 获取元素样式
export function getElementStyle(element: HTMLElement, styleName: any) {
  if (styleName) {
    return document.defaultView?.getComputedStyle(element, null)[styleName];
  }
  return document.defaultView?.getComputedStyle(element, null);
}

// 拼接类名
export function setClassName(...args: Array<any>) {
  if (args.length === 0) {
    return "";
  }
  let className = "";
  for (let i = 0; i < args.length; i++) {
    className += `${args[i]} `;
  }
  return className;
}

// 等待n毫秒
export const nextTick = (time?: number) => () =>
  new Promise((resolve) => setTimeout(resolve, time ? time : 1000 / 30));

export const sleep = (time?: number) =>
  new Promise((resolve) => setTimeout(resolve, time ? time : 0));
