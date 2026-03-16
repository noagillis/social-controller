import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import './welcome-toast.scss';

const TOAST_DURATION = 4000;

export default function WelcomeToast({ profile }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay so it appears after the controller UI renders
    const showTimer = setTimeout(() => setVisible(true), 500);
    const hideTimer = setTimeout(() => setVisible(false), 500 + TOAST_DURATION);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="welcome-toast"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } }}
        >
          <p className="welcome-toast__text">
            Hi, <b>{profile.name}</b>. Let's play!
          </p>
          <img
            className="welcome-toast__avatar"
            src={profile.avatar}
            alt={profile.name}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
