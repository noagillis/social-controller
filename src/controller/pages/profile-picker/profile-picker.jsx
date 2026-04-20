import { useState } from 'react';
import { useDataContext } from '@/contexts/data';
import { useSendMessage } from '@/controller/hooks/use-send-message';
import { motion, AnimatePresence } from 'framer-motion';

import fifaBg from './assets/fifa-bg.png';
import pokemonConcierge from './assets/pokemon-concierge.png';
import mudkip from './assets/mudkip.png';
import witcher from './assets/witcher.png';
import witcher2 from './assets/witcher2.png';
import classicGuest from './assets/classic-guest.png';

const profilesIcon = '/images/profiles_MEDIUM.png';
const controllerIcon = '/images/game-controller.png';

import './profile-picker.scss';

const GUEST_USERNAMES = ['Otter44', 'Moose99', 'Sloth7', 'Panda23'];

export const PROFILES = [
  { name: 'LilnMiso', avatar: pokemonConcierge },
  { name: 'Mudkip', avatar: mudkip },
  { name: 'GeryRiviera', avatar: witcher },
  { name: 'Ciriously', avatar: witcher2 },
  { name: 'Play as Guest', avatar: classicGuest, isGuest: true },
];

export default function ProfilePicker({ onProfileSelected, onDismiss }) {
  const { setProfileData } = useDataContext();
  const sendMessage = useSendMessage();
  const [exiting, setExiting] = useState(false);

  const handleSelect = (profile) => {
    const displayName = profile.isGuest
      ? GUEST_USERNAMES[Math.floor(Math.random() * GUEST_USERNAMES.length)]
      : profile.name;
    setProfileData(displayName);
    sendMessage('profileSelect', { name: displayName, avatar: profile.avatar, isGuest: !!profile.isGuest });
    const resolvedProfile = { ...profile, name: displayName };
    setExiting(true);
    setTimeout(() => {
      onProfileSelected(resolvedProfile);
    }, 400);
  };

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => {
      onDismiss?.();
    }, 400);
  };

  return (
    <div className="profile-picker" onClick={handleDismiss}>
      <div className="profile-picker__bg">
        <img src={fifaBg} alt="" />
        <div className="profile-picker__bg-overlay" />
      </div>

      <motion.div
        className="profile-picker__card"
        initial={{ y: '100%' }}
        animate={{ y: exiting ? '100%' : 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="profile-picker__header">
          <img src={profilesIcon} alt="" className="profile-picker__header-icon" />
          <span>Who's playing on this controller?</span>
        </div>

        <div className="profile-picker__grid">
          {PROFILES.map((profile) => (
            <button
              key={profile.name}
              className="profile-picker__profile"
              onClick={() => handleSelect(profile)}
            >
              <div className="profile-picker__avatar-frame">
                <img src={profile.avatar} alt={profile.name} />
              </div>
              <div className="profile-picker__handle">
                {!profile.isGuest && (
                  <img src={controllerIcon} alt="" className="profile-picker__controller-icon" />
                )}
                <span>{profile.name}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="profile-picker__divider" />

        <div className="profile-picker__footer">
          <span>→ Use your account to play</span>
        </div>
      </motion.div>
    </div>
  );
}
