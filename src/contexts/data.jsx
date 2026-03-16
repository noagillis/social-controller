import { createContext, useContext, useState } from 'react';

const initial = {};
const DataContext = createContext(initial);

const DataWrapper = ({ children }) => {
  const set = (key, val) => {
    updateData((prevState) => {
      const newState = { ...prevState };
      newState[key] = val;
      return newState;
    });
  };

  const setProfileData = (v) => set('profileData', v);
  const setLolomoData = (v) => set('lolomoData', v);
  const setGameData = (v) => set('gameData', v);
  const setTitleData = (v) => set('titleData', v);
  const setAllProfiles = (v) => set('allProfiles', v);
  const setI18n = (v) => set('i18n', v);

  const updateTitleAsset = (titleRef, asset) => {
    updateData((prevState) => {
      const newState = { ...prevState };
      let _titleObj = { ...newState.titles[titleRef], ...asset };

      newState.titles = {
        ...newState.titles,
        [titleRef]: _titleObj,
      };

      return newState;
    });
  };

  const defaultState = {
    profileData: 'EpicPlatypus17',
    lolomoData: [],
    gameData: {},
    titleData: {},
    allProfiles: [], //for profile-gate
    i18n: {},
    setGameData,
    setTitleData,
    setProfileData,
    setAllProfiles,
    setLolomoData,
    updateTitleAsset,
    setI18n,
  };
  const [Data, updateData] = useState(defaultState);
  return <DataContext.Provider value={Data}>{children}</DataContext.Provider>;
};

const useDataContext = () => useContext(DataContext);

export { DataWrapper, useDataContext };
