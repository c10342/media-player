interface Params {
  $t: (expression: string) => string;
}
export default function getLiveHtml({ $t }: Params) {
  return `
    <span class='player-live-tip-container'>
        <i class='player-live-tip-dot'></i>
        <span class='player-live-tip'>${$t("live")}</span>
    </span>
    `;
}
