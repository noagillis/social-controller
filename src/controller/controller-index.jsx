import { createElement, useEffect, useState } from 'react';
import { useGetMessage } from './hooks/use-get-message';
import { useSendMessage } from './hooks/use-send-message';
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
import { Pages } from './pages/page-constants';

import classNames from 'classnames';

import './controller-index.scss';

export default function ControllerIndex() {
  const { pageId, step, friendSearch, setFriendSearch } = useGetMessage();
  const sendMessage = useSendMessage();
  const { setPageId, setCurrentStep, socialOverlayOpen, setSocialOverlayOpen } = useUIContext();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

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
