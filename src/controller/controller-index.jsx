import { createElement, useEffect, useState } from 'react';
import { useGetMessage } from './hooks/use-get-message';
import { useSendMessage } from './hooks/use-send-message';
import { useDataContext } from '@/contexts/data';
import { useUIContext } from '@/contexts/ui';
import { roomId } from './utils/get-room-id-from-query-param';
import RotateDevice from './assets/rotate-device.gif';
import ScreenWrapper from './common/screen-wrapper';
import SSIC from './pages/ssic/ssic';
import ProfilePicker from './pages/profile-picker/profile-picker';
import WelcomeToast from './common/welcome-toast';
import ReadyToPlayModal from './common/ready-to-play-modal';
import FriendSearchOverlay from './common/friend-search-overlay';
import SocialOverlay from './common/social-overlay';
import GameInviteModal from './common/game-invite-modal';
import { Pages } from './pages/page-constants';

import classNames from 'classnames';

import './controller-index.scss';

export default function ControllerIndex() {
  const { pageId, step, friendSearch, setFriendSearch, pendingInvites, setPendingInvites } = useGetMessage();
  const sendMessage = useSendMessage();
  const { profileData } = useDataContext();
  const { setPageId, setCurrentStep, socialOverlayOpen, setSocialOverlayOpen } = useUIContext();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Find the first invite targeting this player
  const myInvite = pendingInvites.find(
    (inv) => inv.toPlayer === profileData || inv.toPlayer === selectedProfile?.name
  );

  const handleDismissInvite = (invite, accepted) => {
    setPendingInvites((prev) => prev.filter((inv) => inv.id !== invite.id));
    sendMessage('dismissInvite', { inviteId: invite.id, accepted });
  };

  useEffect(() => {
    setCurrentStep(step);
  }, [step]);

  //reset
  useEffect(() => {
    setPageId(pageId);
  }, [pageId]);

  if (!selectedProfile) {
    return (
      <ProfilePicker
        onProfileSelected={(profile) => {
          setSelectedProfile(profile);
          setShowOnboarding(true);
        }}
        onDismiss={() => setSelectedProfile('skipped')}
      />
    );
  }

  return (
    <div className="controller">
      <div className="controller-alert ">
        <h1 className="flex-col-center">
          {' '}
          <img src={RotateDevice} alt="rotate-device" />
          Please rotate your device to landscape mode
        </h1>
      </div>
      {/* {showHelpers && <DebugPanel />} */}
      {Pages[pageId] && createElement(Pages[pageId])}{' '}
      {!Pages[pageId] && <SSIC />}{' '}
      <SocialOverlay
        isVisible={socialOverlayOpen}
        onClose={() => setSocialOverlayOpen(false)}
      />
      <FriendSearchOverlay
        isVisible={friendSearch}
        onClose={() => setFriendSearch(false)}
      />
      {myInvite && (
        <GameInviteModal
          invite={myInvite}
          onAccept={() => handleDismissInvite(myInvite, true)}
          onDecline={() => handleDismissInvite(myInvite, false)}
        />
      )}
      {showOnboarding && <WelcomeToast profile={selectedProfile} />}
      {showOnboarding && (
        <ReadyToPlayModal
          onStartPlaying={() => {
            sendMessage('navigate', { path: '/fifa-menu' });
          }}
        />
      )}
    </div>
  );
}

const DebugPanel = () => {
  const { pageId, currentStep } = useUIContext();
  let disconnected = !roomId;

  return (
    <ScreenWrapper className="controller-debug" zIndex={11}>
      <div className={classNames(`debug-panel`, { disconnected })}>
        {disconnected ? (
          <p>Connection lost, please scan the QR code</p>
        ) : (
          <>
            <p>Room: {roomId}</p>
            <p>{`Flow: ${pageId}, step ${currentStep}`}</p>
          </>
        )}
      </div>
    </ScreenWrapper>
  );
};
