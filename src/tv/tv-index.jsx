import { useState, useEffect } from 'react';
import { SettingsPanel } from '@netflix-internal/xd-settings';
import { startCase } from 'lodash';
import { Outlet, useNavigate } from 'react-router-dom';
import { FocusRoot, FocusNode } from '@please/lrud';
import { useDataContext } from '@/contexts/data';
import { useUIContext } from '@/contexts/ui';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSendMessageTV } from './hooks/use-send-message-tv';
import { useOnReceiveMessage } from './hooks/use-on-receive-message';
import { SSICHelpers } from './components/ssic-helpers/ssic-helpers';

import useLoadData from './hooks/use-load-data';

import Loader from './common/loader';

import './tv-index.css';

export default function TvIndex() {
  return (
    <TvAppWrapper>
      <SSICHelpers />
    </TvAppWrapper>
  );
}

function TvAppWrapper({ children }) {
  const navigate = useNavigate();
  const sendMessage = useSendMessageTV();

  const { setGameData } = useDataContext();
  const { setSelectedTitle, pageId, currentStep, toggleMuted } = useUIContext();
  const { isLoading, data, status } = useLoadData();
  const [isSettingsPanelVisible, setIsSettingsPanelVisible] = useState(false);

  useHotkeys('s', () => {
    setIsSettingsPanelVisible((isVisible) => !isVisible);
  });

  useHotkeys('m', () => {
    toggleMuted();
  });

  useHotkeys('space', () => {
    navigate('/');
  });

  useOnReceiveMessage('navigate', (data) => {
    if (data?.path) {
      navigate(data.path);
    }
  });

  useEffect(() => {
    setGameData(data);
    setSelectedTitle(data?.gameTitles?.['oxenfree']);
  }, [data, setGameData]);

  useEffect(() => {
    if (sendMessage) {
      sendMessage('pageUpdate', { pageId: pageId, step: currentStep });
    }
  }, [sendMessage, pageId, currentStep]);

  return (
    <FocusRoot pointerEvents={true}>
      <FocusNode focusId="tv" className="tv">
        {children}
        {isLoading && <Loader label={status} />}
        <Outlet /> {/* This renders the subroutes */}
      </FocusNode>
      <SettingsPanel
        generateSettingDisplayName={(settingName) => startCase(settingName)}
        isVisible={isSettingsPanelVisible}
        onClickClose={() => setIsSettingsPanelVisible(false)}
      />
    </FocusRoot>
  );
}
