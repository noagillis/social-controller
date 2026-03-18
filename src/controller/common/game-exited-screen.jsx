import './game-exited-screen.scss';

const IMG_PATH = import.meta.env.BASE_URL + 'images';

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

export default function GameExitedScreen() {
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
          <button className="game-exited-screen__btn game-exited-screen__btn--exit">
            <XIcon />
            <span>Exit Controller</span>
          </button>
          <button className="game-exited-screen__btn game-exited-screen__btn--feedback">
            <HelpIcon />
            <span>Give Feedback</span>
          </button>
        </div>
      </div>
    </div>
  );
}
