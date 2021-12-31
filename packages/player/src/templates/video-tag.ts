export interface Params {
  preload?: string;
  poster?: string;
  crossorigin?: boolean;
  autoplay?: boolean;
}

export default function getVideoTagHtml({
  preload,
  poster,
  crossorigin,
  autoplay
}: Params) {
  return `
    <video 
    class="player-video" 
    webkit-playsinline
    playsinline
    ${preload ? "preload=" + preload : ""}
    ${poster ? "poster=" + poster : ""}
    ${crossorigin ? "crossorigin='anonymous'" : ""}
    ${autoplay ? "autoplay" : ""}
    >
    </video>
    `;
}
