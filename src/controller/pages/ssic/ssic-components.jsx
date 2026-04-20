import { useState } from 'react';
import ButtonWrapper from '../../common/button-wrapper';
import { useUIContext } from '../../../contexts/ui';
import { useDataContext } from '../../../contexts/data';
import { useConnectedProfiles } from '../../hooks/use-connected-profiles';
import { PROFILES } from '../profile-picker/profile-picker';

import ButtonA from './assets/button-a.svg?react';
import ButtonB from './assets/button-b.svg?react';
import ButtonX from './assets/button-x.svg?react';
import ButtonY from './assets/button-y.svg?react';
import NavMenu from './assets/nav-menu.svg?react';
import NavNetflix from './assets/nav-netflix.svg?react';
import NavSettings from './assets/nav-settings.svg?react';
import ArrowUp from './assets/arrow-up.svg?react';
import ArrowDown from './assets/arrow-down.svg?react';
import ArrowLeft from './assets/arrow-left.svg?react';
import ArrowRight from './assets/arrow-right.svg?react';

const actionSVG = {
  A: ButtonA,
  B: ButtonB,
  X: ButtonX,
  Y: ButtonY,
};

const navSVG = {
  Setting: NavSettings,
  Profile: NavNetflix,
  Menu: NavMenu,
};

const arrowSVG = {
  Up: ArrowUp,
  Down: ArrowDown,
  Left: ArrowLeft,
  Right: ArrowRight,
};

// Individual quadrant paths extracted from dpad-bg.svg
const quadrantPaths = {
  Up: 'M137.6 0C173.443 0 191.365 2.94148e-06 205.056 6.97559C210.607 9.80408 215.678 13.411 220.135 17.6553L119.559 118.232L19.4141 18.0879C23.9785 13.6553 29.2052 9.89984 34.9443 6.97559C48.6347 2.94148e-06 66.557 0 102.4 0H137.6Z',
  Down: 'M220.135 222.344C215.678 226.588 210.607 230.196 205.056 233.024C191.365 240 173.443 240 137.6 240H102.4C66.557 240 48.6347 240 34.9443 233.024C29.205 230.1 23.9786 226.344 19.4141 221.911L119.559 121.768L220.135 222.344Z',
  Left: 'M117.791 120L17.6553 220.135C13.411 215.678 9.80408 210.607 6.97559 205.056C2.94148e-06 191.365 0 173.443 0 137.6V102.4C0 66.557 2.94148e-06 48.6347 6.97559 34.9443C9.80419 29.3929 13.4107 24.3212 17.6553 19.8643L117.791 120Z',
  Right: 'M221.911 19.4141C226.344 23.9786 230.1 29.205 233.024 34.9443C240 48.6347 240 66.557 240 102.4V137.6C240 173.443 240 191.365 233.024 205.056C230.1 210.795 226.344 216.021 221.911 220.585L121.326 120L221.911 19.4141Z',
};

function ThreeDotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="3" r="1.5" fill="white" />
      <circle cx="8" cy="8" r="1.5" fill="white" />
      <circle cx="8" cy="13" r="1.5" fill="white" />
    </svg>
  );
}

function VoiceChatPlayersCard({ profiles, onClose }) {
  return (
    <>
      <div className="voice-players-scrim" onClick={onClose} />
      <div className="voice-players-card">
        <div className="voice-players-card__header">
          <span>Players in voice chat</span>
        </div>
        <div className="voice-players-card__list">
          {profiles.map((profile) => (
            <div className="voice-players-card__row" key={profile.name}>
              <div className="voice-players-card__profile">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="voice-players-card__avatar" />
                ) : (
                  <div className="voice-players-card__avatar-placeholder" />
                )}
                <span className="voice-players-card__name">
                  {profile.name}
                  {profile.isSelf && ' (You)'}
                </span>
              </div>
              <ThreeDotsIcon />
            </div>
          ))}
        </div>
        <div className="voice-players-card__divider" />
        <button className="voice-players-card__leave" onClick={onClose}>
          <img src="/images/volume.png" alt="" className="voice-players-card__leave-icon" />
          <span>Leave Voice Chat</span>
        </button>
      </div>
    </>
  );
}

export function SSICNav({ action }) {
  const NavBackground = navSVG[action];
  const { currentStep, toggleSocialOverlay, socialOverlayOpen } = useUIContext();
  const { profileData } = useDataContext();
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayersCard, setShowPlayersCard] = useState(false);
  const connectedProfiles = useConnectedProfiles();

  // Replace gear icon with the user's profile picture once selected
  if (action === 'Setting' && profileData) {
    const selectedProfile = PROFILES.find((p) => p.name === profileData)
      || PROFILES.find((p) => p.isGuest);
    if (selectedProfile?.avatar) {
      if (socialOverlayOpen) {
        return (
          <img
            src="/images/phone-controller-pink.png"
            alt="Controller"
            className="ssic-nav__controller-icon"
            onClick={toggleSocialOverlay}
          />
        );
      }
      return (
        <ButtonWrapper
          className={`ssic-nav outline-red --${action} --has-avatar`}
          action={action}
          scaleAmount={1.08}
          onClick={toggleSocialOverlay}
        >
          <img
            src={selectedProfile.avatar}
            alt={selectedProfile.name}
            className="ssic-nav__avatar"
          />
        </ButtonWrapper>
      );
    }
  }

  if (socialOverlayOpen) return null;

  return (
    <ButtonWrapper
      className={`ssic-nav outline-red --${action}`}
      action={action}
      scaleAmount={1.08}
      onClick={undefined}
    >
      <NavBackground />
    </ButtonWrapper>
  );
}

export function SSICVoiceChat() {
  const { currentStep } = useUIContext();
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayersCard, setShowPlayersCard] = useState(false);
  const connectedProfiles = useConnectedProfiles();

  if (currentStep !== 3) return null;

  return (
    <div className="voice-chat-wrapper">
      <button
        className={`voice-chat-btn ${isMuted ? '-muted' : ''}`}
        onClick={() => setIsMuted(!isMuted)}
      >
        <img
          src={isMuted ? '/images/microphone-off.png' : '/images/volume.png'}
          alt={isMuted ? 'Mute' : 'Voice Chat'}
          className="voice-chat-icon"
        />
        <span className="voice-chat-label">{isMuted ? 'Mute' : 'Voice Chat'}</span>
      </button>
      <button
        className="voice-chat-dots"
        onClick={() => setShowPlayersCard(!showPlayersCard)}
      >
        <ThreeDotsIcon />
      </button>
      {showPlayersCard && (
        <VoiceChatPlayersCard
          profiles={connectedProfiles}
          onClose={() => setShowPlayersCard(false)}
        />
      )}
    </div>
  );
}

export function SSICDpad({ action }) {
  const Arrow = arrowSVG[action];
  return (
    <ButtonWrapper
      className={`dpad-zone --${action}`}
      action={action}
      scaleAmount={1.08}
    >
      <svg
        className="dpad-quadrant"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path d={quadrantPaths[action]} fill="#27232F" />
        <path d={quadrantPaths[action]} fill="url(#dpadGrad)" />
      </svg>
      <Arrow className="dpad-arrow" />
    </ButtonWrapper>
  );
}

export function SSICAction({ action, ...props }) {
  const ActionBackground = actionSVG[action];

  return (
    <ButtonWrapper
      className={`action-key --${action}`}
      scaleAmount={1.08}
      action={action}
      {...props}
    >
      <p className="label">{action}</p>
      <ActionBackground />
    </ButtonWrapper>
  );
}
