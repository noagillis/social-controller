import { useEffect, useRef } from 'react';
import { useTvSocket } from './use-tv-socket';

export function useOnRoomUpdate(onRoomUpdate) {
  const tvSocket = useTvSocket();
  const callbackRef = useRef(onRoomUpdate);

  useEffect(() => {
    callbackRef.current = onRoomUpdate;
  }, [onRoomUpdate]);

  useEffect(() => {
    if (!tvSocket) {
      return;
    }

    const handler = (messageBody) => {
      callbackRef.current?.(messageBody);
    };

    tvSocket.on('roomUpdate', handler);

    return () => {
      tvSocket.off('roomUpdate', handler);
    };
  }, [tvSocket]);
}
