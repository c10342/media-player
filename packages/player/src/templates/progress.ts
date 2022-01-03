interface Params {
  isMobile: boolean;
}

export default function getProgressHtml({ isMobile }: Params) {
  return `
    <div class='player-process-slot ${
      isMobile ? "player-process-mobile" : "player-process-pc"
    }'>
        <div class='player-process-content'>
            <div class="player-process-mask">
                ${
                  !isMobile
                    ? '<span class="player-process-time">00:00</span>'
                    : ""
                }
                <div class="player-process-wrapper">
                <div class="player-process-loaded"></div>
                <div class="player-process-played">
                    <span class="player-process-ball"></span>
                </div>
                </div>
            </div>
        </div>
    </div>
    `;
}
