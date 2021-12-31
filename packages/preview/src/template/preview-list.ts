import { PreviewList } from "../types";

interface Params {
  previewList: PreviewList;
  duration: number;
}

export default function getPreviewList({ previewList, duration }: Params) {
  return previewList
    .map((value, index) => {
      return `
        <span class='preview-container' style="left:${
          (value.time / duration) * 100
        }%;" data-index='${index}'>
            <span class="preview-point" data-index='${index}'></span>
            <img class="preview-image" src='${value.url}' ${
        value.alt ? "alt=" + value.alt : ""
      }></img>
        </span>
        `;
    })
    .join("");
}
