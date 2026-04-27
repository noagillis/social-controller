import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataContext } from '@/contexts/data';
import { useUIContext } from '@/contexts/ui';
import { useSendMessage } from '@/controller/hooks/use-send-message';
import { PROFILES } from '../pages/profile-picker/profile-picker';
import PhoneControllerPink from '/images/phone-controller-pink.png';
import './social-overlay.scss';

function sortByPresence(friends) {
  return [...friends].sort((a, b) => {
    if (a.online === b.online) return 0;
    return a.online ? -1 : 1;
  });
}

const TABS = ['Home', 'Friends'];

const MAX_PARTY_SIZE = 4;

const TAB_ICONS = {
  Home: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
    </svg>
  ),
  Friends: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
  Profile: null, // uses avatar image instead
};

function ProfileCard({ profileData, onClose, currentStep, onNavigateToFriends }) {
  const selectedProfile = PROFILES.find((p) => p.name === profileData);
  const avatar = selectedProfile?.avatar;
  const name = profileData || 'Player';
  const isPreGame = currentStep === 1;

  return (
    <div className="social-overlay__profile-card">
      <div className="social-overlay__profile-header">
        <div className="social-overlay__profile-avatar-wrap">
          {avatar ? (
            <img src={avatar} alt={name} className="social-overlay__profile-avatar" />
          ) : (
            <div className="social-overlay__profile-avatar-placeholder" />
          )}
        </div>
        <div className="social-overlay__profile-info">
          <span className="social-overlay__profile-name">{name}</span>
          <div className="social-overlay__profile-status">
            <span className="social-overlay__online-dot" />
            <span>Online</span>
          </div>
          <span className="social-overlay__profile-stats">22 Friends &bull; 13 Games</span>
        </div>
        <button className="social-overlay__more-btn">
          <ThreeDotsVertical />
        </button>
      </div>
      <div className="social-overlay__now-playing">
        <div className="social-overlay__now-playing-info">
          <div className="social-overlay__now-playing-avatar">
            <img src="/images/fifa-app.png" alt={isPreGame ? 'Start a Game' : 'FIFA 26'} />
          </div>
          <div className="social-overlay__now-playing-text">
            <span className="social-overlay__now-playing-label">{isPreGame ? 'Start a Game' : 'Currently Playing'}</span>
            <span className="social-overlay__now-playing-title">{isPreGame ? 'Start a Game' : 'FIFA 26'}</span>
          </div>
        </div>
        {isPreGame ? (
          <div className="social-overlay__now-playing-gameplay">
            <button className="social-overlay__resume-btn" onClick={onNavigateToFriends}>
              Invite
            </button>
          </div>
        ) : (
          <div className="social-overlay__now-playing-gameplay">
            <img src="/images/FIFA-gameplay-stadium.png" alt="" className="social-overlay__now-playing-gameplay-bg" />
            <button className="social-overlay__resume-btn" onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
              Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function HomeFriendsList({ friends, onNavigateToFriends, onInvite }) {
  const favorites = friends.slice(0, 4);

  return (
    <div className="social-overlay__home-friends">
      <div className="social-overlay__home-friends-header">
        <h3 className="social-overlay__home-friends-title">Friends</h3>
        <div className="social-overlay__home-friends-actions">
          <button className="social-overlay__home-friends-action" aria-label="Add friend" onClick={onNavigateToFriends}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </button>
          <button className="social-overlay__home-friends-action" aria-label="Invite">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
          <button className="social-overlay__more-btn" aria-label="More">
            <ThreeDotsVertical />
          </button>
        </div>
      </div>
      <div className="social-overlay__home-friends-section-label">Favorites</div>
      <div className="social-overlay__home-friends-list">
        {favorites.map((friend) => (
          <HomeFriendItem key={friend.id} friend={friend} onInvite={onInvite} />
        ))}
      </div>
    </div>
  );
}

function HomeFriendItem({ friend, onInvite }) {
  const [inviteState, setInviteState] = useState('idle'); // idle | sending | sent
  const sendMessage = useSendMessage();
  const { profileData } = useDataContext();

  const subtitle = friend.online
    ? (friend.playing ? `Playing ${friend.playing}` : 'Online')
    : 'Online Yesterday';

  const handleInvite = () => {
    if (inviteState !== 'idle') return;
    setInviteState('sending');
    sendMessage('gameInvite', {
      fromPlayer: profileData || 'Player',
      toPlayer: friend.name,
      toAvatar: friend.avatar,
      game: 'FIFA',
    });
    onInvite?.({ id: friend.id ?? friend.name, name: friend.name, avatar: friend.avatar });
    setTimeout(() => setInviteState('sent'), 800);
  };

  return (
    <div className="social-overlay__home-friend-item">
      <div className="social-overlay__home-friend-left">
        <div className="social-overlay__home-friend-avatar">
          {friend.avatar ? (
            <img src={friend.avatar} alt={friend.name} />
          ) : (
            <div className="social-overlay__home-friend-avatar-placeholder" />
          )}
        </div>
        <div className="social-overlay__home-friend-text">
          <span className="social-overlay__home-friend-name">{friend.name}</span>
          <span className={`social-overlay__home-friend-sub ${friend.online ? '--online' : ''}`}>
            {friend.online && <span className="social-overlay__home-friend-dot" />}
            {subtitle}
          </span>
        </div>
      </div>
      <button
        className={`social-overlay__home-friend-invite ${inviteState !== 'idle' ? '--' + inviteState : ''}`}
        onClick={handleInvite}
        disabled={inviteState !== 'idle'}
      >
        {inviteState === 'idle' && 'Invite'}
        {inviteState === 'sending' && 'Sending...'}
        {inviteState === 'sent' && 'Sent!'}
      </button>
    </div>
  );
}

const MOCK_FRIEND_REQUESTS = [
  {
    name: 'xXShadowLordXx', avatar: PROFILES[1]?.avatar, mutualFriends: 3, timeAgo: '2h ago',
    online: true, friends: 112, games: 29, achievements: 14,
    topGames: ['FIFA 26', 'Into the Breach'], playing: 'FIFA 26', memberSince: 'Aug 2024',
  },
  {
    name: 'PixelQueen99', avatar: PROFILES[3]?.avatar, mutualFriends: 7, timeAgo: '5h ago',
    online: true, friends: 203, games: 45, achievements: 31,
    topGames: ['Oxenfree II', "TMNT: Shredder's Revenge", 'FIFA 26'], playing: 'Oxenfree II', memberSince: 'May 2024',
  },
  {
    name: 'TurboNick', avatar: null, mutualFriends: 1, timeAgo: '1d ago',
    online: false, friends: 18, games: 7, achievements: 3,
    topGames: ['FIFA 26', 'Into the Breach'], playing: null, memberSince: 'Dec 2025',
  },
  {
    name: 'CozyGamerVal', avatar: PROFILES[2]?.avatar, mutualFriends: 0, timeAgo: '3d ago',
    online: false, friends: 56, games: 19, achievements: 11,
    topGames: ["TMNT: Shredder's Revenge", 'Oxenfree II'], playing: null, memberSince: 'Oct 2024',
  },
];

const MOCK_SUGGESTED_FRIENDS = [
  {
    name: 'salx', avatar: PROFILES[2]?.avatar, reason: 'Recently played together',
    online: true, friends: 87, games: 24, achievements: 19,
    topGames: ['FIFA 26', "TMNT: Shredder's Revenge", 'Oxenfree II'],
    playing: 'FIFA 26', mutualFriends: 2, memberSince: 'Jan 2025',
  },
  {
    name: 'pewpewpew', avatar: PROFILES[4]?.avatar, reason: 'Also likes Stranger Things',
    online: true, friends: 214, games: 41, achievements: 33,
    topGames: ['Oxenfree II', 'Into the Breach', 'Stranger Things: The Game'],
    playing: 'Oxenfree II', mutualFriends: 5, memberSince: 'Mar 2024',
  },
  {
    name: 'NightOwl_22', avatar: PROFILES[0]?.avatar, reason: 'Friends with LilnMiso',
    online: false, friends: 34, games: 12, achievements: 8,
    topGames: ["TMNT: Shredder's Revenge", 'FIFA 26'],
    playing: null, mutualFriends: 1, memberSince: 'Nov 2025',
  },
  {
    name: 'xKiraGaming', avatar: PROFILES[3]?.avatar, reason: 'Plays FIFA 26',
    online: true, friends: 156, games: 38, achievements: 27,
    topGames: ['FIFA 26', 'Into the Breach', "TMNT: Shredder's Revenge"],
    playing: 'FIFA 26', mutualFriends: 3, memberSince: 'Jun 2024',
  },
  {
    name: 'ghostlyvibes', avatar: null, reason: 'In the same tournament',
    online: false, friends: 11, games: 6, achievements: 4,
    topGames: ['Into the Breach', 'FIFA 26'],
    playing: null, mutualFriends: 0, memberSince: 'Feb 2026',
  },
];

const MOCK_FRIENDS = [
  { id: 'f-0', name: 'LilnMiso', avatar: PROFILES[0]?.avatar, friends: 24, games: 8, online: true },
  { id: 'f-1', name: 'Mudkip', avatar: PROFILES[1]?.avatar, friends: 145, games: 133, online: false },
  { id: 'f-2', name: 'GeryRiviera', avatar: PROFILES[2]?.avatar, friends: 0, games: 1, online: true },
  { id: 'f-3', name: 'Ciriously', avatar: PROFILES[3]?.avatar, friends: 12, games: 6, online: false },
  { id: 'f-4', name: 'Play as Guest', avatar: PROFILES[4]?.avatar, friends: 72, games: 54, online: false },
  { id: 'f-5', name: 'LilnMiso2', avatar: PROFILES[0]?.avatar, friends: 1, games: 62, online: true },
  { id: 'f-6', name: 'Mudkip2', avatar: PROFILES[1]?.avatar, friends: 271, games: 124, online: true },
  { id: 'f-7', name: 'GeryRiviera2', avatar: PROFILES[2]?.avatar, friends: 3, games: 6, online: false },
];

const MOCK_GAMES_PLAYING = [
  "TMNT: Shredder's Revenge",
  'FIFA',
  'Oxenfree II',
  'Into the Breach',
  null,
];

function FriendRequestItem({ request, onClick }) {
  return (
    <div className="social-overlay__friend-item" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="social-overlay__friend-left">
        <div className="social-overlay__friend-avatar">
          {request.avatar ? (
            <img src={request.avatar} alt={request.name} />
          ) : (
            <div className="social-overlay__friend-avatar-placeholder" />
          )}
        </div>
        <div className="social-overlay__friend-text">
          <span className="social-overlay__friend-name">{request.name}</span>
          <span className="social-overlay__friend-stats">
            {request.mutualFriends > 0 ? (
              <><strong>{request.mutualFriends}</strong> mutual {request.mutualFriends === 1 ? 'friend' : 'friends'}</>
            ) : (
              'No mutual friends'
            )}
            {' \u00b7 '}{request.timeAgo}
          </span>
        </div>
      </div>
      <div className="social-overlay__notif-actions" onClick={(e) => e.stopPropagation()}>
        <button className="social-overlay__notif-circle-btn --reject">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M6 6L14 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M14 6L6 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <button className="social-overlay__notif-circle-btn --accept">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M4 10L8.5 14.5L16 6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function PlayerCardModal({ friend, onClose, onInvite }) {
  const [inviteState, setInviteState] = useState('idle'); // idle | sending | sent
  const sendMessage = useSendMessage();
  const { profileData } = useDataContext();
  const playing = friend.online
    ? MOCK_GAMES_PLAYING[Math.abs(friend.name.charCodeAt(0)) % MOCK_GAMES_PLAYING.length]
    : null;

  const handleInvite = () => {
    setInviteState('sending');
    sendMessage('gameInvite', {
      fromPlayer: profileData || 'Player',
      toPlayer: friend.name,
      toAvatar: friend.avatar,
      game: 'FIFA',
    });
    onInvite?.({ id: friend.id ?? friend.name, name: friend.name, avatar: friend.avatar });
    setTimeout(() => setInviteState('sent'), 800);
  };

  return (
    <motion.div
      className="player-card-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="player-card"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: [0.32, 0.94, 0.6, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="player-card__close" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M5 5L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M15 5L5 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="player-card__left">
          <div className="player-card__header">
            <div className="player-card__avatar">
              {friend.avatar ? (
                <img src={friend.avatar} alt={friend.name} />
              ) : (
                <div className="player-card__avatar-placeholder" />
              )}
              <div className={`player-card__presence ${friend.online ? '--online' : '--offline'}`} />
            </div>
            <div className="player-card__name">{friend.name}</div>
            <div className="player-card__status">
              {friend.online ? (playing ? `Playing ${playing}` : 'Online') : 'Offline'}
            </div>
          </div>
        </div>

        <div className="player-card__right">
        <div className="player-card__actions">
          <button
            className={`player-card__invite-btn ${inviteState !== 'idle' ? '--' + inviteState : ''}`}
            onClick={handleInvite}
            disabled={inviteState !== 'idle'}
          >
            {inviteState === 'idle' && 'Invite to Game'}
            {inviteState === 'sending' && (
              <>
                <span className="player-card__spinner" />
                Sending...
              </>
            )}
            {inviteState === 'sent' && 'Invite Sent!'}
          </button>
          <button className="player-card__secondary-btn" onClick={onClose}>
            Message
          </button>
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SuggestedProfileModal({ suggestion, source, onClose, onInvite }) {
  const [addState, setAddState] = useState('idle'); // idle | sending | added
  const [inviteState, setInviteState] = useState('idle'); // idle | sending | sent
  const [acceptState, setAcceptState] = useState('idle'); // idle | accepting | accepted
  const [declineState, setDeclineState] = useState('idle'); // idle | declined
  const sendMessage = useSendMessage();
  const { profileData } = useDataContext();
  const isRequest = source === 'request';

  const handleAddFriend = () => {
    setAddState('sending');
    setTimeout(() => setAddState('added'), 600);
  };

  const handleAccept = () => {
    setAcceptState('accepting');
    setTimeout(() => setAcceptState('accepted'), 600);
  };

  const handleDecline = () => {
    setDeclineState('declined');
    setTimeout(() => onClose(), 600);
  };

  const handleInvite = () => {
    setInviteState('sending');
    sendMessage('gameInvite', {
      fromPlayer: profileData || 'Player',
      toPlayer: suggestion.name,
      toAvatar: suggestion.avatar,
      game: 'FIFA',
    });
    onInvite?.({ id: suggestion.name, name: suggestion.name, avatar: suggestion.avatar });
    setTimeout(() => setInviteState('sent'), 800);
  };

  return (
    <motion.div
      className="player-card-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="player-card player-card--suggested"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: [0.32, 0.94, 0.6, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="player-card__close" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M5 5L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M15 5L5 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="player-card__left">
          <div className="player-card__header">
            <div className="player-card__avatar">
              {suggestion.avatar ? (
                <img src={suggestion.avatar} alt={suggestion.name} />
              ) : (
                <div className="player-card__avatar-placeholder" />
              )}
              <div className={`player-card__presence ${suggestion.online ? '--online' : '--offline'}`} />
            </div>
            <div className="player-card__name">{suggestion.name}</div>
            <div className="player-card__status">
              {suggestion.online ? (suggestion.playing ? `Playing ${suggestion.playing}` : 'Online') : 'Offline'}
            </div>
          </div>

          <div className="player-card__stats-row">
            <div className="player-card__stat">
              <span className="player-card__stat-value">{suggestion.friends}</span>
              <span className="player-card__stat-label">Friends</span>
            </div>
            <div className="player-card__stat-divider" />
            <div className="player-card__stat">
              <span className="player-card__stat-value">{suggestion.games}</span>
              <span className="player-card__stat-label">Games</span>
            </div>
            <div className="player-card__stat-divider" />
            <div className="player-card__stat">
              <span className="player-card__stat-value">{suggestion.achievements}</span>
              <span className="player-card__stat-label">Achievements</span>
            </div>
          </div>
        </div>

        <div className="player-card__right">
          {/* Why suggested */}
          {suggestion.reason && (
            <div className="player-card__suggestion-reason">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              {suggestion.reason}
            </div>
          )}

          {/* Extra info row */}
          <div className="player-card__info-row">
            {suggestion.mutualFriends > 0 && (
              <span className="player-card__info-chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
                {suggestion.mutualFriends} mutual
              </span>
            )}
            <span className="player-card__info-chip">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
              Since {suggestion.memberSince}
            </span>
          </div>

          {/* Actions */}
          <div className="player-card__actions">
            {isRequest ? (
              <>
                <button
                  className={`player-card__accept-btn ${acceptState !== 'idle' ? '--' + acceptState : ''}`}
                  onClick={handleAccept}
                  disabled={acceptState !== 'idle' || declineState === 'declined'}
                >
                  {acceptState === 'idle' && (
                    <>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10L8.5 14.5L16 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Accept
                    </>
                  )}
                  {acceptState === 'accepting' && (
                    <>
                      <span className="player-card__spinner" />
                      Accepting...
                    </>
                  )}
                  {acceptState === 'accepted' && (
                    <>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10L8.5 14.5L16 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Accepted!
                    </>
                  )}
                </button>
                <button
                  className={`player-card__secondary-btn ${declineState === 'declined' ? '--declined' : ''}`}
                  onClick={handleDecline}
                  disabled={acceptState !== 'idle' || declineState === 'declined'}
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M6 6L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M14 6L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {declineState === 'declined' ? 'Declined' : 'Decline'}
                </button>
              </>
            ) : (
              <>
                <button
                  className={`player-card__add-btn ${addState !== 'idle' ? '--' + addState : ''}`}
                  onClick={handleAddFriend}
                  disabled={addState !== 'idle'}
                >
                  {addState === 'idle' && (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      Add Friend
                    </>
                  )}
                  {addState === 'sending' && (
                    <>
                      <span className="player-card__spinner" />
                      Sending...
                    </>
                  )}
                  {addState === 'added' && (
                    <>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10L8.5 14.5L16 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Request Sent!
                    </>
                  )}
                </button>
                <button
                  className={`player-card__invite-btn ${inviteState !== 'idle' ? '--' + inviteState : ''}`}
                  onClick={handleInvite}
                  disabled={inviteState !== 'idle'}
                >
                  {inviteState === 'idle' && (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM8 15c0-1.66 1.34-3 3-3 .35 0 .69.07 1 .18V5h5v2h-3v7.03A3.003 3.003 0 0111 18c-1.66 0-3-1.34-3-3z" />
                      </svg>
                      Invite to Game
                    </>
                  )}
                  {inviteState === 'sending' && (
                    <>
                      <span className="player-card__spinner" />
                      Sending...
                    </>
                  )}
                  {inviteState === 'sent' && (
                    <>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10L8.5 14.5L16 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Invite Sent!
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SuggestedFriendItem({ suggestion, onClick, hideReason }) {
  const [added, setAdded] = useState(false);

  return (
    <div className="social-overlay__suggested-item" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="social-overlay__friend-left">
        <div className="social-overlay__friend-avatar">
          {suggestion.avatar ? (
            <img src={suggestion.avatar} alt={suggestion.name} />
          ) : (
            <div className="social-overlay__friend-avatar-placeholder" />
          )}
        </div>
        <div className="social-overlay__friend-text">
          <span className="social-overlay__friend-name">{suggestion.name}</span>
          {!hideReason && (
            <span className="social-overlay__suggested-reason">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, opacity: 0.6 }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              {suggestion.reason}
            </span>
          )}
        </div>
      </div>
      <button
        className={`social-overlay__add-friend-btn ${added ? '--added' : ''}`}
        onClick={(e) => { e.stopPropagation(); setAdded(true); }}
        disabled={added}
      >
        {added ? (
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path d="M4 10L8.5 14.5L16 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        )}
        {added ? 'Sent' : 'Add'}
      </button>
    </div>
  );
}

function FindFriendsPanel() {
  const [copied, setCopied] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const handleShareLink = async () => {
    const url = window.location.origin;

    try {
      await navigator.share({
        title: 'Join my game!',
        text: 'Come play with me!',
        url,
      });
    } catch (err) {
      // User cancelled or share not supported — fall back to clipboard
      if (err.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          // Last resort fallback
          const textarea = document.createElement('textarea');
          textarea.value = url;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        }
      }
    }
  };

  return (
    <div className="social-overlay__find-friends">
      <div className="social-overlay__find-section">
        <button
          className={`social-overlay__invite-link-btn ${copied ? '--copied' : ''}`}
          onClick={handleShareLink}
        >
          <div className="social-overlay__invite-link-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
            </svg>
          </div>
          <div className="social-overlay__invite-link-text">
            <span className="social-overlay__invite-link-title">
              {copied ? 'Link Copied!' : 'Invite Friends'}
            </span>
            <span className="social-overlay__invite-link-sub">
              {copied ? 'Share it with your friends' : 'Share a link off-platform'}
            </span>
          </div>
          <div className="social-overlay__invite-link-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
            </svg>
          </div>
        </button>
      </div>

      <div className="social-overlay__find-divider">
        <span>or</span>
      </div>

      <div className="social-overlay__find-section">
        <div className={`social-overlay__search-input-wrap ${searchFocused ? '--focused' : ''}`}>
          <svg className="social-overlay__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            className="social-overlay__search-input"
            placeholder="Search by username..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchValue && (
            <button className="social-overlay__search-clear" onClick={() => setSearchValue('')}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M6 6L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M14 6L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        {searchValue && (
          <div className="social-overlay__search-empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.2 }}>
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <span>No results for "{searchValue}"</span>
          </div>
        )}
      </div>
    </div>
  );
}

function FriendsPanel({ friends, partyMode, partyMembers, onStartParty, onCancelParty, onToggleMember, onConfirmParty, currentStep, onInvite }) {
  const [friendsTab, setFriendsTab] = useState('friends');
  const sorted = sortByPresence(friends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null); // 'request' | 'suggested'
  const isSelecting = partyMode === 'selecting';

  const tabs = [
    { key: 'friends', label: 'My Friends', count: friends.length },
    { key: 'requests', label: 'Requests', badge: MOCK_FRIEND_REQUESTS.length },
    { key: 'suggested', label: 'Suggested' },
    { key: 'find', label: 'Find Friends' },
  ];

  const handleFriendClick = (friend) => {
    if (isSelecting) {
      if (!friend.online) return; // can't select offline friends
      onToggleMember(friend);
    } else {
      setSelectedFriend(friend);
    }
  };

  return (
    <div className="social-overlay__friends-panel">
      {/* Sub-tabs — hidden during party selection */}
      {!isSelecting && (
        <div className="social-overlay__friends-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`social-overlay__friends-tab ${friendsTab === tab.key ? '--active' : ''}`}
              onClick={() => setFriendsTab(tab.key)}
            >
              {tab.label}
              {tab.count != null && (
                <span className="social-overlay__friends-tab-count">{tab.count}</span>
              )}
              {tab.badge > 0 && (
                <span className="social-overlay__friends-tab-badge">{tab.badge}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Party Creation Bar — below tabs, above list (only on My Friends sub-tab, only in step 1) */}
      {(friendsTab === 'friends' || isSelecting) && (currentStep === 1 || isSelecting) && <motion.div className="party-bar" layout>
        {!isSelecting ? (
          <motion.button
            className="party-bar__create-btn"
            onClick={onStartParty}
            layout
            key="create"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            Create a Group
          </motion.button>
        ) : (
          <motion.div className="party-bar__selecting" layout key="selecting">
            <button className="party-bar__cancel-btn" onClick={onCancelParty}>
              Cancel
            </button>
            <span className="party-bar__count">
              {partyMembers.length}/{MAX_PARTY_SIZE} selected
            </span>
            <button
              className={`party-bar__next-btn ${partyMembers.length > 0 ? '--active' : ''}`}
              onClick={onConfirmParty}
              disabled={partyMembers.length === 0}
            >
              Next
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </motion.div>
        )}
      </motion.div>}

      <div className="social-overlay__friends-list">
        {(friendsTab === 'friends' || isSelecting) && (
          <AnimatePresence>
            {sorted.map((friend) => {
              const isSelected = partyMembers.some((m) => m.id === friend.id);
              const isMaxed = partyMembers.length >= MAX_PARTY_SIZE && !isSelected;
              const isDisabled = isSelecting && (!friend.online || isMaxed);

              return (
                <motion.div
                  key={friend.id}
                  layout
                  initial={friend._new ? { opacity: 0, x: -20 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: [0.32, 0.94, 0.6, 1] }}
                >
                  <div
                    className={`social-overlay__friend-item ${isSelecting ? '--selectable' : ''} ${isSelected ? '--selected' : ''} ${isDisabled ? '--disabled' : ''}`}
                    onClick={() => handleFriendClick(friend)}
                    style={{ cursor: isDisabled ? 'default' : 'pointer' }}
                  >
                    <div className="social-overlay__friend-left">
                      <div className="social-overlay__friend-avatar">
                        {friend.avatar ? (
                          <img src={friend.avatar} alt={friend.name} />
                        ) : (
                          <div className="social-overlay__friend-avatar-placeholder" />
                        )}
                      </div>
                      <div className="social-overlay__friend-text">
                        <span className="social-overlay__friend-name">{friend.name}</span>
                        <span className="social-overlay__friend-stats">
                          <strong>{friend.friends}</strong> {friend.friends === 1 ? 'Friend' : 'Friends'}.{' '}
                          <strong>{friend.games}</strong> {friend.games === 1 ? 'Game' : 'Games'}
                        </span>
                      </div>
                    </div>
                    {isSelecting ? (
                      <motion.div
                        className={`party-select-check ${isSelected ? '--checked' : ''}`}
                        initial={false}
                        animate={isSelected ? { scale: [0.8, 1.1, 1] } : { scale: 1 }}
                        transition={{ duration: 0.25, ease: [0.32, 0.94, 0.6, 1] }}
                      >
                        {isSelected && (
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                            <path d="M4 10L8.5 14.5L16 6.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </motion.div>
                    ) : (
                      <div className={`social-overlay__friend-status ${friend.online ? '--online' : '--offline'}`}>
                        <span className="social-overlay__friend-status-dot" />
                        <span>{friend.online ? 'Online' : 'Offline'}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        {!isSelecting && friendsTab === 'requests' &&
          MOCK_FRIEND_REQUESTS.map((request, i) => (
            <FriendRequestItem key={i} request={request} onClick={() => { setSelectedSuggestion(request); setSelectedSource('request'); }} />
          ))}
        {!isSelecting && friendsTab === 'suggested' &&
          MOCK_SUGGESTED_FRIENDS.map((suggestion, i) => (
            <SuggestedFriendItem key={i} suggestion={suggestion} onClick={() => { setSelectedSuggestion(suggestion); setSelectedSource('suggested'); }} />
          ))}
        {!isSelecting && friendsTab === 'find' && <FindFriendsPanel />}
      </div>
      <AnimatePresence>
        {selectedFriend && (
          <PlayerCardModal
            friend={selectedFriend}
            onClose={() => setSelectedFriend(null)}
            onInvite={onInvite}
          />
        )}
        {selectedSuggestion && (
          <SuggestedProfileModal
            suggestion={selectedSuggestion}
            source={selectedSource}
            onClose={() => { setSelectedSuggestion(null); setSelectedSource(null); }}
            onInvite={onInvite}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const MOCK_ACHIEVEMENTS = [
  { id: 'ach-1', title: 'Pizza Time!', game: "TMNT: Shredder's Revenge", desc: 'Eat 50 pizzas', date: 'Today', unlocked: true },
  { id: 'ach-2', title: 'Cowabunga!', game: "TMNT: Shredder's Revenge", desc: 'Complete Stage 1 without taking damage', date: 'Yesterday', unlocked: true },
  { id: 'ach-3', title: 'Shell Shocked', game: "TMNT: Shredder's Revenge", desc: 'Defeat 100 Foot Clan soldiers', date: '3 days ago', unlocked: true },
  { id: 'ach-4', title: 'Hat Trick', game: 'FIFA', desc: 'Score 3 goals in a single match', date: null, unlocked: false },
  { id: 'ach-5', title: 'Clean Sheet', game: 'FIFA', desc: 'Win a match without conceding', date: null, unlocked: false },
];

function AchievementsPanel() {
  const unlocked = MOCK_ACHIEVEMENTS.filter((a) => a.unlocked);
  const locked = MOCK_ACHIEVEMENTS.filter((a) => !a.unlocked);

  return (
    <div className="social-overlay__achievements-panel">
      <h3 className="social-overlay__achievements-header">
        Achievements <span className="social-overlay__achievements-count">{unlocked.length}/{MOCK_ACHIEVEMENTS.length}</span>
      </h3>

      <div className="social-overlay__achievements-list">
        {unlocked.map((ach) => (
          <div key={ach.id} className="social-overlay__achievement-item --unlocked">
            <div className="social-overlay__achievement-icon --unlocked">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
            <div className="social-overlay__achievement-text">
              <span className="social-overlay__achievement-title">{ach.title}</span>
              <span className="social-overlay__achievement-desc">{ach.desc}</span>
              <span className="social-overlay__achievement-meta">{ach.game} &bull; {ach.date}</span>
            </div>
          </div>
        ))}

        {locked.length > 0 && (
          <div className="social-overlay__achievements-locked-header">Locked</div>
        )}
        {locked.map((ach) => (
          <div key={ach.id} className="social-overlay__achievement-item --locked">
            <div className="social-overlay__achievement-icon --locked">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
            </div>
            <div className="social-overlay__achievement-text">
              <span className="social-overlay__achievement-title">{ach.title}</span>
              <span className="social-overlay__achievement-desc">{ach.desc}</span>
              <span className="social-overlay__achievement-meta">{ach.game}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThreeDotsVertical() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3" r="1.5" fill="white" />
      <circle cx="8" cy="8" r="1.5" fill="white" />
      <circle cx="8" cy="13" r="1.5" fill="white" />
    </svg>
  );
}

const TOAST_DURATION_MS = 5000;

function InviteToast({ toast, onDismiss, onTap }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, TOAST_DURATION_MS);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  const handleDragEnd = (_e, info) => {
    if (info.offset.y < -40 || info.velocity.y < -300) {
      onDismiss();
    }
  };

  const isInvite = toast.variant === 'invite';

  return (
    <div className="invite-toast-wrap">
      <motion.div
        className="invite-toast"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -60, transition: { duration: 0.2 } }}
        transition={{ duration: 0.3, ease: [0.32, 0.94, 0.6, 1] }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.6, bottom: 0 }}
        onDragEnd={handleDragEnd}
        onClick={onTap ? () => onTap(toast) : undefined}
        style={onTap ? { cursor: 'pointer' } : undefined}
      >
        <div className="invite-toast__drag-handle" />
        <div className="invite-toast__icon-wrap">
          <div className="invite-toast__app-icon">
            <img src="/images/fifa-app.png" alt="FIFA" />
          </div>
          <div className="invite-toast__unread-dot" />
          {toast.avatar && (
            <div className="invite-toast__avatar">
              <img src={toast.avatar} alt={toast.name} />
            </div>
          )}
        </div>
        <div className="invite-toast__text">
          <span className="invite-toast__time">NOW</span>
          <span className="invite-toast__message">
            {isInvite ? (
              <><strong>{toast.name}</strong> invited you to play FIFA</>
            ) : (
              <><strong>{toast.name}</strong> accepted your invitation to play!</>
            )}
          </span>
        </div>
        <button
          className="invite-toast__close"
          aria-label="Dismiss notification"
          onClick={(e) => { e.stopPropagation(); onDismiss(); }}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
}

export default function SocialOverlay({ isVisible, onClose }) {
  const { profileData } = useDataContext();
  const {
    currentStep,
    homeInviteFired,
    setHomeInviteFired,
    setPendingInvite,
    setInvitePanelOpen,
    setInvitePanelTab,
    setInvitePanelView,
    setHasUnreadNotification,
    activeToast,
    setActiveToast,
    addPartyMember,
  } = useUIContext();
  const [activeTab, setActiveTab] = useState('Home');
  const [friends, setFriends] = useState(MOCK_FRIENDS);
  const [partyMode, setPartyMode] = useState('idle'); // idle | selecting | formed
  const [partyMembers, setPartyMembers] = useState([]);
  const pendingToastTimers = useRef([]);

  useEffect(() => () => {
    pendingToastTimers.current.forEach(clearTimeout);
    pendingToastTimers.current = [];
  }, []);

  const handleInvite = useCallback((friend) => {
    const timer = setTimeout(() => {
      setActiveToast({
        id: `${friend.id}-${Date.now()}`,
        name: friend.name,
        avatar: friend.avatar,
      });
      addPartyMember({
        id: friend.id ?? friend.name,
        name: friend.name,
        avatar: friend.avatar,
      });
    }, 2000);
    pendingToastTimers.current.push(timer);
  }, [addPartyMember]);

  const dismissToast = useCallback(() => {
    if (activeToast?.variant === 'invite') {
      setHasUnreadNotification(true);
    }
    setActiveToast(null);
  }, [activeToast, setActiveToast, setHasUnreadNotification]);

  // At step 1 (home page — FIFA billboard), fire a one-shot 5s invite
  // notification. The homeInviteFired flag (reset in controller-index when
  // step leaves 1) prevents re-firing if the user closes and reopens the hub
  // while staying on step 1.
  useEffect(() => {
    if (currentStep !== 1 || homeInviteFired) return;
    const inviter =
      MOCK_FRIENDS.find((f) => f.online && f.name !== profileData) ||
      MOCK_FRIENDS.find((f) => f.name !== profileData);
    if (!inviter) return;
    const timer = setTimeout(() => {
      const invite = {
        id: `home-invite-${Date.now()}`,
        name: inviter.name,
        avatar: inviter.avatar,
      };
      setPendingInvite(invite);
      setActiveToast({ ...invite, variant: 'invite' });
      setHomeInviteFired(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentStep, homeInviteFired, profileData, setHomeInviteFired, setPendingInvite]);

  const handleInviteToastTap = useCallback(() => {
    setActiveToast(null);
    setInvitePanelTab('notifications');
    setInvitePanelView('detail');
    setInvitePanelOpen(true);
  }, [setInvitePanelOpen, setInvitePanelTab, setInvitePanelView]);

  const startPartyMode = useCallback(() => {
    setPartyMode('selecting');
    setPartyMembers([]);
  }, []);

  const cancelPartyMode = useCallback(() => {
    setPartyMode('idle');
    setPartyMembers([]);
  }, []);

  const togglePartyMember = useCallback((friend) => {
    setPartyMembers((prev) => {
      const exists = prev.find((m) => m.id === friend.id);
      if (exists) return prev.filter((m) => m.id !== friend.id);
      if (prev.length >= MAX_PARTY_SIZE) return prev;
      return [...prev, friend];
    });
  }, []);

  const confirmParty = useCallback(() => {
    setPartyMode('formed');
  }, []);

  // Randomly toggle each friend's presence every 20s
  useEffect(() => {
    const interval = setInterval(() => {
      setFriends((prev) =>
        prev.map((f) => ({
          ...f,
          _new: false,
          online: Math.random() > 0.5,
        }))
      );
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const selectedProfile = PROFILES.find((p) => p.name === profileData);
  const avatar = selectedProfile?.avatar;

  const visibleFriends = friends.filter((f) => f.name !== profileData);

  return (
    <>
      {/* Toast portal lives outside the overlay so it can fire when the
          social overlay isn't open (e.g. invites accepted from the
          right-panel friends list while the overlay is closed). */}
      {createPortal(
        <AnimatePresence>
          {activeToast && (
            <InviteToast
              key={activeToast.id}
              toast={activeToast}
              onDismiss={dismissToast}
              onTap={activeToast.variant === 'invite' ? handleInviteToastTap : undefined}
            />
          )}
        </AnimatePresence>,
        document.body
      )}

      <AnimatePresence>
        {isVisible && (
          <div className="social-overlay">

            {/* Controller icon at the top of the overlay */}
            {/* Main body */}
            <div className="social-overlay__body">
              <div className="social-overlay__bg" />
            </div>

            {/* Glow — sits above body+wings, clipped around the notch gap */}
            <div className="social-overlay__glow" />

            {/* Top Navbar */}
            <div className="social-overlay__navbar">
              <div className="social-overlay__navbar-pill">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    className={`social-overlay__navbar-item ${activeTab === tab ? '--active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                    aria-label={tab}
                  >
                    {activeTab === tab && (
                      <motion.span
                        className="social-overlay__navbar-item-bg"
                        layoutId="navbar-active-pill"
                        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                      />
                    )}
                    {tab === 'Profile' ? (
                      <div className="social-overlay__navbar-avatar">
                        {avatar ? (
                          <img src={avatar} alt="Profile" />
                        ) : (
                          <div className="social-overlay__navbar-avatar-placeholder" />
                        )}
                      </div>
                    ) : (
                      TAB_ICONS[tab]
                    )}
                    {activeTab === tab && tab !== 'Profile' && (
                      <motion.span
                        className="social-overlay__navbar-item-label"
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.18, delay: 0.12 }}
                      >
                        {tab}
                      </motion.span>
                    )}
                  </button>
                ))}
              </div>
              {/* Profile + bell live in <SocialControllerHeader />, which sits
                  above this overlay and slides in from the controller view. */}
            </div>

            {/* Dashboard Content */}
          <div className={`social-overlay__content ${activeTab === 'Home' ? '--home' : ''}`}>
            {activeTab === 'Home' && (
              <>
                <ProfileCard profileData={profileData} onClose={onClose} currentStep={currentStep} onNavigateToFriends={() => setActiveTab('Friends')} />
                <HomeFriendsList friends={visibleFriends} onNavigateToFriends={() => setActiveTab('Friends')} onInvite={handleInvite} />
              </>
            )}
            {activeTab === 'Friends' && (
              <FriendsPanel
                friends={visibleFriends}
                partyMode={partyMode}
                partyMembers={partyMembers}
                onStartParty={startPartyMode}
                onCancelParty={cancelPartyMode}
                onToggleMember={togglePartyMember}
                onConfirmParty={confirmParty}
                currentStep={currentStep}
                onInvite={handleInvite}
              />
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
