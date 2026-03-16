const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");
export { roomId };
