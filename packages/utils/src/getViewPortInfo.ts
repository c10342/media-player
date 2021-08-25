export default function getViewPortInfo() {
  const clientWidth =
    document.documentElement.clientWidth || document.body.clientWidth;
  const clientHeight =
    document.documentElement.clientHeight || document.body.clientHeight;

  return {
    clientWidth,
    clientHeight
  };
}
