import { useEffect, useState } from 'react';
import { socket } from '../utils/controller-socket';
import { useDataContext } from '@/contexts/data';
import { PROFILES } from '../pages/profile-picker/profile-picker';

/**
 * Tracks all connected profiles in the room.
 * - Listens for `connectedProfilesSync` from the TV, which is the source of truth
 * - Marks the current user's profile with `isSelf`
 */
export function useConnectedProfiles() {
  const { profileData } = useDataContext();
  const [profiles, setProfiles] = useState([]);

  // Seed with own profile immediately so the list isn't empty before the TV syncs
  useEffect(() => {
    if (profileData && profiles.length === 0) {
      const match = PROFILES.find((p) => p.name === profileData);
      setProfiles([{ name: profileData, avatar: match?.avatar, isSelf: true }]);
    }
  }, [profileData]);

  useEffect(() => {
    const handleMessage = (messageBody) => {
      if (messageBody?.type === 'connectedProfilesSync') {
        const synced = messageBody.data?.profiles || [];
        // Mark the current user's entry with isSelf
        setProfiles(
          synced.map((p) => ({
            ...p,
            isSelf: p.name === profileData,
          }))
        );
      }
    };

    socket.on('receiveMessage', handleMessage);

    return () => {
      socket.off('receiveMessage', handleMessage);
    };
  }, [profileData]);

  return profiles;
}
