import { useEffect, useRef } from 'react';
import { IMG_PATH, VIDEO_PATH } from '@/tv/settings/settings';
import Button from '@/tv/common/button';
import { ToastMini, ToastExpanded } from '../common/toast';
import Video from '@/tv/common/video';

export const StepInGame = ({ isInGame, ...props }) => {
  const videoRef = useRef();

  useEffect(() => {
    videoRef.current.play();
  }, []);

  return (
    <div className="screen">
      <Video
        ref={videoRef}
        src={`${VIDEO_PATH}/game-3.mp4`}
        className="full-width-img"
        isReadytoPlay={isInGame}
      />
      <StepToast {...props} />
    </div>
  );
};

export const StepToast = (props) => {
  return (
    <ToastMini {...props}>
      <img
        src={`${IMG_PATH}/toast-toast.png`}
        alt="toast-toast"
        className="full-width-img"
      />
    </ToastMini>
  );
};

export const StepToastExpanded = ({ onBack, onNext, ...props }) => {
  return (
    <ToastExpanded onBack={onBack} {...props}>
      <div className="toast-card">
        <img
          src={`${IMG_PATH}/toast-toast-info.png`}
          alt="toast-info"
          className="full-width-img"
        />
      </div>
      <div className="buttons flex-row">
        <Button type="in-game" className="full-width" onSelected={onBack}>
          <p className="button--text">Dismiss</p>
        </Button>
        <Button
          type="in-game"
          focusId="toast-expanded-2"
          className="full-width"
          onSelected={onNext}
        >
          <p className="button--text">View Details</p>
        </Button>
      </div>
    </ToastExpanded>
  );
};
