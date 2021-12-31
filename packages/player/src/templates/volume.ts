export default function getVolumeHtml() {
  return `
  <div class="player-volume-container">
    <span class="player-icon-volume player-icon-item player-volume-button"></span>
    <div class='player-volume-animation'>
        <div class="player-volume-mask">
            <div class="player-volume-wrapper">
                <div class="player-volume-process">
                    <span class="player-volume-ball"></span>
                </div>
            </div>
        </div>
    </div>
    </div>
    `;
}
