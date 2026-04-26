import { motion, AnimatePresence } from 'framer-motion';
import { useUIContext } from '@/contexts/ui';
import { SSICNav } from '@/controller/pages/ssic/ssic-components';
import './social-controller-header.scss';

const ITEM_TRANSITION = { duration: 0.32, ease: [0.32, 0.72, 0, 1] };
const PILL_TRANSITION = { duration: 0.42, ease: [0.32, 0.72, 0, 1] };
const STACK_TRANSITION = { duration: 0.32, ease: [0.32, 0.72, 0, 1] };

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
  const { socialOverlayOpen, partyMembers = [], currentStep } = useUIContext();
  const showStack = currentStep !== 1 && partyMembers.length > 0;

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
        </AnimatePresence>

        <motion.div layout className="social-controller-header__item social-controller-header__item--profile">
          <div className="social-controller-header__profile-stack">
            <div className="social-controller-header__profile-avatar">
              <SSICNav action="Profile" />
            </div>
            <AnimatePresence initial={false}>
              {showStack && partyMembers.map((member, idx) => (
                <PartyAvatar key={member.id ?? member.name} member={member} depth={idx + 1} />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
        <motion.div layout className="social-controller-header__item">
          <SSICNav action="Notifications" />
        </motion.div>
      </motion.div>
    </div>
  );
}
