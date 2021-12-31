export default function getFullscreenHtml({ isMobile }: { isMobile: boolean }) {
  return `
    <div class="player-fullscreen-container ${
      isMobile ? "player-fullscreen-mobile" : "player-fullscreen-pc"
    }">
        <span class="player-icon-web-fullscreen  player-icon-item player-fullscreen-web"></span>
        <span class="player-icon-full-screen  player-icon-item player-fullscreen-browser"></span>
    </div>
    `;
}
