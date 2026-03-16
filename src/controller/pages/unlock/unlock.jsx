import { useState } from 'react';
import { useUIContext } from '@/contexts/ui';
import Trophy from '@/controller/assets/trophy.png';
import SSIC from '../ssic/ssic';
import { SSICToast } from '../../common/ssic-toast';
import { SSICDashboard } from '../../common/ssic-dashboard';
import './unlock.scss';

const UnlockMobile = () => {
  const { currentStep } = useUIContext();
  const [toastDismissed, setIsToastDismissed] = useState(false);

  return (
    <>
      <SSIC isInGame={currentStep === 1}>
        <SSICToast
          className="toast-unlock"
          onBack={() => setIsToastDismissed(true)}
        >
          <img src={Trophy} className="icon" alt="trophy" />
          <p className="body-small-heavy">Achievement unlocked!</p>
        </SSICToast>
      </SSIC>
      {currentStep === 3 && (
        <SSICDashboard
          showAchievements={!toastDismissed}
          onBack={() => setIsToastDismissed(true)}
        />
      )}
    </>
  );
};

const UnlockTV = () => {
  const { currentStep } = useUIContext();

  return <SSIC isInGame={currentStep <= 2} />;
};

export { UnlockMobile, UnlockTV };
