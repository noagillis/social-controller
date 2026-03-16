import { useSettings } from '@netflix-internal/xd-settings';
import { useUIContext } from '@/contexts/ui';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useOnRoomUpdate } from '../../hooks/use-on-room-update';
import { useRoomId } from '../../hooks/use-room-id';
import useBrowserFocus from '../../hooks/use-browser-focus'; // Import the custom hook

import useSSICKeys from '../../hooks/use-ssic-keys';
import NLogo from '@/tv/assets/svgs/n-logo.svg';

import './ssic-helpers.scss';

export function SSICHelpers() {
  const { pageId, currentStep } = useUIContext();
  const [hasController, setHasController] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const { showHelpers } = useSettings();

  const [mostRecentAction, setMostRecentAction] = useState('');
  const isFocused = useBrowserFocus();

  useSSICKeys('all', (data) => {
    setMostRecentAction(data);
  });

  useHotkeys('c', () => {
    setShowInfo((isOpen) => !isOpen);
  });

  // The room state is an object that keeps track of how many clients are
  // connected. In this example we use it to determine if at least one
  // controller is connected.

  useOnRoomUpdate((roomState) => {
    if (roomState?.counts?.controller > 0) {
      console.log('roomstate');
      console.log(roomState);
      setHasController(true);
    }
    return () => {
      setHasController(false);
    };
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (hasController) {
      setShowInfo(false);
    } else {
      if (location.pathname !== '/' && location.pathname !== '/menu') {
        navigate('/');
      }
    }
  }, [hasController]);

  return (
    <div className="ssic-helpers flex-col">
      {showHelpers && (
        <div className="ssic-helpers__tips flex-col">
          {pageId !== 'home' && (
            <p>
              Step <b>{currentStep}</b>
            </p>
          )}

          <p>
            Browser:
            <b style={{ color: isFocused ? 'green' : 'red' }}>
              {' '}
              {isFocused && 'Ready'}
              {!isFocused && 'Out of focus'}
            </b>
            {', '}
            Controller:
            <b style={{ color: hasController ? 'green' : 'red' }}>
              {' '}
              {hasController && 'Ready'}
              {!hasController && 'Not connected'}
            </b>
          </p>

          <p>
            Controller: <b>C</b>
          </p>
          <p>
            Keyboard: <b>Arrow keys</b>, <b>Enter</b>, <b>Esc</b>
          </p>
        </div>
      )}
      {showInfo && (
        <div className="ssic-helpers__qrCode">
          <ControllerConnectedText
            hasController={hasController}
            className={'heading--s'}
          />
          <QrCodeScreen />
          <div className="flex-col-center sidebarItem">
            <p className="heading--s">
              {mostRecentAction
                ? `Button Press:  ${mostRecentAction}`
                : `Waiting for action...`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function ControllerConnectedText({ hasController, className = '' }) {
  const roomId = useRoomId();
  return (
    <p className={className}>
      Room: <b>{roomId}</b>, Controller:
      <b style={{ color: hasController ? 'green' : 'red' }}>
        {' '}
        {hasController?.toString()?.toUpperCase()}
      </b>
    </p>
  );
}

export function QrCodeScreen({ size = 200 }) {
  const roomId = useRoomId();
  const qrCodeValue = window.location.origin + '/controller?roomId=' + roomId;

  return (
    <div className="qrCodeContainer">
      <QRCodeSVG
        value={qrCodeValue}
        size={size}
        imageSettings={{
          src: NLogo,
          height: 26,
          width: 16,
          excavate: true,
        }}
      />
    </div>
  );
}
