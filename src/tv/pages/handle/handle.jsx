import { useUIContext } from '@/contexts/ui';
import {
  DP,
  ControllerConnection,
  HandleInputTV,
  HandleInputMobile,
  GamePlayWithToast,
} from './handle-components';

import './handle.scss';

export const HandleMobile = (props) => {
  const { currentStep } = useUIContext();

  return (
    <div className='screen'>
      {currentStep === 1 && <DP {...props} />}
      {currentStep === 2 && <ControllerConnection {...props} />}
      {currentStep === 3 && <HandleInputMobile {...props} />}
      {currentStep === 4 && <GamePlayWithToast {...props} />}
    </div>
  );
};

export const HandleTV = (props) => {
  const { currentStep } = useUIContext();

  return (
    <div className='screen'>
      {currentStep === 1 && <DP {...props} />}
      {currentStep === 2 && <ControllerConnection {...props} />}
      {currentStep === 3 && <HandleInputTV {...props} />}
      {currentStep === 4 && <GamePlayWithToast {...props} />}
    </div>
  );
};
