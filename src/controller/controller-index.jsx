import { createElement, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  const { pageId, step, friendSearch, setFriendSearch, pendingInvites, setPendingInvites, gameExited } = useGetMessage();
  const sendMessage = useSendMessage();
  const { profileData } = useDataContext();
  const { setPageId, setCurrentStep, socialOverlayOpen, setSocialOverlayOpen } = useUIContext();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // When game exits, open the social overlay instead of showing a separate screen
  useEffect(() => {
    if (gameExited) {
      setSocialOverlayOpen(true);
    }
  }, [gameExited]);

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
          setSocialOverlayOpen(true);
        }}
        onDismiss={() => setSelectedProfile('skipped')}
      />
    );
  }

  return (
    <div className="controller">
      <SocialOverlay
        isVisible={socialOverlayOpen}
        onClose={() => setSocialOverlayOpen(false)}
        onScanToPlay={() => {
          setSocialOverlayOpen(false);
          setShowOnboarding(true);
        }}
        gameExited={gameExited}
      />
      <motion.div
        className="controller__slide"
        animate={{ y: socialOverlayOpen ? 'calc(-100% + 14px)' : '0%' }}
        transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
      >
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
      </motion.div>
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
      {/* Game exited state now handled by SocialOverlay with scan-to-connect treatment */}
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
