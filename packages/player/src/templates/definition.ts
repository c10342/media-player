import { SourceItem } from "../types/index";

interface Params {
  sources: SourceItem[];
}

function getListHtml({ sources }: Params) {
  if (sources.length > 1) {
    return `
        <ul class="player-label-list-wrapper player-definition-wrapper">
        ${sources
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
