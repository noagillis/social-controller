import { useState } from 'react';
import { useUIContext } from '@/contexts/ui';
import { SubMenu } from '../dashboard/dashboard-components';
import { ScreenPause, ScreenPauseOnMobile } from '../common/screen-pause';
import { InvitationInGame, StepToastExpanded } from './invitation-in-game';
import { useOnReceiveMessage } from '@/tv/hooks/use-on-receive-message';
import GameDP from '@/tv/components/game-dp/game-dp';
import './invitation.scss';

export const InvitationMobile = ({ onBack }) => {
  const { currentStep, setCurrentStep } = useUIContext();
  const [toastStatus, setToastStatus] = useState('waiting'); // waiting, mini, expanding, expanded, dismissed

  useOnReceiveMessage('buttonPress', (data) => {
    if (data.button === 'Toast') {
      setToastStatus('dismissed');
      setCurrentStep(3);
    }
    if (data.button === 'Profile' && toastStatus === 'dismissed') {
      setCurrentStep(3);
    }
  });

  return (
    <div className="invitation screen">
      <InvitationInGame
        isInGame={currentStep === 1}
        isToastVisible={currentStep === 1 && toastStatus !== 'dismissed'}
        onDismissed={() => setToastStatus('dismissed')}
      />
      {currentStep >= 2 && <ScreenPause onBack={onBack} />}
      {currentStep === 3 && (
        <ScreenPauseOnMobile
          onBack={onBack}
          text="Finish friend request to continue playing"
        />
      )}
    </div>
  );
};

export const InvitationTV = () => {
  const { currentStep, setCurrentStep } = useUIContext();
  const [toastStatus, setToastStatus] = useState('waiting'); // waiting, mini, expanding, expanded, dismissed

  useOnReceiveMessage('buttonPress', (data) => {
    if (currentStep === 5) return;
    if (data.button === 'Profile') {
      handlePressProfile();
    }
  });

  const handlePressProfile = () => {
    if (currentStep === 5 || toastStatus === 'waiting') {
      return;
    }
    if (toastStatus === 'mini') {
      setCurrentStep(2);
      setToastStatus('expanded');
    }
    if (toastStatus === 'dismissed') {
      setCurrentStep(4);
    }
  };

  const dismissToast = () => {
    setToastStatus('dismissed');
    setCurrentStep(1);
  };

  return (
    <div className="invitation screen">
      {currentStep < 5 && (
        <InvitationInGame
          isInGame={currentStep <= 2}
          isToastVisible={currentStep === 1 && toastStatus !== 'dismissed'}
          onMounted={() => setToastStatus('mini')}
          onDismissed={() => setToastStatus('dismissed')}
        />
      )}
      <StepToastExpanded
        isToastVisible={currentStep === 2}
        onBack={dismissToast}
      />

      {currentStep >= 3 && currentStep <= 4 && (
        <ScreenPause
          onBack={() => {
            setCurrentStep(1);
          }}
        />
      )}

      <SubMenu
        isVisible={currentStep === 4}
        onResume={dismissToast}
        onBack={() => setCurrentStep(3)}
        onExit={() => setCurrentStep(5)}
      />

      {currentStep === 5 && <GameDP onNext={() => setCurrentStep(1)} />}
    </div>
  );
};
