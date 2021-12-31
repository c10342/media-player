import { SpeedItem } from "../types";

interface Params {
  speedList?: SpeedItem[];
}

function getListHtml({ speedList }: Params) {
  if (speedList && speedList.length > 1) {
    return `
          <ul class="player-label-list-wrapper player-speed-wrapper">
          ${speedList
            .map((value, index) => {
              return `
              <li class="player-label-list-item player-speed-item" data-index="${index}">
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

export default function getSpeedHtml(params: Params) {
  return `
    <div class="player-label-list-container">
        ${getListHtml(params)}
        <span class="player-label-list-label player-speed-label">
        </span>
    </div>
    `;
}
