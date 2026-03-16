import { useEffect } from 'react';
import { useTvSocket } from './use-tv-socket';

export function useOnReceiveMessage(messageType, onMessageReceived) {
  const tvSocket = useTvSocket();

  useEffect(() => {
    if (!tvSocket) {
      return;
    }

    const handler = (messageBody) => {
      if (messageBody?.type === messageType) {
        if (messageType === 'buttonPress') {
          console.log(`[TV] Received button press: ${messageBody?.data?.button}`);
        }
        onMessageReceived?.(messageBody?.data);
      }
    };

    tvSocket.on('receiveMessage', handler);

    return () => {
      tvSocket.off('receiveMessage', handler);
    };
  }, [tvSocket, messageType, onMessageReceived]);
}
