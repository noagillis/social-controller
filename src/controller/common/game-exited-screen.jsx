import { useState } from 'react';
import { PROFILES } from '../pages/profile-picker/profile-picker';
import './game-exited-screen.scss';

const IMG_PATH = import.meta.env.BASE_URL + 'images';

const SUGGESTED_PLAYERS = [
  { name: 'salx', avatar: PROFILES[2]?.avatar },
  { name: 'pewpewpew', avatar: PROFILES[4]?.avatar },
  { name: 'NightOwl_22', avatar: PROFILES[0]?.avatar },
];

function AddFriendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <path d="M4 10L8.5 14.5L16 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SuggestedPlayerItem({ player }) {
  const [added, setAdded] = useState(false);

  return (
    <div className="game-exited-screen__suggested-item">
      <div className="game-exited-screen__suggested-left">
        <div className="game-exited-screen__suggested-avatar">
          {player.avatar ? (
            <img src={player.avatar} alt={player.name} />
          ) : (
            <div className="game-exited-screen__suggested-avatar-placeholder" />
          )}
        </div>
        <div className="game-exited-screen__suggested-text">
          <span className="game-exited-screen__suggested-name">{player.name}</span>
        </div>
      </div>
      <button
        className={`game-exited-screen__add-btn ${added ? '--added' : ''}`}
        onClick={() => setAdded(true)}
        disabled={added}
      >
        {added ? <CheckIcon /> : <AddFriendIcon />}
        {added ? 'Sent' : 'Add'}
      </button>
    </div>
  );
}

function ConnectedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M18 8H20.5C21.328 8 22 8.672 22 9.5V18.5C22 19.328 21.328 20 20.5 20H8.5C7.672 20 7 19.328 7 18.5V16" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
}

export default function GameExitedScreen({ onExit }) {
  return (
    <div className="game-exited-screen">
      <div className="game-exited-screen__bg">
        <img src={`${IMG_PATH}/FIFA-landing-page.jpg`} alt="" className="game-exited-screen__bg-img" />
        <div className="game-exited-screen__bg-overlay" />
      </div>

      <div className="game-exited-screen__content">
        <div className="game-exited-screen__hero">
          <img
            src={`${IMG_PATH}/phone-controller.png`}
            alt=""
            className="game-exited-screen__hero-img"
          />
        </div>

        <div className="game-exited-screen__status">
          <ConnectedIcon />
          <span>Connected</span>
        </div>

        <h1 className="game-exited-screen__title">Ready to play</h1>

        <p className="game-exited-screen__desc">
          Stay on this screen and your controller will open automatically when the next game starts.
        </p>

        <div className="game-exited-screen__actions">
          <button className="game-exited-screen__btn game-exited-screen__btn--exit" onClick={onExit}>
            <XIcon />
            <span>Exit Controller</span>
          </button>
          <button className="game-exited-screen__btn game-exited-screen__btn--feedback">
            <HelpIcon />
            <span>Give Feedback</span>
          </button>
        </div>
      </div>

      <div className="game-exited-screen__suggested">
        <div className="game-exited-screen__suggested-header">Add Friends</div>
        <div className="game-exited-screen__suggested-list">
          {SUGGESTED_PLAYERS.map((player) => (
            <SuggestedPlayerItem key={player.name} player={player} />
          ))}
        </div>
      </div>
    </div>
  );
}
