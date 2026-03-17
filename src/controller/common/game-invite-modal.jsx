import { motion, AnimatePresence } from 'framer-motion';
import './game-invite-modal.scss';

export default function GameInviteModal({ invite, onAccept, onDecline }) {
  if (!invite) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="game-invite-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className="game-invite"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.35, ease: [0.32, 0.94, 0.6, 1] }}
        >
          <div className="game-invite__glow" />

          <div className="game-invite__visual">
            <div className="game-invite__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z" />
              </svg>
            </div>
            <div className="game-invite__label">Game Invite</div>
          </div>

          <div className="game-invite__info">
            <div className="game-invite__body">
              <span className="game-invite__from">{invite.fromPlayer}</span>
              <span className="game-invite__message">invited you to play</span>
              <span className="game-invite__game">{invite.game}</span>
            </div>

            <div className="game-invite__actions">
              <button className="game-invite__accept" onClick={onAccept}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10L8.5 14.5L16 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Join Game
              </button>
              <button className="game-invite__decline" onClick={onDecline}>
                Not Now
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
