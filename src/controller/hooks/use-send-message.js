import { useCallback } from 'react';
import { throttle } from 'lodash';
import { roomId } from '../utils/get-room-id-from-query-param';
import { socket } from '../utils/controller-socket';

// Use the function returned by this hook to send messages to the
// TV from the controller.

export function useSendMessage() {
  // Throttle the sendMessage function so it only fires once every 100ms
  const throttledSendMessage = useCallback(
    throttle((eventName, data) => {
      if (typeof roomId !== 'string') {
        console.warn('No room ID set, cannot send data to server.');
        return;
      }

      const dataWithTimestamp = {
        ...data,
        timestamp: Date.now(),
      };

      if (socket) {
        // console.log('Sending message:', dataWithTimestamp);
        socket.emit('sendMessage', {
          room: roomId,
          message: {
            type: eventName,
            data: dataWithTimestamp,
          },
        });
      }
    }, 100, { leading: true, trailing: false }), // Fires immediately and blocks for 100ms
    []
  );

  return throttledSendMessage;
}
