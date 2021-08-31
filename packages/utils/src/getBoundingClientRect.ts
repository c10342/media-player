import { isUndef } from "./is";

export default function getBoundingClientRect(
  el: HTMLElement | null | undefined
) {
  if (isUndef(el)) {
    return {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0
    };
  }
  const scrollLeft =
    document.documentElement.scrollLeft || document.body.scrollLeft;
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const rect = el.getBoundingClientRect();
  const left = rect.left + scrollLeft;
  const top = rect.top + scrollTop;
  const width = rect.width;
  const height = rect.height;
  return {
    left,
    top,
    right: width + left,
    bottom: height + top,
    width,
    height
  };
}
