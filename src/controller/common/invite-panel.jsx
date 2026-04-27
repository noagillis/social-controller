import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIContext } from '@/contexts/ui';
import { useDataContext } from '@/contexts/data';
import { useSendMessage } from '@/controller/hooks/use-send-message';
import { PROFILES } from '@/controller/pages/profile-picker/profile-picker';
import './invite-panel.scss';

function PeopleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
  );
}

function BackArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

const MOCK_NOTIFICATIONS = [
  { id: 'mock-n-1', name: 'GameHandle12345', game: 'GameName' },
  { id: 'mock-n-2', name: 'GameHandle12345', game: 'GameName' },
];

function NotificationsListCard({ activeInvite, onSelectInvite }) {
  return (
    <div className="invite-panel__list-card">
      <div className="invite-panel__list-header">
        <span>Notifications</span>
      </div>

      {activeInvite && (
        <button
          className="invite-panel__list-item"
          onClick={onSelectInvite}
        >
          <div className="invite-panel__list-item-text">
            <span className="invite-panel__list-item-title">New game invitation</span>
            <span className="invite-panel__list-item-subtitle">
              {activeInvite.name} invited you to play FIFA
            </span>
          </div>
          <ChevronRight />
        </button>
      )}

      <div className="invite-panel__list-item --disabled">
        <div className="invite-panel__list-item-text">
          <span className="invite-panel__list-item-title">New achievement unlocked</span>
          <span className="invite-panel__list-item-subtitle">
            You earned the &ldquo;First Match&rdquo; badge in FIFA
          </span>
        </div>
      </div>

      {MOCK_NOTIFICATIONS.map((n) => (
        <div key={n.id} className="invite-panel__list-item --disabled">
          <div className="invite-panel__list-item-text">
            <span className="invite-panel__list-item-title">New game invitation</span>
            <span className="invite-panel__list-item-subtitle">
              {n.name} wants you to play {n.game}
            </span>
          </div>
          <ChevronRight />
        </div>
      ))}
    </div>
  );
}

function InviteCard({ invite, onBack, onAccept, onIgnore, onViewProfile }) {
  return (
    <div className="invite-panel__card">
      <button className="invite-panel__back" onClick={onBack} aria-label="Back">
        <BackArrow />
        <span>Back</span>
      </button>

      <div className="invite-panel__hero">
        <div className="invite-panel__game-icon">
          <img src="/images/fifa-app.png" alt="FIFA" />
        </div>
        {invite.avatar && (
          <div className="invite-panel__inviter-avatar">
            <img src={invite.avatar} alt={invite.name} />
          </div>
        )}
      </div>

      <h2 className="invite-panel__title">Play FIFA and Join Party?</h2>
      <p className="invite-panel__subtitle">
        You will be able to play with and chat with other players
      </p>

      <div className="invite-panel__actions">
        <button className="invite-panel__action" onClick={onAccept}>
          Accept Request
        </button>
        <button className="invite-panel__action" onClick={onIgnore}>
          Ignore Request
        </button>
        <button className="invite-panel__action" onClick={onViewProfile}>
          View {invite.name}&rsquo;s Profile
        </button>
      </div>
    </div>
  );
}

function MicIcon({ muted }) {
  if (muted) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
        <line x1="12" y1="19" x2="12" y2="23" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
    </svg>
  );
}

function CallEndIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.957.957 0 0 1-.29-.7c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.1-.7-.28a11.27 11.27 0 0 0-2.67-1.85.996.996 0 0 1-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

function PartyMemberRow({ member }) {
  return (
    <div className="invite-panel__party-row">
      <div className="invite-panel__party-avatar">
        {member.avatar ? (
          <img src={member.avatar} alt={member.name} />
        ) : (
          <div className="invite-panel__party-avatar-placeholder" />
        )}
      </div>
      <span className="invite-panel__party-name">{member.name}</span>
      <button className="invite-panel__party-volume-btn" aria-label="Adjust volume">
        <VolumeIcon />
      </button>
    </div>
  );
}

function UserAddIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

const MOCK_INVITE_FRIENDS = [
  { id: 'inv-mudkip', name: 'Mudkip', avatar: PROFILES[1]?.avatar, online: true, playing: 'Overcooked' },
  { id: 'inv-gamehandle', name: 'GameHandle', avatar: PROFILES[3]?.avatar, online: false, playing: null },
  { id: 'inv-lilnmiso', name: 'LilnMiso', avatar: PROFILES[0]?.avatar, online: true, playing: 'FIFA' },
  { id: 'inv-geryriviera', name: 'GeryRiviera', avatar: PROFILES[2]?.avatar, online: true, playing: "TMNT: Shredder's Revenge" },
  { id: 'inv-ciriously', name: 'Ciriously', avatar: PROFILES[4]?.avatar, online: false, playing: null },
];

const INVITE_DELAY_MS = 5000;

function InviteFriendRow({ friend }) {
  const [inviteState, setInviteState] = useState('idle'); // idle | sending | sent
  const sendMessage = useSendMessage();
  const { profileData } = useDataContext();
  const { addPartyMember, setActiveToast } = useUIContext();
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  const status = friend.online
    ? (friend.playing ? `Playing ${friend.playing}` : 'Online')
    : 'Offline';

  const handleInvite = (e) => {
    e.stopPropagation();
    if (inviteState !== 'idle') return;
    setInviteState('sending');
    sendMessage('gameInvite', {
      fromPlayer: profileData || 'Player',
      toPlayer: friend.name,
      toAvatar: friend.avatar,
      game: 'FIFA',
    });
    // Schedule outside the component lifecycle so the user can close the
    // panel during the 5s delay and still see the toast + party stack update.
    setTimeout(() => {
      addPartyMember({ id: friend.id, name: friend.name, avatar: friend.avatar });
      setActiveToast({
        id: `invite-${friend.id}-${Date.now()}`,
        name: friend.name,
        avatar: friend.avatar,
      });
      if (mountedRef.current) setInviteState('sent');
    }, INVITE_DELAY_MS);
  };

  return (
    <div className="invite-panel__friends-row">
      <div className={`invite-panel__friends-identity ${friend.online ? '' : '--offline'}`}>
        <div className="invite-panel__party-avatar">
          {friend.avatar ? (
            <img src={friend.avatar} alt={friend.name} />
          ) : (
            <div className="invite-panel__party-avatar-placeholder" />
          )}
        </div>
        <div className="invite-panel__friends-text">
          <span className="invite-panel__friends-name">{friend.name}</span>
          <div className="invite-panel__friends-status">
            <span className={`invite-panel__friends-status-dot ${friend.online ? '--online' : '--offline'}`} />
            <span className="invite-panel__friends-status-label">{status}</span>
          </div>
        </div>
      </div>
      <button
        className={`invite-panel__friends-invite-btn ${inviteState !== 'idle' ? '--' + inviteState : ''}`}
        onClick={handleInvite}
        disabled={inviteState !== 'idle'}
      >
        {inviteState === 'idle' && 'Invite'}
        {inviteState === 'sending' && '...'}
        {inviteState === 'sent' && 'Sent'}
      </button>
    </div>
  );
}

function FriendsCard({ onBack }) {
  const { profileData } = useDataContext();
  const {
    partyMembers = [],
    setInvitePanelOpen,
    setSocialOverlayOpen,
    clearPartyMembers,
  } = useUIContext();
  const sendMessage = useSendMessage();
  const [muted, setMuted] = useState(false);
  const [view, setView] = useState('party'); // 'party' | 'invite-list'

  const selfProfile = PROFILES.find((p) => p.name === profileData);
  const selfAvatar = selfProfile?.avatar;
  const selfName = profileData || 'Player';

  const handleEndVoiceChat = () => {
    setInvitePanelOpen(false);
  };

  const handleLeaveParty = () => {
    sendMessage('requestExitGame', {});
    clearPartyMembers();
    setInvitePanelOpen(false);
    setSocialOverlayOpen(false);
  };

  if (view === 'invite-list') {
    const partyKeys = new Set(
      partyMembers.flatMap((m) => [m.id, m.name].filter(Boolean))
    );
    const invitable = MOCK_INVITE_FRIENDS
      .filter((f) => f.name !== profileData)
      .filter((f) => !partyKeys.has(f.id) && !partyKeys.has(f.name))
      .slice(0, 4);

    return (
      <div className="invite-panel__party-card">
        <div className="invite-panel__friends-header">
          <button
            className="invite-panel__friends-back-btn"
            onClick={() => setView('party')}
            aria-label="Back to party"
          >
            <ChevronLeftIcon />
          </button>
          <span className="invite-panel__party-header --inline">Friends</span>
        </div>

        <div className="invite-panel__friends-list-scroll">
          {invitable.map((friend) => (
            <InviteFriendRow key={friend.id} friend={friend} />
          ))}
        </div>

        <div className="invite-panel__party-footer">
          <button
            className="invite-panel__party-action-btn"
            onClick={() => setView('party')}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="invite-panel__party-card">
      <div className="invite-panel__party-header-row">
        <span className="invite-panel__party-header">Playing FIFA</span>
        <button
          className="invite-panel__party-invite-btn"
          onClick={() => setView('invite-list')}
          aria-label="Invite friends"
        >
          <UserAddIcon />
          <span>Invite</span>
        </button>
      </div>

      <div className="invite-panel__party-list">
        <div className="invite-panel__party-scroll">
          <div className="invite-panel__party-me">
            <div className="invite-panel__party-avatar">
              {selfAvatar ? (
                <img src={selfAvatar} alt={selfName} />
              ) : (
                <div className="invite-panel__party-avatar-placeholder" />
              )}
            </div>
            <span className="invite-panel__party-name">{selfName}</span>
            <button
              className={`invite-panel__party-mic-btn ${muted ? '--muted' : ''}`}
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              <MicIcon muted={muted} />
            </button>
            <button
              className="invite-panel__party-callend-btn"
              onClick={handleEndVoiceChat}
              aria-label="End call"
            >
              <CallEndIcon />
            </button>
          </div>

          <div className="invite-panel__party-participants">
            {partyMembers.map((member) => (
              <PartyMemberRow key={member.id ?? member.name} member={member} />
            ))}
          </div>
        </div>

        {partyMembers.length > 0 && <div className="invite-panel__party-fade" />}
      </div>

      {partyMembers.length > 0 && (
        <div className="invite-panel__party-footer">
          <button className="invite-panel__party-action-btn" onClick={handleEndVoiceChat}>
            End Voice Chat
          </button>
          <button className="invite-panel__party-action-btn" onClick={handleLeaveParty}>
            Leave Party
          </button>
        </div>
      )}
    </div>
  );
}

export default function InvitePanel() {
  const {
    invitePanelOpen,
    pendingInvite,
    invitePanelTab,
    invitePanelView,
    setInvitePanelOpen,
    setPendingInvite,
    setInvitePanelTab,
    setInvitePanelView,
    setSocialOverlayOpen,
    addPartyMember,
  } = useUIContext();
  const sendMessage = useSendMessage();

  const dismiss = () => {
    setInvitePanelOpen(false);
    setInvitePanelView('list');
  };

  const handleAccept = () => {
    if (pendingInvite) {
      addPartyMember({
        id: pendingInvite.id ?? pendingInvite.name,
        name: pendingInvite.name,
        avatar: pendingInvite.avatar,
      });
    }
    sendMessage('navigate', { path: '/fifa-menu' });
    setInvitePanelOpen(false);
    setPendingInvite(null);
    setInvitePanelView('list');
    setSocialOverlayOpen(false);
  };

  const showFriends = invitePanelTab === 'friends';
  const showDetail = invitePanelView === 'detail' && !!pendingInvite;

  return (
    <AnimatePresence>
      {invitePanelOpen && (
        <motion.div
          className="invite-panel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="invite-panel__scrim" onClick={dismiss} />

          <motion.div
            className="invite-panel__content"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.28, ease: [0.32, 0.94, 0.6, 1] }}
          >
            {showFriends ? (
              <FriendsCard onBack={dismiss} />
            ) : showDetail ? (
              <InviteCard
                invite={pendingInvite}
                onBack={() => setInvitePanelView('list')}
                onAccept={handleAccept}
                onIgnore={dismiss}
                onViewProfile={dismiss}
              />
            ) : (
              <NotificationsListCard
                activeInvite={pendingInvite}
                onSelectInvite={() => setInvitePanelView('detail')}
              />
            )}

            <div className="invite-panel__sidebar">
              <button
                className={`invite-panel__sidebar-btn ${invitePanelTab === 'friends' ? '--active' : ''}`}
                onClick={() => {
                  if (invitePanelTab === 'friends') {
                    dismiss();
                  } else {
                    setInvitePanelTab('friends');
                  }
                }}
                aria-label="Friends"
              >
                <PeopleIcon />
              </button>
              <button
                className={`invite-panel__sidebar-btn ${invitePanelTab === 'notifications' && !showFriends ? '--active' : ''}`}
                onClick={() => {
                  if (invitePanelTab === 'notifications' && !showFriends) {
                    dismiss();
                  } else {
                    setInvitePanelTab('notifications');
                    setInvitePanelView('list');
                  }
                }}
                aria-label="Notifications"
              >
                <BellIcon />
                {pendingInvite && <span className="invite-panel__sidebar-dot" />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
