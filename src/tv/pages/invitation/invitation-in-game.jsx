import { useState, useEffect, useRef } from 'react';
import Button from '@/tv/common/button';
import { useSettings } from '@netflix-internal/xd-settings';
import { ToastMini, ToastExpanded } from '../common/toast';
import { IMG_PATH, VIDEO_PATH } from '@/tv/settings/settings';
import Video from '@/tv/common/video';

export function InvitationInGame({ isInGame, ...props }) {
  const videoRef = useRef();

  useEffect(() => {
    videoRef.current.play();
  }, []);

  return (
    <div className="screen">
      <Video
        src={`${VIDEO_PATH}/game-2.mp4`}
        className="full-width-img"
        ref={videoRef}
        isReadytoPlay={isInGame}
      />
      <StepToast {...props} />
    </div>
  );
}

const StepToast = (props) => {
  return (
    <ToastMini {...props}>
      <img
        src={`${IMG_PATH}/invitation-toast.png`}
        alt="invitation-toast"
        className="full-width-img"
      />
    </ToastMini>
  );
};

export function StepToastExpanded({ onBack, onMounted, isToastVisible }) {
  const [accepted, setAccepted] = useState(false);
  const toastDurationTimeout = useRef();
  const { nonActionableToastDuration } = useSettings();

  useEffect(() => {
    if (accepted && isToastVisible) {
      toastDurationTimeout.current = setTimeout(() => {
        onBack();
      }, nonActionableToastDuration);
    }

    if (!isToastVisible) {
      clearTimeout(toastDurationTimeout.current);
    }

    return () => {
      toastDurationTimeout.current &&
        clearTimeout(toastDurationTimeout.current);
    };
  }, [accepted, isToastVisible, nonActionableToastDuration]);

  return (
    <ToastExpanded
      isToastVisible={isToastVisible}
      onMounted={onMounted}
      onBack={onBack}
      onSelected={() => {
        accepted && onBack();
      }}
    >
      <p className="title-heavy">Connect with this player? </p>
      <div className="player-card">
        <img
          src={`${IMG_PATH}/invitation-toast-player.png`}
          alt="invitation-toast"
          className="full-width-img"
        />
      </div>
      <div className="buttons flex-row">
        {accepted ? (
          <p className="body-small-heavy">Request Accepted!</p>
        ) : (
          <>
            <Button type="in-game" className="full-width" onSelected={onBack}>
              <p className="button--text">Dismiss</p>
            </Button>
            <Button
              type="in-game"
              className="full-width"
              onSelected={() => {
                setAccepted(true);
              }}
            >
              <p className="button--text">Accept</p>
            </Button>
          </>
        )}
      </div>
    </ToastExpanded>
  );
}
