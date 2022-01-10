export default function parseHtmlToDom(html: string) {
  // fix:必须使用cloneNode克隆一份节点出来，否则video标签开启画中画的时候浏览器会崩溃掉
  return new DOMParser()
    .parseFromString(html, "text/html")
    .body.firstChild?.cloneNode(true) as HTMLElement;
}
