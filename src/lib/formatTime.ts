export default function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainderSeconds < 10 ? "0" : ""}${remainderSeconds}`;
}
