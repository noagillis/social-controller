import { useState, useEffect, useCallback } from 'react';
import { useUIContext } from '@/contexts/ui';
import { useNavigate } from 'react-router-dom';
import { useOnReceiveMessage } from '@/tv/hooks/use-on-receive-message';
import { useOnRoomUpdate } from '@/tv/hooks/use-on-room-update';
import { useSendMessageTV } from '@/tv/hooks/use-send-message-tv';
import FIFALandingPage from './fifa-landing-page';
import FriendsOverlay from './friends-overlay';

import './social-controller.scss';

export const SocialControllerMobile = ({ onBack, onNext, ...props }) => {
  const { currentStep, setCurrentStep, connectedProfiles, setConnectedProfiles } = useUIContext();
  const [showFriends, setShowFriends] = useState(false);
  const [controllerCount, setControllerCount] = useState(0);
  const navigate = useNavigate();
  const sendMessageTV = useSendMessageTV();

  const handleLandingNext = () => {
    const hasController = controllerCount > 0 || connectedProfiles.length > 0;
    console.log('[social-controller] enter on landing', { controllerCount, connectedProfilesLen: connectedProfiles.length, hasController });
    if (hasController) {
      setCurrentStep(3);
    } else if (onNext) {
      onNext();
    }
  };

  useEffect(() => {
    if (currentStep === 3) {
      navigate('/fifa-menu');
    }
  }, [currentStep, navigate]);

  useOnReceiveMessage('buttonPress', (data) => {
    if (data.button === 'Profile') {
      setShowFriends(true);
    }
  });

  const handleRoomUpdate = useCallback((roomState) => {
    const count = roomState?.counts?.controller || 0;
    setControllerCount(count);
    setConnectedProfiles((prev) => prev.slice(0, count));
  }, [setConnectedProfiles]);

  useOnRoomUpdate(handleRoomUpdate);

  useOnReceiveMessage('profileSelect', useCallback((data) => {
    setConnectedProfiles((prev) => {
      if (prev.length >= 4) return prev;
      return [...prev, { name: data.name, avatar: data.avatar, isGuest: data.isGuest }];
    });
  }, [setConnectedProfiles]));

  useEffect(() => {
    if (sendMessageTV && connectedProfiles.length > 0) {
      sendMessageTV('connectedProfilesSync', { profiles: connectedProfiles });
    }
  }, [connectedProfiles, sendMessageTV]);

  const onPlayGame = () => {
    setShowFriends(false);
    setCurrentStep(3);
  };

  const onExitGame = () => {
    setShowFriends(false);
    setCurrentStep(1);
    sendMessageTV?.('exitGame', {});
  };

  return (
    <div className='screen'>
      {currentStep === 1 && <FIFALandingPage {...props} onNext={handleLandingNext} />}
      {currentStep === 2 && (
        <FriendsOverlay
          isVisible={true}
          initialTab="controllers"
          controllerCount={controllerCount}
          onBack={() => setShowFriends(false)}
          onPlayGame={onPlayGame}
          onExitGame={onExitGame}
        />
      )}
    </div>
  );
};

export const SocialControllerTV = ({ onNext, ...props }) => {
  const { currentStep, setCurrentStep, connectedProfiles, setConnectedProfiles } = useUIContext();
  const [showFriends, setShowFriends] = useState(false);
  const [controllerCount, setControllerCount] = useState(0);
  const navigate = useNavigate();
  const sendMessageTV = useSendMessageTV();

  const handleLandingNext = () => {
    const hasController = controllerCount > 0 || connectedProfiles.length > 0;
    console.log('[social-controller-tv] enter on landing', { controllerCount, connectedProfilesLen: connectedProfiles.length, hasController });
    if (hasController) {
      setCurrentStep(3);
    } else if (onNext) {
      onNext();
    }
  };

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

  // Connection logic (lifted from controller-connect)
  const handleRoomUpdate = useCallback((roomState) => {
    const count = roomState?.counts?.controller || 0;
    setControllerCount(count);
    setConnectedProfiles((prev) => prev.slice(0, count));
  }, [setConnectedProfiles]);

  useOnRoomUpdate(handleRoomUpdate);

  useOnReceiveMessage('profileSelect', useCallback((data) => {
    setConnectedProfiles((prev) => {
      if (prev.length >= 4) return prev;
      return [...prev, { name: data.name, avatar: data.avatar, isGuest: data.isGuest }];
    });
  }, [setConnectedProfiles]));

  useEffect(() => {
    if (sendMessageTV && connectedProfiles.length > 0) {
      sendMessageTV('connectedProfilesSync', { profiles: connectedProfiles });
    }
  }, [connectedProfiles, sendMessageTV]);

  const onPlayGame = () => {
    setShowFriends(false);
    setCurrentStep(3);
  };

  const onExitGame = () => {
    setShowFriends(false);
    setCurrentStep(1);
    sendMessageTV?.('exitGame', {});
  };

  // Step 2: overlay is always visible with controllers tab
  // Profile button: overlay opens with friends tab (default)
  const isOverlayVisible = currentStep === 2 || showFriends;
  const overlayInitialTab = currentStep === 2 && !showFriends ? 'controllers' : 'friends';

  return (
    <div className='screen'>
      <FIFALandingPage {...props} onNext={handleLandingNext} />
      <FriendsOverlay
        isVisible={isOverlayVisible}
        initialTab={overlayInitialTab}
        controllerCount={controllerCount}
        onBack={() => setShowFriends(false)}
        onPlayGame={onPlayGame}
        onExitGame={onExitGame}
      />
    </div>
  );
};
