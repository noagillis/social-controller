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
  const setConnectedProfiles = (v) => {
    if (typeof v === 'function') {
      setUI((prevState) => ({
        ...prevState,
        connectedProfiles: v(prevState.connectedProfiles),
      }));
    } else {
      updateUI('connectedProfiles', v);
    }
  };
  const setSocialOverlayOpen = (v) => updateUI('socialOverlayOpen', v);
  const toggleSocialOverlay = () => toggleUI('socialOverlayOpen');
  const setInvitePanelOpen = (v) => updateUI('invitePanelOpen', v);
  const setPendingInvite = (v) => updateUI('pendingInvite', v);
  const setInvitePanelTab = (v) => updateUI('invitePanelTab', v);
  const setInvitePanelView = (v) => updateUI('invitePanelView', v);
  const setHomeInviteFired = (v) => updateUI('homeInviteFired', v);
  const setHasUnreadNotification = (v) => updateUI('hasUnreadNotification', v);
  const setActiveToast = (v) => updateUI('activeToast', v);
  const addPartyMember = (member) => {
    setUI((prevState) => {
      const existing = prevState.partyMembers || [];
      const id = member.id ?? member.name;
      const name = member.name;
      // Dedupe by id OR name — invites from different entry points may use
      // different id schemes (e.g. 'f-0' vs 'inv-lilnmiso') for the same person.
      const isDuplicate = existing.some(
        (m) => (m.id ?? m.name) === id || (name && m.name === name)
      );
      if (isDuplicate) return prevState;
      return { ...prevState, partyMembers: [...existing, member] };
    });
  };
  const clearPartyMembers = () => updateUI('partyMembers', []);

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
    connectedProfiles: [],
    socialOverlayOpen: false,
    invitePanelOpen: false,
    pendingInvite: null,
    invitePanelTab: 'notifications',
    invitePanelView: 'list',
    homeInviteFired: false,
    hasUnreadNotification: false,
    activeToast: null,
    partyMembers: [],
    setIsToastDismissed,
    setPageId,
    setFocusedTitleObj,
    setCurrentStep,
    setLastGridPosition,
    setSelectedTitle,
    setConnectedProfiles,
    toggleMuted,
    setSocialOverlayOpen,
    toggleSocialOverlay,
    setInvitePanelOpen,
    setPendingInvite,
    setInvitePanelTab,
    setInvitePanelView,
    setHomeInviteFired,
    setHasUnreadNotification,
    setActiveToast,
    addPartyMember,
    clearPartyMembers,
    resetUIContext,
  };

  const [UI, setUI] = useState(defaultState);

  return <UIContext.Provider value={UI}>{children}</UIContext.Provider>;
};

const useUIContext = () => useContext(UIContext);

export { UIWrapper, useUIContext };
