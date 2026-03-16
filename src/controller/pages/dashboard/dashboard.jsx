import { useUIContext } from '@/contexts/ui';
import { SSICDashboard } from '@/controller/common/ssic-dashboard';
import SSIC from '../ssic/ssic';

import './dashboard.scss';

const DashboardMobile = () => {
  const { currentStep } = useUIContext();

  return (
    <>
      <SSIC isInGame={currentStep === 1} />
      {currentStep === 3 && <SSICDashboard />}
    </>
  );
};

const DashboardTV = () => {
  const { currentStep } = useUIContext();

  return <SSIC isInGame={currentStep === 1} />;
};

export { DashboardMobile, DashboardTV };
