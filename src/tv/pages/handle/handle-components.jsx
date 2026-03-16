import { useEffect, useRef, useState } from 'react';
import { FocusNode } from '@please/lrud';
import GameDP from '../../components/game-dp/game-dp';
import { QrCodeScreen } from '../../components/ssic-helpers/ssic-helpers';
import { useDataContext } from '@/contexts/data';
import { useSendMessageTV } from '../../hooks/use-send-message-tv';
import useSSICKeys from '../../hooks/use-ssic-keys';
import Button from '@/tv/common/button';
import Video from '@/tv/common/video';
import {
  RefreshIconStandard,
  CircleCheckmarkIconSmall,
} from '@/tv/common/icons';

import { useOnReceiveMessage } from '@/tv/hooks/use-on-receive-message';
import { useOnRoomUpdate } from '@/tv/hooks/use-on-room-update';
import { generateRandomGameHandle } from '@/tv/utils/math';
import { IMG_PATH, VIDEO_PATH } from '@/tv/settings/settings';

import { ToastMini } from '../common/toast';

export const DP = (props) => {
  return <GameDP {...props} />;
};

export const ControllerConnection = ({ onNext, onBack }) => {
  useOnRoomUpdate((roomState) => {
    if (roomState?.counts?.controller > 0) {
      onNext();
    }
  });

  return (
    <FocusNode focusId={'screen-scan'} onSelected={onNext} onBack={onBack}>
      <img
        src={`${IMG_PATH}/create-handle-qrcode.png`}
        alt="create-handle-qrcode"
        className="full-width-img"
      />
      <div className="create-handle__qrCode">
        <QrCodeScreen size={220} hideInfo={true} />
      </div>
    </FocusNode>
  );
};

export const HandleInputMobile = ({ onNext, onBack }) => {
  const { setProfileData } = useDataContext();

  useSSICKeys('textInput', (data) => setProfileData(data?.text));

  return (
    <FocusNode
      focusId={'screen-scan-phone'}
      onBack={onBack}
      onSelected={onNext}
    >
      <img
        src={`${IMG_PATH}/create-handle-mobile.png`}
        alt="create-handle-mobile"
        className="full-width-img"
      />
    </FocusNode>
  );
};

export const HandleInputTV = ({ onNext, onBack }) => {
  const { setProfileData } = useDataContext();
  const [isFocused, setIsFocused] = useState(false); // State that will trigger focus

  const onRefresh = () => {
    setProfileData(generateRandomGameHandle());
  };

  useSSICKeys('Submit', () => {
    setIsFocused(false);
  });

  return (
    <FocusNode
      focusId={'screen-scan-tv'}
      orientation="vertical"
      defaultFocusChild={1}
      onMountAssignFocusTo="game-handle-save"
      onBack={onBack}
    >
      <img
        src={`${IMG_PATH}/create-handle-input.png`}
        alt="create-handle-input"
        className="full-width-img"
      />
      <div className="create-handle-input flex-col-center">
        <HandleInput setIsFocused={setIsFocused} isFocused={isFocused} />
        <Button
          focusId="game-handle-save"
          className="button-in-game"
          type="secondary"
          onSelected={onNext}
        >
          <p className="button--text">Save</p>
        </Button>
        <Button
          className="button-in-game"
          type="tertiary"
          onSelected={onRefresh}
        >
          <RefreshIconStandard />
          <p className="body-standard-heavy">Get a New Suggestion</p>
        </Button>
      </div>
    </FocusNode>
  );
};

const HandleInput = ({ isFocused, setIsFocused }) => {
  const sendMessage = useSendMessageTV();
  const { profileData, setProfileData } = useDataContext();

  const inputRef = useRef(null);

  useEffect(() => {
    if (sendMessage) {
      sendMessage('inputFocus', { state: isFocused });
    }
  }, [isFocused, sendMessage]);

  useOnReceiveMessage('textInput', (data) => {
    setProfileData(data?.text);
  });

  const handleInputChange = (e) => {
    setProfileData(e.target?.value);
  };

  return (
    <>
      <FocusNode
        focusId="game-handle-input"
        className="create-handle-input__handleinput flex-col"
        onSelected={() => setIsFocused(true)}
      >
        <label htmlFor="game-handle" className="caption">
          Game Handle
        </label>
        <input
          ref={inputRef}
          type="text"
          id="game-handle"
          className="body-standard"
          value={profileData}
          onChange={handleInputChange}
        />
      </FocusNode>
      <p className="legal">
        {profileData?.length > 0 && (
          <>
            <CircleCheckmarkIconSmall />
            Available
          </>
        )}
      </p>
    </>
  );
};

export const GamePlayWithToast = ({ onBack }) => {
  const { profileData } = useDataContext();

  return (
    <div className="screen">
      <Video
        src={`${VIDEO_PATH}/game-start.mp4`}
        alt="create-handle-game"
        className="full-width-img"
      />
      <ToastMini isToastVisible={true} isActionable={false} onBack={onBack}>
        <img
          src={`${IMG_PATH}/create-handle-game-toast.png`}
          alt="create-handle-game-toast"
          className="full-width-img"
        />
        <p className="toast-text caption">
          Welcome <b>{profileData}</b>
        </p>
      </ToastMini>
    </div>
  );
};
