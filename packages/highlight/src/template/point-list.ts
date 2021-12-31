import { HighlightList } from "../types";

interface Params {
  highlightList: HighlightList;
  duration: number;
}

export default function getPointListHtml({ highlightList, duration }: Params) {
  return highlightList
    .map((value, index) => {
      return `
        <span class='highlight-container'  style="left:${
          (value.time / duration) * 100
        }%;" data-index='${index}'>
            <span class="highlight-point"  data-index='${index}'></span>
            <span class="highlight-point-tip">${value.text}</span>
        </span>
        `;
    })
    .join("");
}
