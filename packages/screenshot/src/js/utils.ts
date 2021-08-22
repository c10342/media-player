// 下载base64图片
export function downloadBase64(fileName: string, content: string) {
  const aLink = document.createElement("a");
  const blob = base64ToBlob(content); //new Blob([content]);

  const evt = document.createEvent("HTMLEvents");
  evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
  aLink.download = fileName;
  aLink.href = URL.createObjectURL(blob);

  // aLink.dispatchEvent(evt);
  aLink.click();
}
export function base64ToBlob(code: string) {
  const parts = code.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const raw = atob(parts[1]);
  const rawLength = raw.length;

  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
}
