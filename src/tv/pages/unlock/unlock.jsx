import { useState, useEffect } from 'react';
import { useUIContext } from '@/contexts/ui';
import { ScreenPause, ScreenPauseOnMobile } from '../common/screen-pause';
import { StepInGame, StepToastExpanded } from './unlock-components';
import { SubMenu } from '../dashboard/dashboard-components';
import { useOnReceiveMessage } from '@/tv/hooks/use-on-receive-message';
import GameDP from '@/tv/components/game-dp/game-dp';

import './unlock.scss';

export const UnlockMobile = ({ onBack }) => {
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
    <div className="screen">
      <StepInGame
        isInGame={currentStep === 1}
        isToastVisible={currentStep === 1 && toastStatus !== 'dismissed'}
        onDismissed={() => setToastStatus('dismissed')}
      />
      {currentStep >= 2 && <ScreenPause onBack={onBack} />}
      {currentStep === 3 && (
        <ScreenPauseOnMobile
          onBack={onBack}
          text="Exit Achievements to continue playing"
        />
      )}
    </div>
  );
};

export const UnlockTV = () => {
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
    <div className="screen">
      {currentStep < 5 && (
        <StepInGame
          isInGame={currentStep <= 2}
          isToastVisible={currentStep === 1 && toastStatus !== 'dismissed'}
          onMounted={() => setToastStatus('mini')}
          onDismissed={() => setToastStatus('dismissed')}
        />
      )}

      <StepToastExpanded
        isToastVisible={currentStep === 2}
        onBack={dismissToast}
        onNext={() => setCurrentStep(4)}
      />

      {currentStep >= 3 && currentStep <= 4 && (
        <ScreenPause onBack={() => setCurrentStep(1)} />
      )}

      <SubMenu
        isVisible={currentStep === 4}
        isAchievementOpen={toastStatus !== 'dismissed'}
        onResume={dismissToast}
        onBack={() => {
          setCurrentStep(3);
          setToastStatus('dismissed');
        }}
        onExit={() => {
          setCurrentStep(5);
          setToastStatus('dismissed');
        }}
      />

      {currentStep === 5 && <GameDP onNext={() => setCurrentStep(1)} />}
    </div>
  );
};
