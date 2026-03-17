import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataContext } from '@/contexts/data';
import { PROFILES } from '../pages/profile-picker/profile-picker';
import RotateDevice from '../assets/rotate-device.gif';
import './social-overlay.scss';

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
    <div className="social-overlay__notif-item">
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
    </div>
  );
}

function NotificationsPanel() {
  return (
    <div className="social-overlay__notifications">
      <h3 className="social-overlay__notif-header">Notifications</h3>
      <div className="social-overlay__notif-list">
        <NotificationItem
          avatar={PROFILES[1]?.avatar}
          name="Michael"
          subtitle="Sent you a friend request"
          actions={
            <>
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
            </>
          }
        />
        <NotificationItem
          avatar={PROFILES[3]?.avatar}
          name="Kalisha"
          subtitle="Messaged you"
          actions={<ChevronRight />}
        />
        <NotificationItem
          avatar={null}
          name="Achievement Unlocked"
          subtitle="TMNT: Shredder's Revenge"
          actions={<ChevronRight />}
        />
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
  { name: 'LilnMiso', avatar: PROFILES[0]?.avatar, friends: 24, games: 8, online: true },
  { name: 'Mudkip', avatar: PROFILES[1]?.avatar, friends: 145, games: 133, online: false },
  { name: 'GeryRiviera', avatar: PROFILES[2]?.avatar, friends: 0, games: 1, online: true },
  { name: 'Ciriously', avatar: PROFILES[3]?.avatar, friends: 12, games: 6, online: false },
  { name: 'Play as Guest', avatar: PROFILES[4]?.avatar, friends: 72, games: 54, online: false },
  { name: 'LilnMiso', avatar: PROFILES[0]?.avatar, friends: 1, games: 62, online: true },
  { name: 'Mudkip', avatar: PROFILES[1]?.avatar, friends: 271, games: 124, online: true },
  { name: 'GeryRiviera', avatar: PROFILES[2]?.avatar, friends: 3, games: 6, online: false },
];

function FriendItem({ friend }) {
  return (
    <div className="social-overlay__friend-item">
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

function FriendsPanel() {
  const [friendsTab, setFriendsTab] = useState('friends');

  return (
    <div className="social-overlay__friends-panel">
      <div className="social-overlay__friends-tabs">
        <button
          className={`social-overlay__friends-tab ${friendsTab === 'friends' ? '--active' : ''}`}
          onClick={() => setFriendsTab('friends')}
        >
          My Friends
          <span className="social-overlay__friends-tab-count">{MOCK_FRIENDS.length}</span>
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
        {friendsTab === 'friends' &&
          MOCK_FRIENDS.map((friend, i) => <FriendItem key={i} friend={friend} />)}
        {friendsTab === 'requests' &&
          MOCK_FRIEND_REQUESTS.map((request, i) => <FriendRequestItem key={i} request={request} />)}
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

export default function SocialOverlay({ isVisible, onClose }) {
  const { profileData } = useDataContext();
  const [activeTab, setActiveTab] = useState('Home');

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
                <NotificationsPanel />
              </>
            )}
            {activeTab === 'Friends' && <FriendsPanel />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
