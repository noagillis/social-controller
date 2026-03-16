import { io } from 'socket.io-client';

const socketsForRoomId = {};

export function createTvSocket({ roomId }) {
  // Ensure that we never recreate the socket.
  if (socketsForRoomId[roomId]) {
    return socketsForRoomId[roomId];
  }

  const socket = io(
    'https://afternoon-tundra-96251-3eebbd750a6c.herokuapp.com/'
  );

  socket.emit('joinRoom', {
    room: roomId,
    clientType: 'tv',
  });

  socketsForRoomId[roomId] = socket;

  return socket;
}
