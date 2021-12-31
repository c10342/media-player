import { VideoListParams } from "../types";

interface Params {
  videoList: VideoListParams;
}

function getListHtml({ videoList }: Params) {
  if (videoList.length > 1) {
    return `
        <ul class="player-label-list-wrapper player-definition-wrapper">
        ${videoList
          .map((value, index) => {
            return `
            <li class="player-label-list-item player-definition-item" data-index="${index}">
                ${value.label}
            </li>
            `;
          })
          .join("")}
        </ul>
      `;
  }
  return "";
}

export default function getDefinitionHtml(params: Params) {
  return `
    <div class="player-label-list-container">
        ${getListHtml(params)}
        <span class="player-label-list-label player-definition-label">
        </span>
    </div>
    `;
}
