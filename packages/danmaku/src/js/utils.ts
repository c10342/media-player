declare global {
  interface Window {
    MSCSSMatrix: any;
  }
}

export function getRandomItem<T>(list: Array<T>) {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

let DOMMatrixCache: any = null;

function getDOMMatrix() {
  if (DOMMatrixCache || !window) {
    return DOMMatrixCache;
  }
  DOMMatrixCache =
    window.WebKitCSSMatrix || window.DOMMatrix || window.MSCSSMatrix;
  return DOMMatrixCache;
}

export function getTranslateX(node: HTMLElement) {
  const DOMMatrix = getDOMMatrix();
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
