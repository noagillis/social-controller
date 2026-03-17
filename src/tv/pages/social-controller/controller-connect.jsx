import { useState, useCallback, useRef, useEffect } from 'react';
import { FocusNode } from '@please/lrud';
import { QrCodeScreen } from '../../components/ssic-helpers/ssic-helpers';
import { useOnRoomUpdate } from '../../hooks/use-on-room-update';
import { useOnReceiveMessage } from '../../hooks/use-on-receive-message';
import { useSendMessageTV } from '../../hooks/use-send-message-tv';
import { useUIContext } from '@/contexts/ui';
import FriendsOverlay from './friends-overlay';

const IMG_PATH = import.meta.env.BASE_URL + 'images';

const EMPTY_SLOTS = [
  'controller-slot-empty.png',
  'controller-slot-empty-alt.png',
  'controller-slot-empty.png',
  'controller-slot-empty-alt.png',
];

function GamepadIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="6"
        width="20"
        height="13"
        rx="4"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.8"
        fill="none"
      />
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

export default function ControllerConnect({ onBack, showFriends, onCloseFriends, onPlayGame }) {
  const { connectedProfiles, setConnectedProfiles } = useUIContext();
  const [controllerCount, setControllerCount] = useState(0);
  const sendMessageTV = useSendMessageTV();

  const handleRoomUpdate = useCallback((roomState) => {
    const count = roomState?.counts?.controller || 0;
    setControllerCount(count);
    // If controllers disconnected, trim the profiles list to match
    setConnectedProfiles((prev) => prev.slice(0, count));
  }, [setConnectedProfiles]);

  useOnRoomUpdate(handleRoomUpdate);

  const handleProfileSelect = useCallback((data) => {
    setConnectedProfiles((prev) => {
      if (prev.length >= 4) return prev;
      return [...prev, { name: data.name, avatar: data.avatar, isGuest: data.isGuest }];
    });
  }, [setConnectedProfiles])

  useOnReceiveMessage('profileSelect', handleProfileSelect);

  // Broadcast the full connected profiles list to all controllers whenever it changes
  useEffect(() => {
    if (sendMessageTV && connectedProfiles.length > 0) {
      sendMessageTV('connectedProfilesSync', { profiles: connectedProfiles });
    }
  }, [connectedProfiles, sendMessageTV]);

  return (
    <FocusNode focusId={'controller-connect'} onBack={onBack}>
      <div className="controller-connect">
        {/* Background: FIFA image with dark overlay */}
        <div className="controller-connect__bg">
          <img
            src={`${IMG_PATH}/FIFA-game-page.jpg`}
            alt=""
            className="controller-connect__bg-img"
          />
          <div className="controller-connect__bg-scrim" />
          <div className="controller-connect__bg-overlay" />
        </div>

        {/* Main panel */}
        <div className="controller-connect__panel">
          <div className="controller-connect__panel-content">
            {/* QR Code */}
            <div className="controller-connect__qr">
              <QrCodeScreen size={230} />
            </div>

            {/* Info */}
            <div className="controller-connect__info">
              <div className="controller-connect__text">
                <h2 className="controller-connect__title">
                  Scan to connect your phone
                </h2>
                <p className="controller-connect__desc">
                  Scan the QR code and your phone will become the controller. If
                  disconnected, return to the app or scan the QR code again.
                </p>
              </div>

              {/* Controller slots */}
              <div className="controller-connect__slots">
                {EMPTY_SLOTS.map((emptyImg, i) => {
                  const profile = connectedProfiles[i];
                  const isConnectedWaiting = !profile && i < controllerCount;
                  return (
                    <div className="controller-connect__slot" key={i}>
                      {profile ? (
                        <div className="controller-connect__slot-connected">
                          <img
                            src={profile.avatar || `${IMG_PATH}/FIFA-avatar.png`}
                            alt={profile.name}
                            className="controller-connect__slot-avatar"
                          />
                          <div className="controller-connect__slot-label">
                            <GamepadIcon />
                            <span className="controller-connect__slot-name">
                              {profile.name}
                            </span>
                          </div>
                        </div>
                      ) : isConnectedWaiting ? (
                        <div className="controller-connect__slot-waiting">
                          <img src={`${IMG_PATH}/phone-controller.png`} alt="" className="controller-connect__slot-waiting-icon" />
                          <span className="controller-connect__slot-waiting-text">
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

              {/* Back button */}
              <FocusNode
                focusId="controller-connect-back"
                className="controller-connect__back-btn"
                onSelected={onBack}
              >
                <span>Back</span>
              </FocusNode>
            </div>
          </div>
        </div>
      </div>

      <FriendsOverlay
        isVisible={showFriends}
        onBack={onCloseFriends}
        onPlayGame={onPlayGame}
      />
    </FocusNode>
  );
}
