import { io } from 'socket.io-client';
import { roomId } from './get-room-id-from-query-param';

const socket = io(
  'https://afternoon-tundra-96251-3eebbd750a6c.herokuapp.com/'
);

socket.emit('joinRoom', {
  room: roomId,
  clientType: 'controller',
});

export { socket };
