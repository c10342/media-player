export default function parseHtmlToDom(html: string) {
  return new DOMParser().parseFromString(html, "text/html").body
    .firstChild as HTMLElement;
}
