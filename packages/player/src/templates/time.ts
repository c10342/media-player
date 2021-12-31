interface Params {
  isMobile: boolean;
}
export default function getTimeHtml({ isMobile }: Params) {
  return `
    <span class="player-time-tip ${isMobile ? "player-time-tip-mobile" : ""}">
        <span class='player-currentTime'>00:00</span>
        <span>/</span>
        <span class='player-totalTime'>00:00</span>
    </span>
    `;
}
