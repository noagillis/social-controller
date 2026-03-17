import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataContext } from '@/contexts/data';
import { useSendMessage } from '@/controller/hooks/use-send-message';
import { PROFILES } from '../pages/profile-picker/profile-picker';
import RotateDevice from '../assets/rotate-device.gif';
import './social-overlay.scss';

const RANDOM_NAMES = [
  'Michael', 'Sophia', 'Jayden', 'Aaliyah', 'Ethan', 'Chloe', 'Mason', 'Zara',
  'Liam', 'Priya', 'Noah', 'Mei', 'Aiden', 'Luna', 'Kai', 'Amara',
  'Felix', 'Nia', 'Oscar', 'Yuki', 'Dante', 'Suki', 'Ravi', 'Ines',
];

let _nameIndex = 0;
function getNextRandomRequest() {
  const name = RANDOM_NAMES[_nameIndex % RANDOM_NAMES.length];
  const avatar = PROFILES[_nameIndex % PROFILES.length]?.avatar;
  _nameIndex++;
  return {
    id: `fr-${_nameIndex}-${Date.now()}`,
    name,
    avatar,
  };
}

function sortByPresence(friends) {
  return [...friends].sort((a, b) => {
    if (a.online === b.online) return 0;
    return a.online ? -1 : 1;
  });
}

const TABS = ['Home', 'Friends', 'Achievements', 'Discover'];

const TAB_ICONS = {
  Home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
    </svg>
  ),
  Friends: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
  Achievements: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  ),
  Discover: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  ),
};

function ProfileCard({ profileData, onClose }) {
  const selectedProfile = PROFILES.find((p) => p.name === profileData);
  const avatar = selectedProfile?.avatar;
  const name = profileData || 'Player';

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
            {avatar && <img src={avatar} alt="" />}
          </div>
          <div className="social-overlay__now-playing-text">
            <span className="social-overlay__now-playing-label">Currently Playing</span>
            <span className="social-overlay__now-playing-title">TMNT: Shredder&apos;s Revenge</span>
          </div>
        </div>
        <div className="social-overlay__now-playing-art" />
        <button className="social-overlay__resume-btn" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
          Resume
        </button>
      </div>
    </div>
  );
}

function NotificationItem({ avatar, name, subtitle, actions }) {
  return (
    <motion.div
      className="social-overlay__notif-item"
      layout
      initial={{ opacity: 1, height: 'auto' }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0, padding: 0, margin: 0, overflow: 'hidden' }}
      transition={{ duration: 0.35, ease: [0.32, 0.94, 0.6, 1] }}
    >
      <div className="social-overlay__notif-left">
        <div className="social-overlay__notif-avatar">
          {avatar ? (
            <img src={avatar} alt={name} />
          ) : (
            <div className="social-overlay__notif-avatar-placeholder" />
          )}
        </div>
        <div className="social-overlay__notif-text">
          <span className="social-overlay__notif-name">{name}</span>
          <span className="social-overlay__notif-sub">{subtitle}</span>
        </div>
      </div>
      <div className="social-overlay__notif-actions">{actions}</div>
    </motion.div>
  );
}

function ConfirmationNotification({ message, type }) {
  return (
    <motion.div
      className={`social-overlay__notif-item social-overlay__notif-confirmation --${type}`}
      layout
      initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
      animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
      exit={{ opacity: 0, height: 0, padding: 0, margin: 0, overflow: 'hidden' }}
      transition={{ duration: 0.35, ease: [0.32, 0.94, 0.6, 1] }}
    >
      <div className="social-overlay__notif-left">
        <div className={`social-overlay__notif-confirm-icon --${type}`}>
          {type === 'accepted' ? (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M4 10L8.5 14.5L16 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M6 6L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M14 6L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <div className="social-overlay__notif-text">
          <span className="social-overlay__notif-name">{message}</span>
        </div>
      </div>
    </motion.div>
  );
}

function NotificationsPanel({ onFriendRequestAction, onNavigateTab }) {
  const [confirmations, setConfirmations] = useState([]);
  const [pendingRequests, setPendingRequests] = useState(() => [getNextRandomRequest()]);

  const handleAction = useCallback((request, action) => {
    // Replace with a new random request
    setPendingRequests((prev) =>
      prev.map((r) => (r.id === request.id ? getNextRandomRequest() : r))
    );

    const confirmation = {
      id: `confirm-${request.id}`,
      message: action === 'accepted'
        ? `You and ${request.name} are now friends!`
        : `Friend request from ${request.name} declined`,
      type: action,
    };
    setConfirmations((prev) => [...prev, confirmation]);

    if (action === 'accepted') {
      onFriendRequestAction({
        name: request.name,
        avatar: request.avatar,
        friends: Math.floor(Math.random() * 200) + 1,
        games: Math.floor(Math.random() * 50) + 1,
        online: Math.random() > 0.4,
      });
    }

    setTimeout(() => {
      setConfirmations((prev) => prev.filter((c) => c.id !== confirmation.id));
    }, 4000);
  }, [onFriendRequestAction]);

  return (
    <div className="social-overlay__notifications">
      <h3 className="social-overlay__notif-header">Notifications</h3>
      <div className="social-overlay__notif-list">
        <AnimatePresence mode="popLayout">
          {pendingRequests.map((request) => (
            <NotificationItem
              key={request.id}
              avatar={request.avatar}
              name={request.name}
              subtitle="Sent you a friend request"
              actions={
                <>
                  <button
                    className="social-overlay__notif-circle-btn --reject"
                    onClick={() => handleAction(request, 'declined')}
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M6 6L14 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <path d="M14 6L6 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button
                    className="social-overlay__notif-circle-btn --accept"
                    onClick={() => handleAction(request, 'accepted')}
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10L8.5 14.5L16 6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </>
              }
            />
          ))}
          {confirmations.map((c) => (
            <ConfirmationNotification key={c.id} message={c.message} type={c.type} />
          ))}
        </AnimatePresence>
        <NotificationItem
          avatar={PROFILES[3]?.avatar}
          name="Kalisha"
          subtitle="Messaged you"
          actions={<ChevronRight />}
        />
        <div onClick={() => onNavigateTab('Achievements')} style={{ cursor: 'pointer' }}>
          <NotificationItem
            avatar={null}
            name="Achievement Unlocked"
            subtitle="TMNT: Shredder's Revenge"
            actions={<ChevronRight />}
          />
        </div>
      </div>
    </div>
  );
}

const MOCK_FRIEND_REQUESTS = [
  { name: 'xXShadowLordXx', avatar: PROFILES[1]?.avatar, mutualFriends: 3, timeAgo: '2h ago' },
  { name: 'PixelQueen99', avatar: PROFILES[3]?.avatar, mutualFriends: 7, timeAgo: '5h ago' },
  { name: 'TurboNick', avatar: null, mutualFriends: 1, timeAgo: '1d ago' },
  { name: 'CozyGamerVal', avatar: PROFILES[2]?.avatar, mutualFriends: 0, timeAgo: '3d ago' },
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

function FriendItem({ friend, onClick }) {
  return (
    <div className="social-overlay__friend-item" onClick={onClick} style={{ cursor: 'pointer' }}>
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
      <div className={`social-overlay__friend-status ${friend.online ? '--online' : '--offline'}`}>
        <span className="social-overlay__friend-status-dot" />
        <span>{friend.online ? 'Online' : 'Offline'}</span>
      </div>
    </div>
  );
}

function FriendRequestItem({ request }) {
  return (
    <div className="social-overlay__friend-item">
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
      <div className="social-overlay__notif-actions">
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

function PlayerCardModal({ friend, onClose }) {
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

          <div className="player-card__stats-row">
            <div className="player-card__stat">
              <span className="player-card__stat-value">{friend.friends}</span>
              <span className="player-card__stat-label">Friends</span>
            </div>
            <div className="player-card__stat-divider" />
            <div className="player-card__stat">
              <span className="player-card__stat-value">{friend.games}</span>
              <span className="player-card__stat-label">Games</span>
            </div>
            <div className="player-card__stat-divider" />
            <div className="player-card__stat">
              <span className="player-card__stat-value">{Math.floor(Math.random() * 30) + 1}</span>
              <span className="player-card__stat-label">Achievements</span>
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
          <button className="player-card__secondary-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
            </svg>
            Message
          </button>
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FriendsPanel({ friends }) {
  const [friendsTab, setFriendsTab] = useState('friends');
  const sorted = sortByPresence(friends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  return (
    <div className="social-overlay__friends-panel">
      <div className="social-overlay__friends-tabs">
        <button
          className={`social-overlay__friends-tab ${friendsTab === 'friends' ? '--active' : ''}`}
          onClick={() => setFriendsTab('friends')}
        >
          My Friends
          <span className="social-overlay__friends-tab-count">{friends.length}</span>
        </button>
        <button
          className={`social-overlay__friends-tab ${friendsTab === 'requests' ? '--active' : ''}`}
          onClick={() => setFriendsTab('requests')}
        >
          Requests
          {MOCK_FRIEND_REQUESTS.length > 0 && (
            <span className="social-overlay__friends-tab-badge">{MOCK_FRIEND_REQUESTS.length}</span>
          )}
        </button>
      </div>
      <div className="social-overlay__friends-list">
        {friendsTab === 'friends' && (
          <AnimatePresence>
            {sorted.map((friend) => (
              <motion.div
                key={friend.id}
                layout
                initial={friend._new ? { opacity: 0, x: -20 } : false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.32, 0.94, 0.6, 1] }}
              >
                <FriendItem friend={friend} onClick={() => setSelectedFriend(friend)} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {friendsTab === 'requests' &&
          MOCK_FRIEND_REQUESTS.map((request, i) => <FriendRequestItem key={i} request={request} />)}
      </div>
      <AnimatePresence>
        {selectedFriend && (
          <PlayerCardModal
            friend={selectedFriend}
            onClose={() => setSelectedFriend(null)}
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

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

let _friendIdCounter = 100;

export default function SocialOverlay({ isVisible, onClose }) {
  const { profileData } = useDataContext();
  const [activeTab, setActiveTab] = useState('Home');
  const [friends, setFriends] = useState(MOCK_FRIENDS);

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

  const handleFriendRequestAccepted = useCallback((newFriend) => {
    const id = `f-new-${_friendIdCounter++}`;
    setFriends((prev) => [{ ...newFriend, id, _new: true }, ...prev]);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="social-overlay"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.32, 0.94, 0.6, 1] }}
        >
          <div className="social-overlay__bg" />
          <div className="social-overlay__glow" />

          {/* Top Bar */}
          <div className="social-overlay__topbar">
            <div className="social-overlay__logo">
              <span className="social-overlay__logo-netflix">NETFLIX</span>
              <span className="social-overlay__logo-games">GAMES</span>
            </div>

            <div className="social-overlay__tabs">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`social-overlay__tab ${activeTab === tab ? '--active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {TAB_ICONS[tab]}
                  <span>{tab}</span>
                </button>
              ))}
            </div>

            <div className="social-overlay__topbar-actions">
              <button className="social-overlay__topbar-btn" aria-label="Menu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
                </svg>
              </button>
              <button className="social-overlay__topbar-btn" onClick={onClose} aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M15 5L5 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Rotate prompt (portrait only, Home tab) */}
          {activeTab === 'Home' && (
            <div className="social-overlay__rotate-prompt">
              <img src={RotateDevice} alt="Rotate device" />
              <span>Please rotate your device to landscape mode</span>
            </div>
          )}

          {/* Dashboard Content */}
          <div className="social-overlay__content">
            {activeTab === 'Home' && (
              <>
                <ProfileCard profileData={profileData} onClose={onClose} />
                <NotificationsPanel onFriendRequestAction={handleFriendRequestAccepted} onNavigateTab={setActiveTab} />
              </>
            )}
            {activeTab === 'Friends' && <FriendsPanel friends={friends} />}
            {activeTab === 'Achievements' && <AchievementsPanel />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
