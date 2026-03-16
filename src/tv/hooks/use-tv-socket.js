import { useEffect, useState } from 'react';
import { createTvSocket } from '../utils/create-tv-socket';
import { useRoomId } from './use-room-id';

export function useTvSocket() {
  const roomId = useRoomId();
  const [tvSocket, setTvSocket] = useState(null);

  useEffect(() => {
    if (roomId !== null && !tvSocket) {
      setTvSocket(createTvSocket({ roomId }));
    }
  }, [roomId, tvSocket]);

  return tvSocket;
}
