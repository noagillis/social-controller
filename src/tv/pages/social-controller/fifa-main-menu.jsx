import { useState, useCallback, useEffect } from 'react';
import { FocusNode } from '@please/lrud';
import { useNavigate } from 'react-router-dom';
import { useUIContext } from '@/contexts/ui';
import { useOnReceiveMessage } from '@/tv/hooks/use-on-receive-message';
import { useSendMessageTV } from '@/tv/hooks/use-send-message-tv';
import FriendsOverlay from './friends-overlay';

import './fifa-main-menu.scss';

const IMG_PATH = import.meta.env.BASE_URL + 'images';

export default function FIFAMainMenu({ onNext, onBack }) {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const { setCurrentStep } = useUIContext();
  const navigate = useNavigate();
  const sendMessageTV = useSendMessageTV();

  // Ensure step is 3 when this component mounts
  useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);

  const goBack = useCallback(() => {
    setCurrentStep(2);
    navigate('/f10');
  }, [setCurrentStep, navigate]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (showStartMenu) {
          if (onNext) onNext();
        } else {
          setShowStartMenu(true);
        }
      } else if (e.key === '2') {
        e.preventDefault();
        goBack();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        if (showFriends) {
          setShowFriends(false);
        } else if (showStartMenu) {
          setShowStartMenu(false);
        } else {
          goBack();
        }
      }
    },
    [onNext, showStartMenu, showFriends, goBack]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // B button on controller goes back
  useOnReceiveMessage('buttonPress', (data) => {
    if (data.button === 'B') {
      if (showFriends) {
        setShowFriends(false);
      } else if (showStartMenu) {
        setShowStartMenu(false);
      } else {
        goBack();
      }
    }
    if (data.button === 'Profile') {
      console.log('Profile (N) button pressed, showing friends overlay');
      setShowFriends(true);
    }
  });

  const bgSrc = showStartMenu
    ? `${IMG_PATH}/fifa-in-game.png`
    : `${IMG_PATH}/FIFA-main-menu-bg.jpg`;

  return (
    <FocusNode focusId="fifa-main-menu" onSelected={() => {
      if (showStartMenu) {
        if (onNext) onNext();
      } else {
        setShowStartMenu(true);
      }
    }} onBack={() => {
      if (showFriends) {
        setShowFriends(false);
      } else if (showStartMenu) {
        setShowStartMenu(false);
      } else {
        goBack();
      }
    }}>
      <div className="fifa-main-menu">
        <div className="fifa-main-menu__bg">
          <img
            src={bgSrc}
            alt="FIFA 26"
            className="fifa-main-menu__bg-img"
          />
        </div>
      </div>
      <FriendsOverlay
        isVisible={showFriends}
        onBack={() => setShowFriends(false)}
        onExitGame={() => {
          setShowFriends(false);
          sendMessageTV?.('exitGame', {});
          // Set step to 1 after a tick so the pageUpdate broadcast fires after navigation
          navigate('/f10');
          setTimeout(() => setCurrentStep(1), 50);
        }}
      />
    </FocusNode>
  );
}
