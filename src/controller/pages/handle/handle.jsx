import SSIC from '../ssic/ssic';
import { useUIContext } from '@/contexts/ui';
import { useDataContext } from '@/contexts/data';
import { IMG_PATH } from '@/tv/settings/settings';
import { SSICToast } from '../../common/ssic-toast';
import { InputModalTV, InputModalMobile } from './input-modal';

import './handle.scss';

const HandleMobile = () => {
  const { currentStep } = useUIContext();
  const { profileData } = useDataContext();

  return (
    <>
      <SSIC isInGame={currentStep === 4}>
        {currentStep === 4 && (
          <SSICToast action="none">
            <img
              src={`${IMG_PATH}/profile.png`}
              alt="profile"
              className="full-width-img"
            />
            <p className="body-small-heavy">
              Welcome <b>{profileData}</b>
            </p>
          </SSICToast>
        )}
      </SSIC>
      {currentStep === 3 && <InputModalMobile />}
    </>
  );
};

const HandleTV = () => {
  const { currentStep } = useUIContext();

  return (
    <SSIC isInGame={currentStep === 4}>
      {currentStep === 3 && <InputModalTV />}
    </SSIC>
  );
};

export { HandleMobile, HandleTV };
