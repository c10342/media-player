import getVideoTagHtml, { Params } from "./video-tag";

export default function getVideoHtml(params: Params) {
  return `
    <div class="player-video-slot">
        ${getVideoTagHtml(params)}
    </div>
    `;
}
