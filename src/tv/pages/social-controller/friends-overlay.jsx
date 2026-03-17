import { useEffect, useState } from 'react';
import { FocusNode, useSetFocus } from '@please/lrud';
import { motion, AnimatePresence } from 'framer-motion';
import { uiTransition } from '@/tv/utils/motion';
import { useSendMessageTV } from '@/tv/hooks/use-send-message-tv';
import { useOnReceiveMessage } from '@/tv/hooks/use-on-receive-message';
import { useUIContext } from '@/contexts/ui';
import { QrCodeScreen } from '../../components/ssic-helpers/ssic-helpers';
import PropTypes from 'prop-types';
import FindFriendsCard from '@/tv/components/find-friends-card/find-friends-card';
import GridKeyboard from '@/tv/components/find-friends-card/grid-keyboard';

const IMG_PATH = import.meta.env.BASE_URL + 'images';

const FRIENDS = [
  { name: 'Alex2k', game: 'Oxenfree', avatar: 'friend-avatar-1.png' },
  { name: 'itsmilktea', game: 'Tetris Time Warp', avatar: 'friend-avatar-2.png' },
  { name: 'shawty', game: 'Boggle Party', avatar: 'friend-avatar-3.png' },
  { name: 'GameHandle', game: 'Tetris Time Warp', avatar: 'friend-avatar-4.png' },
];

const MENU_ITEMS = [
  { label: 'Play Game', icon: BackIcon, id: 'play-game' },
  { label: 'Friends', icon: UsersIcon, id: 'friends' },
  { label: 'Controllers', icon: ControllerIcon, id: 'controllers' },
  { label: 'Achievements', icon: TrophyIcon, id: 'achievements' },
  { label: 'Exit Game', icon: XIcon, id: 'exit-game', separate: true },
];

const EMPTY_SLOTS = [
  'controller-slot-empty.png',
  'controller-slot-empty-alt.png',
  'controller-slot-empty.png',
  'controller-slot-empty-alt.png',
];

function BackIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 18L5 13L10 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 13H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 20V18.5C18 16.567 16.433 15 14.5 15H8.5C6.567 15 5 16.567 5 18.5V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11.5" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M21 20V18.5C21 17.12 20.14 15.94 18.93 15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16.93 6.5C18.14 6.94 19 8.12 19 9.5C19 10.88 18.14 12.06 16.93 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ControllerIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 5.5C2 4.672 2.672 4 3.5 4H12.5C13.328 4 14 4.672 14 5.5V10.5C14 11.328 13.328 12 12.5 12H3.5C2.672 12 2 11.328 2 10.5V5.5Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 6.5V9.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M3.5 8H6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <circle cx="10.5" cy="7" r="0.75" fill="currentColor" />
      <circle cx="12" cy="8.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 5H18V12C18 14.761 15.761 17 13 17C10.239 17 8 14.761 8 12V5Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 8H5C5 11 6.5 12 8 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 8H21C21 11 19.5 12 18 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 21H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13 17V21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 7L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 7L7 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UserAddIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 20V18.5C16 16.567 14.433 15 12.5 15H7.5C5.567 15 4 16.567 4 18.5V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 9V15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 12H23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function GameControllerSmallIcon() {
  return (
    <img src={`${IMG_PATH}/game-controller.png`} alt="" width="16" height="16" />
  );
}

function GamepadIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="20" height="13" rx="4" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" fill="none" />
      <circle cx="9" cy="11" r="1.2" fill="rgba(255,255,255,0.7)" />
      <line x1="9" y1="8.5" x2="9" y2="13.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6.5" y1="11" x2="11.5" y2="11" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16.5" cy="10" r="1.2" fill="rgba(255,255,255,0.7)" />
      <circle cx="18.5" cy="12" r="1.2" fill="rgba(255,255,255,0.7)" />
      <circle cx="14.5" cy="12" r="1.2" fill="rgba(255,255,255,0.7)" />
      <circle cx="16.5" cy="14" r="1.2" fill="rgba(255,255,255,0.7)" />
    </svg>
  );
}

function ControllersContent({ connectedProfiles, controllerCount }) {
  return (
    <div className="friends-overlay__controllers">
      <div className="friends-overlay__controllers-bg" />
      <div className="friends-overlay__controllers-content">
        <div className="friends-overlay__controllers-qr">
          <QrCodeScreen size={200} />
        </div>
        <div className="friends-overlay__controllers-info">
          <h2 className="friends-overlay__controllers-title">
            Scan to connect your phone
          </h2>
          <p className="friends-overlay__controllers-desc">
            Scan the QR code and your phone will become the controller. If
            disconnected, return to the app or scan the QR code again.
          </p>
          <div className="friends-overlay__controllers-slots">
            {EMPTY_SLOTS.map((emptyImg, i) => {
              const profile = connectedProfiles[i];
              const isConnectedWaiting = !profile && i < controllerCount;
              return (
                <div className="friends-overlay__controllers-slot" key={i}>
                  {profile ? (
                    <div className="friends-overlay__controllers-slot-connected">
                      <img
                        src={profile.avatar || `${IMG_PATH}/FIFA-avatar.png`}
                        alt={profile.name}
                        className="friends-overlay__controllers-slot-avatar"
                      />
                      <div className="friends-overlay__controllers-slot-label">
                        <GamepadIcon />
                        <span className="friends-overlay__controllers-slot-name">
                          {profile.name}
                        </span>
                      </div>
                    </div>
                  ) : isConnectedWaiting ? (
                    <div className="friends-overlay__controllers-slot-waiting">
                      <img src={`${IMG_PATH}/phone-controller.png`} alt="" className="friends-overlay__controllers-slot-waiting-icon" />
                      <span className="friends-overlay__controllers-slot-waiting-text">
                        Connected
                      </span>
                    </div>
                  ) : (
                    <img
                      src={`${IMG_PATH}/${emptyImg}`}
                      alt={`Player ${i + 1}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function FriendsTitleCard() {
  return (
    <div className="friends-overlay__title-card">
      <div className="friends-overlay__title-card-bg" />
      <div className="friends-overlay__title-card-icon">
        <img src={`${IMG_PATH}/friends.svg`} alt="" width="200" style={{ marginBottom: '-40px' }} />
      </div>
      <h2 className="friends-overlay__title-card-heading">Friends</h2>
      <div className="friends-overlay__title-card-btn">
        <UserAddIcon />
        <span>Find Friends</span>
      </div>
    </div>
  );
}

function PlayerCard({ friend }) {
  return (
    <div className="friends-overlay__player-card">
      <div className="friends-overlay__player-card-bg" />
      <div className="friends-overlay__player-card-gradient" />
      <div className="friends-overlay__player-card-content">
        <div className="friends-overlay__player-card-profile">
          <div className="friends-overlay__player-card-name-lockup">
            <p className="friends-overlay__player-card-name">{friend.name}</p>
            <div className="friends-overlay__player-card-status">
              <span className="friends-overlay__player-card-status-dot" />
              <span className="friends-overlay__player-card-status-text">Online</span>
            </div>
          </div>
          <div className="friends-overlay__player-card-avatar">
            <img src={`${IMG_PATH}/${friend.avatar}`} alt={friend.name} />
          </div>
        </div>
        <div className="friends-overlay__player-card-meta">
          <div className="friends-overlay__player-card-playing">
            <GameControllerSmallIcon />
            <span>Playing</span>
          </div>
          <p className="friends-overlay__player-card-game">{friend.game}</p>
        </div>
      </div>
    </div>
  );
}

PlayerCard.propTypes = {
  friend: PropTypes.shape({
    name: PropTypes.string.isRequired,
    game: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
};

// Card widths + gap used for scroll offset calculation
const CARD_GAP = 12;
const TITLE_CARD_WIDTH = 390;
const PLAYER_CARD_WIDTH = 244;
const CARD_BORDER = 6; // 3px border on each side of focus wrapper

// Pre-compute left edge of each card (index 0 = title card, 1..N = player cards)
const CARD_OFFSETS = [0];
for (let i = 0; i < FRIENDS.length; i++) {
  const prev = CARD_OFFSETS[i];
  const prevWidth = i === 0 ? TITLE_CARD_WIDTH + CARD_BORDER : PLAYER_CARD_WIDTH + CARD_BORDER;
  CARD_OFFSETS.push(prev + prevWidth + CARD_GAP);
}

export default function FriendsOverlay({ isVisible, onBack, onPlayGame, initialTab = 'friends', controllerCount = 0 }) {
  const setFocus = useSetFocus();
  const sendMessage = useSendMessageTV();
  const { connectedProfiles } = useUIContext();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [cardsMode, setCardsMode] = useState(false);
  const [focusedCardIndex, setFocusedCardIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setActiveTab(initialTab);
      setFocus('friends-overlay');
      setCardsMode(false);
      setFocusedCardIndex(0);
      setSearchText('');
      setIsSearching(false);
      // Focus the correct menu item based on initialTab
      setTimeout(() => {
        if (initialTab !== 'friends') {
          setFocus(`friends-menu-${initialTab}`);
        }
      }, 50);
    }
  }, [isVisible, setFocus, initialTab]);

  useEffect(() => {
    if (isSearching) {
      setFocus('find-friends-input');
    }
  }, [isSearching, setFocus]);

  const handleFindFriends = () => {
    setIsSearching(true);
    sendMessage?.('friendSearch', { state: true });
  };

  const handleGridKeyPress = (key) => {
    setSearchText((prev) => {
      const newText = key.type === 'backspace' ? prev.slice(0, -1) : prev + key.char;
      sendMessage?.('friendSearchText', { text: newText });
      return newText;
    });
  };

  const handleSearchClose = () => {
    setIsSearching(false);
    setSearchText('');
    setFocus('friends-cards-row');
  };

  const handleBack = () => {
    if (isSearching) {
      handleSearchClose();
    } else {
      onBack();
    }
  };

  useOnReceiveMessage('friendSearchText', (data) => {
    setSearchText(data?.text || '');
  });

  useOnReceiveMessage('friendSearchClose', () => {
    handleSearchClose();
  });

  useOnReceiveMessage('buttonPress', (data) => {
    if (!isVisible) return;
    if (data.button === 'B' && isSearching) {
      handleSearchClose();
    }
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <FocusNode
          elementType={motion.div}
          focusId="friends-overlay"
          className="friends-overlay screen"
          isTrap={true}
          orientation="vertical"
          onBack={handleBack}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: uiTransition }}
          exit={{ opacity: 0, y: 10, transition: uiTransition }}
        >
          {/* Background */}
          <div className="friends-overlay__bg">
            <img
              src={`${IMG_PATH}/FIFA-game-page.jpg`}
              alt=""
              className="friends-overlay__bg-img"
            />
            <div className="friends-overlay__bg-dark" />
            <div className="friends-overlay__bg-glow" />
          </div>

          {/* Cards row / Controllers content */}
          <div className={`friends-overlay__cards-viewport${activeTab === 'controllers' ? ' -centered' : ''}`}>
            {activeTab === 'controllers' ? (
              <FocusNode
                focusId="controllers-content-row"
                className="friends-overlay__cards"
              >
                <ControllersContent
                  connectedProfiles={connectedProfiles}
                  controllerCount={controllerCount}
                />
              </FocusNode>
            ) : (
              <FocusNode
                focusId="friends-cards-row"
                elementType={motion.div}
                className={`friends-overlay__cards${cardsMode ? ' -active' : ''}`}
                orientation="horizontal"
                onBlurred={() => setCardsMode(false)}
                onFocused={() => setCardsMode(true)}
                animate={{ x: -CARD_OFFSETS[focusedCardIndex] }}
                transition={uiTransition}
              >
                {/* Title card swaps to search card when searching */}
                {isSearching ? (
                  <FocusNode
                    focusId="find-friends-viewport"
                    className="friends-overlay__card-focus-wrapper"
                    orientation="horizontal"
                  >
                    <FindFriendsCard searchText={searchText}>
                      <GridKeyboard onKeyPress={handleGridKeyPress} />
                    </FindFriendsCard>
                  </FocusNode>
                ) : (
                  <FocusNode
                    focusId="friends-card-title"
                    className="friends-overlay__card-focus-wrapper"
                    onFocused={() => setFocusedCardIndex(0)}
                    onSelected={handleFindFriends}
                  >
                    <FriendsTitleCard />
                  </FocusNode>
                )}
                {!isSearching && FRIENDS.map((friend, i) => (
                  <FocusNode
                    key={friend.name}
                    focusId={`friends-card-${friend.name}`}
                    className="friends-overlay__card-focus-wrapper"
                    onFocused={() => setFocusedCardIndex(i + 1)}
                  >
                    <PlayerCard friend={friend} />
                  </FocusNode>
                ))}
              </FocusNode>
            )}
          </div>

          {/* Bottom menu */}
          <FocusNode
            focusId="friends-menu-row"
            className="friends-overlay__menu"
            orientation="horizontal"
            defaultFocused
            disabled={isSearching}
          >
            <FocusNode
              focusId="friends-menu-play-game"
              className="friends-overlay__menu-item"
              onSelected={onPlayGame || onBack}
            >
              <BackIcon />
              <span>Play Game</span>
            </FocusNode>
            <FocusNode
              focusId="friends-menu-group"
              className="friends-overlay__menu-group"
              orientation="horizontal"
            >
              {MENU_ITEMS.filter((item) => !item.separate && item.id !== 'play-game').map((item) => (
                <FocusNode
                  key={item.id}
                  focusId={`friends-menu-${item.id}`}
                  className={`friends-overlay__menu-item${activeTab === item.id ? ' -active' : ''}`}
                  onSelected={() => setActiveTab(item.id)}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </FocusNode>
              ))}
            </FocusNode>
            <FocusNode
              focusId="friends-menu-exit-game"
              className="friends-overlay__menu-item -separate"
            >
              <XIcon />
              <span>Exit Game</span>
            </FocusNode>
          </FocusNode>

          {/* Key guide */}
          <div className="friends-overlay__keyguide">
            <div className="friends-overlay__keyguide-item">
              <span className="friends-overlay__keyguide-btn friends-overlay__keyguide-btn--a">A</span>
              <span className="friends-overlay__keyguide-label">Select</span>
            </div>
            <div className="friends-overlay__keyguide-item">
              <span className="friends-overlay__keyguide-btn friends-overlay__keyguide-btn--b">B</span>
              <span className="friends-overlay__keyguide-label">Back</span>
            </div>
          </div>
        </FocusNode>
      )}
    </AnimatePresence>
  );
}

FriendsOverlay.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  onPlayGame: PropTypes.func,
  initialTab: PropTypes.oneOf(['friends', 'controllers', 'achievements']),
  controllerCount: PropTypes.number,
};
