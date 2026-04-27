import { motion, AnimatePresence } from 'framer-motion';
import { useUIContext } from '@/contexts/ui';
import { useDataContext } from '@/contexts/data';
import { PROFILES } from '@/controller/pages/profile-picker/profile-picker';
import { SSICNav } from '@/controller/pages/ssic/ssic-components';
import './social-controller-header.scss';

const ITEM_TRANSITION = { duration: 0.32, ease: [0.32, 0.72, 0, 1] };
const PILL_TRANSITION = { duration: 0.42, ease: [0.32, 0.72, 0, 1] };
const STACK_TRANSITION = { duration: 0.32, ease: [0.32, 0.72, 0, 1] };

function MicIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"
        fill="white"
      />
      <path
        d="M19 10v2a7 7 0 0 1-14 0v-2"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line
        x1="12"
        y1="19"
        x2="12"
        y2="23"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function VoiceActivityIndicator() {
  return (
    <div className="social-controller-header__voice-activity" aria-hidden="true">
      <span className="social-controller-header__voice-pip" />
      <span className="social-controller-header__voice-pip" />
      <span className="social-controller-header__voice-pip" />
      <span className="social-controller-header__voice-pip" />
    </div>
  );
}

function PartyAvatar({ member, depth }) {
  return (
    <motion.div
      layout
      className="social-controller-header__stack-avatar"
      style={{ zIndex: 10 - depth }}
      initial={{ opacity: 0, x: -12, scale: 0.6 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -12, scale: 0.6 }}
      transition={STACK_TRANSITION}
    >
      {member.avatar ? (
        <img src={member.avatar} alt={member.name} />
      ) : (
        <div className="social-controller-header__stack-avatar-placeholder" />
      )}
    </motion.div>
  );
}

export default function SocialControllerHeader() {
  const {
    socialOverlayOpen,
    partyMembers = [],
    currentStep,
    toggleSocialOverlay,
    setInvitePanelOpen,
    setInvitePanelTab,
  } = useUIContext();
  const { profileData } = useDataContext();

  const showVoiceGroup = currentStep !== 1 && partyMembers.length >= 1;
  const useCondensedCount = partyMembers.length >= 2;

  const selfProfile = PROFILES.find((p) => p.name === profileData);
  const selfAvatar = selfProfile?.avatar;
  const selfName = profileData || 'Player';

  const handleVoiceClick = () => {
    setInvitePanelTab('friends');
    setInvitePanelOpen(true);
  };

  return (
    <div className={`social-controller-header ${socialOverlayOpen ? '--right' : '--center'}`}>
      <motion.div
        layout
        transition={PILL_TRANSITION}
        className="social-controller-header__pill"
      >
        <AnimatePresence initial={false}>
          {!socialOverlayOpen && (
            <motion.div
              key="home"
              layout
              className="social-controller-header__item social-controller-header__item--collapsing"
              initial={{ opacity: 0, width: 0, marginLeft: -8 }}
              animate={{ opacity: 1, width: 'auto', marginLeft: 0 }}
              exit={{ opacity: 0, width: 0, marginLeft: -8 }}
              transition={ITEM_TRANSITION}
            >
              <SSICNav action="Home" />
            </motion.div>
          )}
          {!socialOverlayOpen && (
            <motion.div
              key="netflix"
              layout
              className="social-controller-header__item social-controller-header__item--collapsing"
              initial={{ opacity: 0, width: 0, marginLeft: -8 }}
              animate={{ opacity: 1, width: 'auto', marginLeft: 0 }}
              exit={{ opacity: 0, width: 0, marginLeft: -8 }}
              transition={ITEM_TRANSITION}
            >
              <SSICNav action="NetflixN" />
            </motion.div>
          )}
        </AnimatePresence>

        {showVoiceGroup ? (
          <motion.div layout className="social-controller-header__voice-group">
            <motion.button
              layout
              type="button"
              className="social-controller-header__party-pill"
              onClick={toggleSocialOverlay}
              aria-label="Open social"
            >
              <div className="social-controller-header__party-pill-avatar">
                {selfAvatar ? (
                  <img src={selfAvatar} alt={selfName} />
                ) : (
                  <div className="social-controller-header__party-pill-avatar-placeholder" />
                )}
              </div>
              {useCondensedCount ? (
                <motion.span
                  layout
                  key="party-count"
                  className="social-controller-header__party-pill-count"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={STACK_TRANSITION}
                >
                  +{partyMembers.length}
                </motion.span>
              ) : (
                <AnimatePresence initial={false}>
                  {partyMembers.map((member, idx) => (
                    <PartyAvatar
                      key={member.id ?? member.name}
                      member={member}
                      depth={idx + 1}
                    />
                  ))}
                </AnimatePresence>
              )}
            </motion.button>
            <motion.button
              layout
              type="button"
              className="social-controller-header__voice-pill"
              onClick={handleVoiceClick}
              aria-label="Voice chat"
            >
              <MicIcon />
              <VoiceActivityIndicator />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="social-controller-header__item social-controller-header__item--profile"
          >
            <div className="social-controller-header__profile-avatar">
              <SSICNav action="Profile" />
            </div>
          </motion.div>
        )}

        <motion.div layout className="social-controller-header__item">
          <SSICNav action="Notifications" />
        </motion.div>
      </motion.div>
    </div>
  );
}
