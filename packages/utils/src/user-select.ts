export default function userSelect(flag: boolean) {
  const body = document.body;
  const haveClass = body.classList.contains("amp-not-select");
  if (flag) {
    if (haveClass) {
      body.classList.remove("amp-not-select");
    }
  } else {
    if (!haveClass) {
      body.classList.add("amp-not-select");
    }
  }
}
