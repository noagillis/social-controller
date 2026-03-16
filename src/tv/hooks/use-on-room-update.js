import { useEffect } from 'react';
import { useTvSocket } from './use-tv-socket';

export function useOnRoomUpdate(onRoomUpdate) {
  const tvSocket = useTvSocket();

  useEffect(() => {
    if (!tvSocket) {
      return;
    }

    tvSocket.on('roomUpdate', (messageBody) => {
      onRoomUpdate?.(messageBody);
    });

    return () => {
      tvSocket.off('roomUpdate');
    };
  }, [tvSocket, onRoomUpdate]);
}
