import { FocusNode } from '@please/lrud';
import PropTypes from 'prop-types';

const IMG_PATH = import.meta.env.BASE_URL + 'images';

function MagnifyingGlassIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M16 16L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function FindFriendsCard({ searchText, children }) {
  return (
    <div className="find-friends-card">
      <div className="find-friends-card__bg" />
      <FocusNode
        className="find-friends-card__content"
        orientation="horizontal"
      >
        <FocusNode
          focusId="find-friends-input"
          className="find-friends-card__left"
          defaultFocused
        >
          <div className="find-friends-card__illustration">
            <img src={`${IMG_PATH}/handshake.png`} alt="" width="105" height="105" />
          </div>
          <h2 className="find-friends-card__title">Find Friends</h2>
          <div className="find-friends-card__search-area">
            <div className="find-friends-card__input">
              <MagnifyingGlassIcon />
              <span className="find-friends-card__input-text">
                {searchText}
                <span className="find-friends-card__cursor" />
              </span>
            </div>
            <div className="find-friends-card__search-btn">
              <span>Search</span>
            </div>
          </div>
        </FocusNode>
        {children}
      </FocusNode>
    </div>
  );
}

FindFriendsCard.propTypes = {
  searchText: PropTypes.string.isRequired,
};
