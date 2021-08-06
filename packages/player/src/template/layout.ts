import { PlayerOptions } from "../types";

export default function getLayoutTemplate(options: PlayerOptions) {
  const html = `
    <div class="player-container">
        <video class="player-video"></video>
    </div>
    `;
  return html;
}
