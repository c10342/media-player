export default function getBoundingClientRect(
  el: HTMLElement | null | undefined
) {
  let left = 0;
  let top = 0;
  const width = el?.offsetWidth || 0;
  const height = el?.offsetHeight || 0;
  let obj: any = el;
  while (obj) {
    left += obj.offsetLeft;
    top += obj.offsetTop;
    obj = obj.offsetParent;
  }
  return {
    left,
    top,
    right: width + left,
    bottom: height + top,
    width,
    height
  };
}
