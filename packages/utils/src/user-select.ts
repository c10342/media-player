export default function userSelect(flag: boolean) {
  const body = document.body;
  const haveClass = body.classList.contains("player-not-select");
  if (flag) {
    if (haveClass) {
      body.classList.remove("player-not-select");
    }
  } else {
    if (!haveClass) {
      body.classList.add("player-not-select");
    }
  }
}
