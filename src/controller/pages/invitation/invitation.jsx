import { useState, useEffect, useRef } from 'react';
import { useUIContext } from '@/contexts/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@netflix-internal/xd-settings';
import { SSICToast } from '../../common/ssic-toast';
import SSIC from '../ssic/ssic';
import { XIconStandard } from '../../common/icons';
import ButtonWrapper from '../../common/button-wrapper';
import { useSendMessage } from '../../hooks/use-send-message';
import { IMG_PATH } from '@/tv/settings/settings';
import { SSICDashboard } from '@/controller/common/ssic-dashboard';

import './invitation.scss';

const InvitationMobile = () => {
  const { currentStep, setCurrentStep } = useUIContext();
  const [isModalDismissed, setIsModalDismissed] = useState(false);

  const onBack = () => {
    setIsModalDismissed(true);
    setCurrentStep(2);
  };

  return (
    <SSIC isInGame={currentStep === 1}>
      <SSICToast className="toast-invitation" onBack={onBack}>
        <img
          src={`${IMG_PATH}/profile-friend.png`}
          alt="profile"
          className="full-width-img"
        />
        <p className="body-small-heavy">New friend request</p>
      </SSICToast>

      {currentStep === 3 && (
        <>
          {isModalDismissed ? (
            <SSICDashboard onBack={onBack} />
          ) : (
            <InvitationModal onBack={onBack} />
          )}
        </>
      )}
    </SSIC>
  );
};

const InvitationModal = ({ onBack }) => {
  const [accepted, setAccepted] = useState(false);
  const toastDurationTimeout = useRef();
  const sendMessage = useSendMessage();

  const { nonActionableToastDuration } = useSettings();

  useEffect(() => {
    if (accepted && sendMessage) {
      toastDurationTimeout.current = setTimeout(() => {
        sendMessage('buttonPress', { button: 'B' });
      }, nonActionableToastDuration);
    }
    return () => {
      toastDurationTimeout.current &&
        clearTimeout(toastDurationTimeout.current);
    };
  }, [accepted]);

  return (
    <AnimatePresence>
      <motion.div
        className="ssic-invitation flex-col-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
      >
        <div className="ssic-invitation__modal flex-col-center">
          <div className="header flex-row-center">
            <ButtonWrapper onClick={onBack} action="B" className="modal-close">
              <XIconStandard className="closeIcon" />
            </ButtonWrapper>
            <p className="modal-title title-heavy">Connect with this player?</p>
          </div>
          <img
            src={`${IMG_PATH}/mobile-player-card.png`}
            alt="player"
            className="modal-content"
          />
          {accepted ? (
            <div className="modal-actions flex-center">
              <p className="body-small-heavy">Request Accepted!</p>
            </div>
          ) : (
            <div className="modal-actions flex-row">
              <ButtonWrapper
                className="button -secondary full-width"
                onClick={onBack}
                action="B"
              >
                <p className="button--text">{'Dismiss'}</p>
              </ButtonWrapper>
              <ButtonWrapper
                className="button -primary full-width"
                onClick={() => {
                  setAccepted(true);
                }}
              >
                <p className="button--text">{'Accept'}</p>
              </ButtonWrapper>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const InvitationTV = () => {
  const { currentStep } = useUIContext();
  return <SSIC isInGame={currentStep <= 2} />;
};

export { InvitationMobile, InvitationTV };
