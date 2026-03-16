import { FocusNode } from '@please/lrud';
import { IMG_PATH } from '@/tv/settings/settings';
import { NLogo } from '../../common/icons';
import './screen-pause.scss';

export function ScreenPause({ onBack }) {
  return (
    <FocusNode
      focusId="screen-pause"
      className="screen-pause screen"
      onSelected={onBack}
      onBack={onBack}
    >
      <img
        src={`${IMG_PATH}/screen-pause.png`}
        alt="game-pause"
        className="screen-pause__img"
      />
    </FocusNode>
  );
}

export function ScreenPauseOnMobile({ onBack, text = '' }) {
  return (
    <FocusNode
      focusId="screen-pause-mobile"
      onBack={onBack}
      className="screen-pause__mobile screen"
    >
      <p className="screen-pause__mobile__text subtitle flex-row-center">
        <NLogo /> {text}
      </p>
      <div className="screen-pause__mobile__bg" />
    </FocusNode>
  );
}
