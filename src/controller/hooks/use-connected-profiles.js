import { useEffect, useState, useCallback, useRef } from 'react';
import { socket } from '../utils/controller-socket';
import { useDataContext } from '@/contexts/data';
import { PROFILES } from '../pages/profile-picker/profile-picker';

/**
 * Tracks all connected profiles in the room.
 * - Adds the current controller's own profile on mount
 * - Listens for `receiveMessage` events of type `profileSelect` from other controllers
 * - Listens for `roomUpdate` to trim profiles if controllers disconnect
 */
export function useConnectedProfiles() {
  const { profileData } = useDataContext();
  const [profiles, setProfiles] = useState([]);
  const ownProfileAdded = useRef(false);

  // Add our own profile once we have it, resolving avatar from PROFILES list
  useEffect(() => {
    if (profileData && !ownProfileAdded.current) {
      ownProfileAdded.current = true;
      const match = PROFILES.find((p) => p.name === profileData);
      setProfiles((prev) => {
        if (prev.some((p) => p.name === profileData)) return prev;
        return [{ name: profileData, avatar: match?.avatar, isSelf: true }, ...prev];
      });
    }
  }, [profileData]);

  useEffect(() => {
    const handleMessage = (messageBody) => {
      if (messageBody?.type === 'profileSelect') {
        const data = messageBody.data;
        setProfiles((prev) => {
          if (prev.length >= 4) return prev;
          if (prev.some((p) => p.name === data.name)) return prev;
          return [...prev, { name: data.name, avatar: data.avatar, isGuest: data.isGuest }];
        });
      }
    };

    const handleRoomUpdate = (roomState) => {
      const count = roomState?.counts?.controller || 0;
      // Trim profiles if controllers disconnected
      setProfiles((prev) => prev.slice(0, count));
    };

    socket.on('receiveMessage', handleMessage);
    socket.on('roomUpdate', handleRoomUpdate);

    return () => {
      socket.off('receiveMessage', handleMessage);
      socket.off('roomUpdate', handleRoomUpdate);
    };
  }, []);

  return profiles;
}
