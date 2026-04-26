import { useEffect, useState } from 'react';
import { socket } from '../utils/controller-socket';
import { roomId } from '../utils/get-room-id-from-query-param';

// This hook listens for room updates from the server and allows passing extra data (e.g., pageId)
export function useGetMessage() {
  const [pageId, setPageId] = useState(null);
  // Start as null — we don't know the TV's state until it broadcasts.
  // Defaulting to 1 used to auto-open the social hub on connect even when
  // the TV was actually past step 1.
  const [step, setStep] = useState(null);
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
      // Reset gameExited when moving forward to a new game (step 2+), not when dropping back to step 1
      if (updatedRoomData?.step >= 2) {
        setGameExited(false);
      }
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
        // Delay slightly so this wins over any concurrent pageUpdate to step 1
        setTimeout(() => setGameExited(true), 50);
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
