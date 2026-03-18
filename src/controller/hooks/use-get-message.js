import { useEffect, useState } from 'react';
import { socket } from '../utils/controller-socket';
import { roomId } from '../utils/get-room-id-from-query-param';

// This hook listens for room updates from the server and allows passing extra data (e.g., pageId)
export function useGetMessage() {
  const [pageId, setPageId] = useState(null);
  const [step, setStep] = useState(1);
  const [inputFocus, setInputFocus] = useState(null);
  const [friendSearch, setFriendSearch] = useState(false);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [gameExited, setGameExited] = useState(false);

  useEffect(() => {
    if (typeof roomId !== 'string') {
      console.warn('No room ID set, cannot listen for room updates.');
      return;
    }

    const handlePageUpdate = (updatedRoomData) => {
      console.log(updatedRoomData);
      setPageId(updatedRoomData.pageId);
      setStep(updatedRoomData?.step);
    };

    const handleMessage = (messageBody) => {
      if (messageBody?.type === 'inputFocus') {
        setInputFocus(messageBody.data.state);
      }
      if (messageBody?.type === 'pageUpdate') {
        handlePageUpdate(messageBody.data);
      }
      if (messageBody?.type === 'friendSearch') {
        setFriendSearch(messageBody.data.state);
      }
      if (messageBody?.type === 'pendingInvites') {
        setPendingInvites(messageBody.data?.invites || []);
      }
      if (messageBody?.type === 'exitGame') {
        setGameExited(true);
      }
    };

    // Listen for the 'pageId' event from the server
    socket.on('receiveMessage', handleMessage);

    return () => {
      socket.off('receiveMessage', handleMessage);
    };
  }, []);

  return { pageId, step, inputFocus, friendSearch, setFriendSearch, pendingInvites, setPendingInvites, gameExited, setGameExited };
}
