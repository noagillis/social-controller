import { useUIContext } from '@/contexts/ui';
import { StepInGame, SubMenu } from './dashboard-components';
import { ScreenPause, ScreenPauseOnMobile } from '../common/screen-pause';
import { useOnReceiveMessage } from '@/tv/hooks/use-on-receive-message';
import GameDP from '@/tv/components/game-dp/game-dp';
import './dashboard.scss';

export const DashboardMobile = ({ onBack }) => {
  const { currentStep, setCurrentStep } = useUIContext();

  useOnReceiveMessage('buttonPress', (data) => {
    if (data.button === 'Profile') {
      setCurrentStep(3);
    }
  });

  return (
    <div className="screen">
      <StepInGame isReadytoPlay={currentStep === 1} />
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

export const DashboardTV = () => {
  const { currentStep, setCurrentStep } = useUIContext();

  useOnReceiveMessage('buttonPress', (data) => {
    if (currentStep === 4) return;
    if (data.button === 'Profile') {
      setCurrentStep(2);
    }
  });

  const onResumeGame = () => {
    setCurrentStep(1);
  };

  return (
    <div className="screen">
      {currentStep < 4 && <StepInGame isReadytoPlay={currentStep === 1} />}
      {currentStep >= 2 && currentStep <= 3 && (
        <ScreenPause onBack={onResumeGame} />
      )}
      <SubMenu
        onResume={onResumeGame}
        isVisible={currentStep === 2}
        onBack={() => {
          setCurrentStep(3);
        }}
        onExit={() => {
          setCurrentStep(4);
        }}
      />

      {currentStep === 4 && (
        <GameDP
          onNext={() => {
            setCurrentStep(1);
          }}
        />
      )}
    </div>
  );
};
