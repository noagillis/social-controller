import { useEffect, useState, useCallback } from 'react';
import { FocusNode, useSetFocus } from '@please/lrud';
import { motion, AnimatePresence } from 'framer-motion';
import { NLogo } from '@/tv/common/icons';
import { IMG_PATH, VIDEO_PATH } from '@/tv/settings/settings';
import Button from '@/tv/common/button';
import { SUB_MENUS } from '../page-constants';
import classNames from 'classnames';
import Video from '@/tv/common/video';
import { uiTransition } from '@/tv/utils/motion';
import { useMountAnimationComplete } from '@/tv/hooks/use-mount-animation-complete';

import './dashboard.scss';

export const StepInGame = (props) => {
  return (
    <FocusNode focusId={'in-game-mid'}>
      <Video
        src={`${VIDEO_PATH}/game-1.mp4`}
        className="full-width-img"
        {...props}
      />
    </FocusNode>
  );
};

export const SubMenu = ({
  onBack,
  isAchievementOpen,
  onResume,
  isVisible = false,
  onExit,
}) => {
  const [focusedIndex, setFocusedIndex] = useState(3);
  const [showSubPage, setShowSubPage] = useState('');
  const setFocus = useSetFocus();

  const handleSelected = useCallback(
    (Nav) => {
      if (Nav.label === 'Back') {
        onBack();
      } else if (Nav?.isActive) {
        setShowSubPage(Nav.label);
      }
    },
    [onBack]
  );

  const handleSubMenuDown = useCallback(() => {
    setShowSubPage('');
    setFocus('dashboard-menu');
  }, [setFocus]);

  const handleAnimationComplete = useMountAnimationComplete(isVisible, () => {
    setFocus(isAchievementOpen ? 'dashboard-achievements' : 'dashboard-menu');
  });

  useEffect(() => {
    if (isAchievementOpen) {
      setShowSubPage('Achievements');
      setFocusedIndex(4);
    } else {
      setShowSubPage('');
      setFocusedIndex(3);
    }

    if (!isVisible) {
      setShowSubPage('');
    }
  }, [isAchievementOpen, isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <FocusNode
          elementType={motion.div}
          focusId={`dashboard`}
          className="screen"
          onAnimationComplete={handleAnimationComplete}
          isTrap={true}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: uiTransition }}
          exit={{ opacity: 0, y: 10, transition: uiTransition }}
        >
          <div className="dashboard__gradient -top" />
          <div className="dashboard__gradient -bottom" />
          <NLogo className="dashboard__logo" />
          <FocusNode
            focusId={'dashboard-menu'}
            className={classNames(
              'dashboard__menu flex-row-center abs-center-v',
              {
                isOnSubMenu: showSubPage !== '',
              }
            )}
            onBack={onBack}
            orientation={'horizontal'}
            defaultFocusChild={focusedIndex}
            onMove={(e) => {
              setFocusedIndex(e.nextChildIndex);
            }}
          >
            {SUB_MENUS.map((Nav, idx) => (
              <FocusNode
                className={`dashboard__menu__item flex-col-center`}
                key={`nav_${idx}`}
                focusId={`nav_${idx}`}
                onSelected={() => handleSelected(Nav)}
              >
                <Nav.icon className="dashboard__menu__item__icon" />
                <p className="dashboard__menu__item__label body-standard">
                  {Nav.label}
                </p>
              </FocusNode>
            ))}
          </FocusNode>
          {showSubPage === 'Achievements' && (
            <AchievementRow onBack={handleSubMenuDown} />
          )}
          {showSubPage === 'Controllers' && (
            <ControllersRow onBack={handleSubMenuDown} />
          )}
          {showSubPage === 'Exit' && (
            <ExitRow
              onBack={handleSubMenuDown}
              onExit={onExit}
              onResume={onResume}
            />
          )}
        </FocusNode>
      )}
    </AnimatePresence>
  );
};

export const ExitRow = ({ onBack, onExit, onResume }) => {
  const setFocus = useSetFocus();

  useEffect(() => {
    setFocus('dashboard-exit');
  }, [setFocus]);

  return (
    <div className="screen flex-col-center">
      <div className="dashboard-menu-gradient" />
      <FocusNode
        focusId={'dashboard-exit'}
        className="dashboard-exit flex-col-center"
        defaultFocusChild={1}
        onBack={onBack}
        onDown={onBack}
        isTrap={true}
      >
        <p className="heading header-large">Exit Game?</p>
        <p className="subtitle">Any unsaved progress will be lost.</p>
        <div className="dashboard-exit-actions flex-row">
          <Button type="in-game" onSelected={onResume}>
            <p className="body-standard-heavy">Continue Playing</p>
          </Button>
          <Button type="in-game" onSelected={onExit}>
            <p className="body-standard-heavy">Exit Game</p>
          </Button>
        </div>
      </FocusNode>
    </div>
  );
};

export const ControllersRow = ({ onBack }) => {
  const setFocus = useSetFocus();
  useEffect(() => {
    setFocus('dashboard-controller');
  }, [setFocus]);

  return (
    <FocusNode
      className="screen dashboard-controllers"
      focusId={'dashboard-controller'}
      onBack={onBack}
      onDown={onBack}
    >
      <div className="dashboard-menu-gradient" />
      <img
        src={`${IMG_PATH}/dashboard-controllers.png`}
        alt="dashboard-controllers"
      />
    </FocusNode>
  );
};

export const AchievementRow = ({ onBack }) => {
  const setFocus = useSetFocus();
  const [focusedIndex, setFocusedIndex] = useState(0);

  const CardWidth = 144 + 8;
  const unlockedItemLength = 5;
  const lockedItemLength = 7;
  const allLength = lockedItemLength + unlockedItemLength;

  useEffect(() => {
    setFocus('dashboard-achievements');
  }, [setFocus]);

  return (
    <div className="dashboard-achievements screen flex-col">
      <div className="dashboard-menu-gradient" />
      <p className="dashboard-achievements__header header-standard">
        Achievements
      </p>
      <img
        src={`${IMG_PATH}/dashboard-achievement-tropy.png`}
        alt="dashboard-achievement-tropy"
        className="dashboard-achievements__trophy"
      />
      <FocusNode
        focusId={'dashboard-achievements'}
        onBack={onBack}
        onDown={onBack}
        isTrap={true}
        orientation={'horizontal'}
        className="dashboard-achievements__row flex-row"
        onRight={() => {
          setFocusedIndex(
            focusedIndex < allLength ? focusedIndex + 1 : focusedIndex
          );
        }}
        onLeft={() => {
          setFocusedIndex(focusedIndex > 0 ? focusedIndex - 1 : focusedIndex);
        }}
      >
        <div className="dashboard-achievements__row__focusring" />
        <div className="dashboard-achievements__row__item flex-col">
          <p className="subtitle-heavy">
            {focusedIndex < unlockedItemLength ? 'Unlocked' : 'Locked'}
          </p>
          <motion.div
            className="item__row flex-row"
            animate={{
              x: -focusedIndex * CardWidth,
              transition: { ease: 'easeOut' },
            }}
          >
            {Array.from({ length: allLength }, (_, index) => (
              <motion.img
                animate={{
                  opacity: focusedIndex > index ? 0 : 1,
                  transition: { ease: 'easeOut' },
                }}
                key={`unlocked_${index}`}
                src={`${IMG_PATH}/achievement-card-${
                  index < unlockedItemLength ? index : 'unlocked'
                }.png`}
                alt={`item-${index}`}
                className="item"
              />
            ))}
          </motion.div>
        </div>
      </FocusNode>
    </div>
  );
};
