import { useState, useEffect } from "react";
import { getRoomId } from "../utils/get-room-id";

export function useRoomId() {
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    getRoomId().then(
      (response) => {
        const roomId = response.body?.roomId;

        if (typeof roomId === "string") {
          console.log("[useRoomId] Room ID received from server: " + roomId);
          setRoomId(roomId);
        }
      },
      () => {
        console.warn("[getRoomId] Failed to get a Room ID from the server.");
      }
    );
  }, []);

  return roomId;
}
