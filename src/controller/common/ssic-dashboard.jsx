import { useState } from 'react';
import { IMG_PATH } from '@/tv/settings/settings';
import Trophy from '@/controller/assets/trophy.png';
import { profilePageRight } from '@/controller/pages/page-constants';
import { useDataContext } from '@/contexts/data';

import {
  ChevronRightIconStandard,
  XIconStandard,
  Profile,
  GreenDot,
} from './icons';

import ButtonWrapper from './button-wrapper';
import ScreenWrapper from './screen-wrapper';
import SSICTopNav from './ssic-topnav';

import './ssic-dashboard.scss';

export const SSICDashboard = ({
  showAchievements = false,
  onBack = () => {},
}) => {
  const [showSubpage, setShowSubpage] = useState(showAchievements);
  return (
    <>
      <SSICProfile
        onNext={() => {
          setShowSubpage(true);
        }}
        onBack={onBack}
      />

      {showSubpage && <SSICAchievement onBack={() => setShowSubpage(false)} />}
    </>
  );
};

const SSICAchievement = ({ onBack = () => {} }) => {
  return (
    <ScreenWrapper>
      <SSICTopNav onBack={onBack} backLabel="Achievements">
        <img src={Trophy} className="icon" alt="trophy" />
        <p className="body-standard-heavy">{'5 / 12'}</p>
      </SSICTopNav>
      <div className="controller-screen__body flex-row ssic-dashboard-achievement">
        <div className="achievement-row flex-col">
          <div className="row-content">
            <img
              src={`${IMG_PATH}/mobile-achievements.png`}
              alt="achievement"
            />
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
};

const SSICProfile = ({ onNext = () => {}, onBack = () => {} }) => {
  const { profileData } = useDataContext();

  return (
    <ScreenWrapper>
      <SSICTopNav onBack={onBack} backAction="B" />
      <div className="controller-screen__body flex-row ssic-dashboard-profile">
        <div className="item-col flex-col --left">
          <ButtonWrapper className="item-row --l">
            <Profile className="userIcon" />
            <div className="label flex-col">
              <span className="flex-row body-standard-heavy">Glenn</span>
              <span className="flex-row legal-heavy">
                <img src="/images/game-controller.png" alt="game controller" />
                {profileData}
              </span>
              <span className="flex-row body-small">
                <GreenDot />
                Playing Oxenfreen
              </span>
            </div>
            <ChevronRightIconStandard className="rightIcon" />
          </ButtonWrapper>
          <ButtonWrapper className="item-row">
            <XIconStandard />{' '}
            <p className="body-standard-heavy label">Exit Game</p> <span></span>
          </ButtonWrapper>
        </div>
        <div className="item-col flex-col --right">
          {profilePageRight.map((item, index) => (
            <ButtonWrapper
              scaleAmount={0.97}
              key={index}
              className="item-row"
              onClick={() => item?.isInteractive && onNext()}
            >
              {item.isInteractive ? (
                <img src={Trophy} className="icon" alt="trophy" />
              ) : (
                <item.Icon className="icon" />
              )}
              <span className="body-standard-heavy label">{item.Label}</span>
              <span className="body-small">{item.Sub}</span>
            </ButtonWrapper>
          ))}
        </div>
      </div>
    </ScreenWrapper>
  );
};
