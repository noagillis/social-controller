import { useSettings } from '@netflix-internal/xd-settings';
import ChevronRightIconStandard from '@netflixdesign/hawkins-icons/dist/esm/web/ChevronRight/Standard';
import { FocusNode } from '@please/lrud';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { Children, cloneElement, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Loader from 'common/loader';
import { useDataContext } from 'contexts/data';
import { useUIContext } from 'contexts/ui';
import {
  formatLolomoData,
  formatProfileData,
  formatTitleObj,
} from 'data/data-utils';
import { formatAirtableTitle } from 'data/data-utils-airtable';
import i18n from 'data/i18n/i18n';
import useLoadData from 'hooks/use-load-data';
import useNavigate from 'hooks/use-navigate';

import Button from './button';

import './intro.scss';

//
// This screen serves two purposes:
//
// 1. It instructs users on how to use this prototype. Even designers with
//    experience using TV prototypes can frequently forget to use their keyboard
//    instead of their mouse.
//
// 2. Videos in browsers won't autoplay unless the user interacts with the webpage.
//    Pressing "Return" to move past this screen counts as an interaction, allowing
//    video to autoplay on the next screen.
//

export default function Intro({
  children,
  title,
  isPointer,
  hasGameData,
  ...props
}) {
  const go = useNavigate();
  const location = useLocation();
  const currentSubPath = location.pathname.split('/')[2];

  const { user } = useSettings();
  const { isLoading, data, status } = useLoadData(user, title, hasGameData);
  const { resetUIContext } = useUIContext();
  const {
    setProfileData,
    setLolomoData,
    setTitleData,
    setI18n,
    setAirtableData,
  } = useDataContext();

  const [introDismissed, setIntroDismissed] = useState();

  useEffect(() => {
    setI18n(i18n[user]);

    if (currentSubPath) {
      setIntroDismissed(false);
      resetUIContext();
      go('');
    }

    document.title = `${title}  -  ${user}`;
  }, [setI18n, user]);

  useEffect(() => {
    if (data.title && i18n[user]) {
      let _formattedTitleObj = formatTitleObj(data.title, i18n[user]);
      setTitleData(_formattedTitleObj);
    }

    if (data.lolomo) {
      let _formattedLolomo = formatLolomoData(
        data.lolomo,
        i18n[user],
        title === 'PDP Qual'
      );

      setLolomoData(_formattedLolomo);
    }

    if (data.profile) {
      let _formattedProfile = formatProfileData(data.profile);
      setProfileData(_formattedProfile);
    }
    if (data.airtable) {
      let _formatedGameTitles = formatAirtableTitle(data?.airtable?.gameTitles);
      setAirtableData({ ...data.airtable, gameTitles: _formatedGameTitles });
    }
  }, [user, data, setTitleData, setLolomoData, setProfileData]);

  return (
    <div className='app'>
      {!introDismissed ? (
        <div className='screen intro'>
          {isPointer ? (
            <PointerInstruction
              setIntroDismissed={setIntroDismissed}
              title={title}
              user={user}
              isLoading={isLoading}
              status={status}
              {...props}
            />
          ) : title === 'PDP Qual' ? (
            <PDPInstruction
              setIntroDismissed={setIntroDismissed}
              isLoading={isLoading}
              status={status}
              {...props}
            />
          ) : (
            <KeyboardInstruction
              setIntroDismissed={setIntroDismissed}
              title={title}
              user={user}
              isLoading={isLoading}
              status={status}
              {...props}
            />
          )}
        </div>
      ) : (
        <ChildComponent
          children={children}
          onBack={() => setIntroDismissed(false)}
        />
      )}
    </div>
  );
}

const ChildComponent = ({ children, onBack }) => {
  // Clone children and add onButtonClick prop to them
  const onDefaultBack = () => {
    console.log('Default click handler');
  };
  const enhancedChildren = Children.map(children, (child) =>
    cloneElement(child, { onBack: onBack || onDefaultBack })
  );

  return (
    <AnimatePresence>
      <motion.div
        className='screen'
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.5, ease: 'linear', delay: 0.3 },
        }}
        exit={{ opacity: 0, transition: { duration: 0.5, ease: 'linear' } }}
      >
        {enhancedChildren}
      </motion.div>
    </AnimatePresence>
  );
};

const PDPInstruction = ({ isLoading, status, ...props }) => {
  const PDPList = { high: 0, low: 1, mixed: 2 };

  const { PDPVersion } = useUIContext();
  const [focusedIndex, setFocusedIndex] = useState(PDPList[PDPVersion]);

  return (
    <>
      <div className='intro_instructions intro_instructions-pdp'>
        {' '}
        Please select a prototype using keyboard or remote control{' '}
      </div>
      {isLoading && <Loader label={status} />}
      <FocusNode
        focusId='pdp_intro'
        orientation='vertical'
        className='intro_pdp_ctas flex-col-center'
        onMountAssignFocusTo={`cta-${PDPVersion}`}
        onMove={(e) => {
          setFocusedIndex(e.nextChildIndex);
        }}
      >
        <PDPCTA label={'1'} version={'high'} {...props} />
        <PDPCTA label={'2'} version={'low'} {...props} />
        <PDPCTA label={'3'} version={'mixed'} {...props} />
      </FocusNode>
    </>
  );
};

const PDPCTA = ({ label, setIntroDismissed, version, ...props }) => {
  const animation = useAnimation();
  const { setPDPVersion } = useUIContext();

  return (
    <Button
      className='intro_cta'
      elementType={motion.div}
      animate={animation}
      focusId={`cta-${version}`}
      {...props}
      onSelected={() => {
        animation.start({
          scale: [1, 0.97, 1],
          transition: {
            ease: 'easeOut',
            duration: 0.2,
          },
        });

        setTimeout(() => {
          setPDPVersion(version);
          setIntroDismissed(true);
        }, 200);
      }}
    >
      {label}
    </Button>
  );
};

const EnterCTA = ({ label, setIntroDismissed, entryPath, ...props }) => {
  const animation = useAnimation();
  const go = useNavigate();

  return (
    <Button
      className='intro_cta'
      elementType={motion.div}
      animate={animation}
      {...props}
      onSelected={() => {
        animation.start({
          scale: [1, 0.97, 1],
          transition: {
            ease: 'easeOut',
            duration: 0.2,
          },
        });

        setTimeout(() => {
          setIntroDismissed(true);
          go(entryPath);
        }, 200);
      }}
    >
      {label}
      <ChevronRightIconStandard />
    </Button>
  );
};

const PointerInstruction = ({ title, t, isLoading, status, ...props }) => {
  return (
    <>
      <div className='intro_name'>{title}</div>
      <div className='intro_instructions'>
        {`Yes you can use Mouse for this prototype!`}
      </div>

      <ShortKeys t={t} />
      {isLoading ? (
        <Loader label={status} />
      ) : (
        <ClickableCTA
          className='pointer-cta'
          label={'Click to start'}
          {...props}
        />
      )}
    </>
  );
};

const KeyboardInstruction = ({
  title,
  user,
  t,
  isLoading,
  status,
  ...props
}) => {
  return (
    <>
      <div className='intro_name'>{title}</div>
      <div className='intro_user'>{user}</div>
      <div
        className='intro_instructions'
        dangerouslySetInnerHTML={{ __html: t['intro_header'] }}
      />

      <div className='intro_icons'>
        <div className='intro_iconContainer'>
          <img
            className='intro_iconKeyboard'
            src={`${
              import.meta.env.BASE_URL
            }images/intro/instructions-keyboard.png`}
            alt='Use your keyboard to navigate this prototype'
          />
        </div>
        <div className='intro_iconContainer'>
          <img
            className='intro_iconMouse'
            src={`${
              import.meta.env.BASE_URL
            }images/intro/instructions-mouse.png`}
            alt="Don't use a mouse to navigate this prototype"
          />
        </div>
      </div>

      <ShortKeys t={t} />
      {isLoading ? (
        <Loader label={status} />
      ) : (
        <EnterCTA label={t['intro_enter']} {...props} />
      )}
    </>
  );
};

const ShortKeys = ({ t }) => {
  return (
    <div className='intro_instructions intro_shortkeys'>
      <li>
        {' '}
        <b>ESC: </b>
        {'Back'}
      </li>
      <li>
        {' '}
        <b>M: </b>
        {t['intro_cta_mute']}
      </li>
      <li>
        {' '}
        <b>S: </b>
        {t['intro_cta_settings']}
      </li>
    </div>
  );
};

const ClickableCTA = ({ label, setIntroDismissed, entryPath, ...props }) => {
  const animation = useAnimation();
  const go = useNavigate();
  return (
    <Button
      className='intro_cta'
      elementType={motion.div}
      animate={animation}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      {...props}
      onSelected={() => {
        setTimeout(() => {
          setIntroDismissed(true);
          go(entryPath);
        }, 200);
      }}
    >
      {label}
    </Button>
  );
};
