import { useEffect, useState } from 'react';
import { useTvSocket } from './use-tv-socket';
import { useRoomId } from './use-room-id';

export function useSendMessageTV() {
  const tvSocket = useTvSocket();
  const roomId = useRoomId();
  const [sendMessage, setSendMessage] = useState(null); // Start with null

  useEffect(() => {
    // Only set sendMessage when both roomId and tvSocket are ready
    if (roomId && tvSocket) {
      const sendMessageWithRoomId = (eventName, data) => {
        const dataWithTimestamp = {
          ...data,
          timestamp: Date.now(),
        };

        // console.log(eventName);
        // console.log(data);

        tvSocket.emit('sendMessage', {
          room: roomId,
          message: {
            type: eventName,
            data: dataWithTimestamp,
          },
        });
      };

      setSendMessage(() => sendMessageWithRoomId); // Set the function with the correct roomId and tvSocket
    }
  }, [roomId, tvSocket]); // Re-run the effect when roomId or tvSocket changes

  return sendMessage;
}
