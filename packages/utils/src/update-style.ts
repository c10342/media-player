import { isUndef } from "./is";

function updateStyle(
  element: HTMLElement | null | undefined,
  styles: Partial<CSSStyleDeclaration>
) {
  if (isUndef(element)) {
    return;
  }
  for (const key in styles) {
    const value = styles[key];
    if (!isUndef(value)) {
      element.style[key] = value;
    }
  }
}

export default updateStyle;
