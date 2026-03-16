import { createContext, useContext, useState } from 'react';

const initial = {};
const UIContext = createContext(initial);

const UIWrapper = ({ children }) => {
  const updateUI = (key, val) => {
    setUI((prevState) => ({
      ...prevState,
      [key]: val,
    }));
  };

  const toggleUI = (key) => {
    setUI((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const toggleMuted = () => toggleUI('isMuted');
  const setCurrentStep = (v) => updateUI('currentStep', v);
  const setPageId = (v) => updateUI('pageId', v);
  const setSelectedTitle = (v) => updateUI('selectedTitle', v);
  const setFocusedTitleObj = (v) => updateUI('focusedTitleObj', v);
  const setLastGridPosition = (v) => updateUI('lastGridPosition', v);
  const setIsToastDismissed = (v) => updateUI('isToastDismissed', v);
  const resetUIContext = () => {
    setUI(defaultState);
  };

  const defaultState = {
    isMuted: false,
    currentStep: 1,
    pageId: 'game-handle-mobile',
    focusedTitleObj: {},
    lastGridPosition: { rowIndex: 0, columnIndex: 0 },
    selectedTitle: {},
    isToastDismissed: true,
    setIsToastDismissed,
    setPageId,
    setFocusedTitleObj,
    setCurrentStep,
    setLastGridPosition,
    setSelectedTitle,
    toggleMuted,
    resetUIContext,
  };

  const [UI, setUI] = useState(defaultState);

  return <UIContext.Provider value={UI}>{children}</UIContext.Provider>;
};

const useUIContext = () => useContext(UIContext);

export { UIWrapper, useUIContext };
