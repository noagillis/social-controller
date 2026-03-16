import { useState, useEffect } from 'react';
import { useUIContext } from '@/contexts/ui';
import { useNavigate } from 'react-router-dom';
import { useOnReceiveMessage } from '@/tv/hooks/use-on-receive-message';
import FIFALandingPage from './fifa-landing-page';
import ControllerConnect from './controller-connect';

import './social-controller.scss';

export const SocialControllerMobile = ({ onBack, ...props }) => {
  const { currentStep } = useUIContext();
  const [showFriends, setShowFriends] = useState(false);

  useOnReceiveMessage('buttonPress', (data) => {
    if (data.button === 'Profile') {
      setShowFriends(true);
    }
  });

  return (
    <div className='screen'>
      {currentStep === 1 && <FIFALandingPage {...props} />}
      {currentStep === 2 && (
        <ControllerConnect
          {...props}
          showFriends={showFriends}
          onCloseFriends={() => setShowFriends(false)}
        />
      )}
    </div>
  );
};

export const SocialControllerTV = (props) => {
  const { currentStep, setCurrentStep } = useUIContext();
  const [showFriends, setShowFriends] = useState(false);
  const navigate = useNavigate();

  // Navigate to fifa-menu route when step reaches 3
  useEffect(() => {
    if (currentStep === 3) {
      navigate('/fifa-menu');
    }
  }, [currentStep, navigate]);

  useOnReceiveMessage('buttonPress', (data) => {
    if (data.button === 'Profile') {
      console.log('Profile (N) button pressed, showing friends overlay');
      setShowFriends(true);
    }
  });

const onPlayGame = () => {
    setShowFriends(false);
    setCurrentStep(3);
  };

  return (
    <div className='screen'>
      <FIFALandingPage {...props} />
      {currentStep === 2 && (
        <ControllerConnect
          {...props}
          showFriends={showFriends}
          onCloseFriends={() => setShowFriends(false)}
          onPlayGame={onPlayGame}
        />
      )}
    </div>
  );
};
