// let cachedRoomId = null;

let cachedResponse = null;

export function getRoomId() {
  if (cachedResponse !== null) {
    return cachedResponse;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("tvRoomId");
  const numericRoomId = Number(roomId);
  if (
    roomId !== null &&
    typeof roomId === "string" &&
    numericRoomId > 0 &&
    !Number.isNaN(numericRoomId)
  ) {
    console.log("[getRoomId] Using room ID from query param:", roomId);
    const result = Promise.resolve({
      success: true,
      body: { roomId },
    });
    cachedResponse = result;
    return result;
  }

  cachedResponse = fetch(
    "https://afternoon-tundra-96251-3eebbd750a6c.herokuapp.com/room-id"
  ).then(
    (response) => {
      return response.json().then(
        (data) => {
          return {
            success: response.ok,
            body: data,
          };
        },
        () => {
          return Promise.reject({
            success: false,
            body: null,
          });
        }
      );
    },
    () => {
      return Promise.reject({
        success: false,
        body: null,
      });
    }
  );

  return cachedResponse;
}
