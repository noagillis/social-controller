import { useSettings } from '@netflix-internal/xd-settings';
import classNames from 'classnames';
import { useMemo } from 'react';

import Button from '@/tv/common/button';
import { NGame, Play } from '@/tv/common/icons';

import {
  filterValuesByLength,
  getImgFocalPoint,
  removeTop10,
  trimSentence,
} from '@/tv/utils/math';

const MobileGameLogo = ({ titleObj }) => {
  return (
    <>
      <img
        className={`logo -${titleObj?.type}`}
        src={titleObj?.artwork?.['APP_ICON']?.url}
        alt={'logo'}
      />
      <div className='flex-col game-title'>
        <NGame />
        <p className='subtitle-heavy'>{trimSentence(titleObj?.title, 30)}</p>
      </div>
    </>
  );
};

const GameEdCTA = () => {
  return (
    <Button
      focusId='game-ed-cta'
      type='game-dp'
      className={'isFocusedLeaf subtitle-heavy'}
      disabled={true}
    >
      <Play />
      Watch
    </Button>
  );
};

const TitleLogo = ({
  titleObj,
  type = 'LOGO_BRANDED_STACKED',
  size,
  hasGameLogo,
}) => {
  const style = titleObj?.artwork?.[type]?.style;

  return (
    <>
      {hasGameLogo && <NGame className='tag-game' />}
      <img
        className={`logo -${size}`}
        src={titleObj?.artwork?.[type]?.url}
        style={style}
        alt={'logo'}
      />
    </>
  );
};

const TitleArtwork = ({
  titleObj,
  artworkType = 'STORY_ART',
  isRowOpen = false,
}) => {
  const _artwork =
    titleObj?.artwork?.[artworkType] ?? titleObj?.artwork?.['SHORT_PANEL'];

  const transform = getImgFocalPoint(_artwork, isRowOpen);

  return (
    <img
      className='bg abs'
      style={{ transform: transform }}
      src={_artwork?.url}
      alt='bg'
    />
  );
};
const Evidence = ({ titleObj, ...props }) => {
  const { mediumIFMaxCharacters } = useSettings();

  return (
    <div className='caption-heavy evidences flex-row-center'>
      <MetaChips
        key={mediumIFMaxCharacters}
        evidence={titleObj?.dynamicEvidence}
        type='chips'
        isGame={titleObj?.type === 'Game'}
        maxLength={mediumIFMaxCharacters}
        {...props}
      />
    </div>
  );
};

const CallOut = ({ titleObj, size = 'm', ...props }) => {
  return (
    <div className={`callout caption-heavy foreground flex-row-center date`}>
      <MetaChips
        evidence={titleObj?.dynamicEvidence}
        type='callout'
        size={size}
        {...props}
      />
    </div>
  );
};

const MetaChips = ({
  evidence,
  type,
  size = 'm',
  maxLength,
  isTop10,
  isGame,
}) => {
  const { user, mediumHeight } = useSettings();

  const _chipsLength = getChipsLength(user, maxLength);
  const _calloutLength = getCalloutLength(user);

  const _chipType = evidence?.[type];
  const _chips = useMemo(
    () => getChips(_chipType, isTop10),
    [_chipType, isTop10]
  );

  if (type === 'chips') {
    const _callouts = useMemo(
      () =>
        isGame
          ? _chips && Object.values(_chips)
          : filterValuesByLength(_chips, _chipsLength[size]),
      [isGame, _chips, _chipsLength, size]
    );

    return (
      _callouts &&
      _callouts.map((_chip, _idx) => <Chip chip={_chip} key={`chip-${_idx}`} />)
    );
  } else {
    const _callout = useMemo(
      () =>
        isGame
          ? _chipType
          : Object.values(_chips).find(
              (obj) =>
                obj.text.length <
                _calloutLength[mediumHeight > 300 ? size : 's']
            ),
      [isGame, _chipType, _chips, _calloutLength, size]
    );

    return _callout && <Chip chip={_callout} />;
  }
};

const Chip = ({ chip }) => {
  return (
    <p
      className={classNames('callout-chip flex-row-center', {
        isLiveNow: chip?.text === 'Live Now',
      })}
    >
      {chip?.icon && chip?.icon}
      {chip?.text}
    </p>
  );
};

const getChipsLength = (user, max_m_us) => ({
  l: [51, 80],
  m: user === 'KR' ? [15, 40] : [max_m_us * 0.5, max_m_us],
  s: user === 'KR' ? [15, 30] : [20, 42],
  xs: user === 'KR' ? [10, 20] : [10, 30],
});

const getCalloutLength = (user) => ({
  m: user === 'KR' ? 14 : 30,
  s: user === 'KR' ? 10 : 20,
  xs: user === 'KR' ? 10 : 15,
});

const getChips = (_chipType, isTop10) =>
  _chipType?.topten && isTop10 ? removeTop10(_chipType) : _chipType;

export {
  Evidence,
  TitleArtwork,
  TitleLogo,
  MobileGameLogo,
  GameEdCTA,
  CallOut,
  MetaChips,
  Chip,
};
