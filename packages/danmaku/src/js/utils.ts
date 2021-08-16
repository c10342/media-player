declare global {
  interface Window {
    MSCSSMatrix: any;
  }
}

export function getRandomItem<T>(list: Array<T>) {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

const DOMMatrix =
  window.WebKitCSSMatrix || window.DOMMatrix || window.MSCSSMatrix;

export function getTranslateX(node: HTMLElement) {
  if (window.getComputedStyle && DOMMatrix) {
    const transform = window
      .getComputedStyle(node, null)
      .getPropertyValue("transform");
    return Number(new DOMMatrix(transform).m41);
  } else {
    const transform = window
      .getComputedStyle(node, null)
      .getPropertyValue("transform");
    const match = transform.match(/[+-]?\d+/g) as RegExpMatchArray;
    return Number(match[4]);
  }
}
