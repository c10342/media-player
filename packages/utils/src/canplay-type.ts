export default function canPlayType(type: string) {
  return document.createElement("video").canPlayType(type);
}
