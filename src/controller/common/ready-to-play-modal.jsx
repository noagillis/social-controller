import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import './ready-to-play-modal.scss';

const SHOW_DELAY = 5500; // appears after welcome toast fades (~500ms delay + 4000ms display + 300ms exit + buffer)

export default function ReadyToPlayModal({ onStartPlaying, onGoBack }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
  };

  const handleStart = () => {
    setVisible(false);
    onStartPlaying?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="ready-to-play-scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }}
          exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }}
        >
          <motion.div
            className="ready-to-play-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } }}
          >
            <div className="ready-to-play-modal__dismiss">
              <button onClick={handleDismiss} aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="ready-to-play-modal__body">
              <h2 className="ready-to-play-modal__title">Ready to Play?</h2>
              <p className="ready-to-play-modal__description">
                Make sure all of your players are connected and ready. You will need to restart the game to add more players.
              </p>
              <button className="ready-to-play-modal__btn-primary" onClick={handleStart}>
                Start Playing
              </button>
              <button className="ready-to-play-modal__btn-tertiary" onClick={handleDismiss}>
                Go Back
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
