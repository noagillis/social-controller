import { FocusNode } from '@please/lrud';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUIContext } from '@/contexts/ui';
import Button from '@/tv/common/button';
import {
  NGame,
  Play,
  PhoneIconStandard,
  ThumbsUpIconStandard,
} from '@/tv/common/icons';
import { MetaTagsGame, Synopsis } from '@/tv/common/metadata';
import { RoarVideo } from '@/tv/common/roar-video';
import { Chip } from '@/tv/components/row-mvp/row-components';
import { useLolomoHorizontalVariant } from '@/tv/hooks/motion/use-mvp-variants';
import MVPRow from '@/tv/components/row-mvp/row-mvp';

const IMG_PATH = import.meta.env.BASE_URL + 'images/games-dp/';

const GameDPRowL = ({
  isFocusedRow,
  focusId,
  cardStyle,
  onNext = () => {},
}) => {
  const { selectedTitle } = useUIContext();

  const bg_artwork = `${IMG_PATH}dp-0.jpg`;
  const bg_logo = selectedTitle?.artwork?.['LOGO_BRANDED_STACKED']?.url;

  return (
    <FocusNode
      focusId={focusId}
      className='row-game-l'
      orientation='horizontal'
      defaultFocusChild={0}
      style={cardStyle}
    >
      <img className='bg abs' src={bg_artwork} alt='bg' />
      <div className='game-dp__gradient' />
      {isFocusedRow && (
        <RoarVideo
          trailer={selectedTitle?.trailer_lolomo}
          className='game-dp__video'
        />
      )}
      <div className={'info abs flex-col'}>
        <div className='logo'>
          <NGame className='logo-tag' />
          <img src={bg_logo} className='logo-img' alt='logo' />
        </div>
        <MetaTagsGame titleObj={selectedTitle} />
        <Synopsis titleObj={selectedTitle} className={'body-small'} />

        <div className='meta__ctas flex-row-center'>
          <Button type='game-dp' focusId={'button-game-dp'} onSelected={onNext}>
            <Play />
            <span className='button--text'>{'Play Game'}</span>
          </Button>

          <Button type='game-dp'>
            <PhoneIconStandard />
            <span className='button--text'>{'Get Mobile Game'}</span>
          </Button>

          <Button type='game-dp' className='button-game-dp-rating flex-center'>
            <ThumbsUpIconStandard />
          </Button>
        </div>
      </div>
      {selectedTitle?.dynamicEvidence && (
        <div className='caption-heavy evidences flex-row-center'>
          {selectedTitle?.dynamicEvidence?.chips?.map((_chip, _idx) => (
            <Chip chip={_chip} key={`chip-${_idx}`} />
          ))}
        </div>
      )}
    </FocusNode>
  );
};

const GameDPRowMeta = ({ focusId, cardStyle }) => {
  return (
    <FocusNode className='row-game-meta' focusId={focusId} style={cardStyle}>
      <img src={`${IMG_PATH}dp-1.png`} alt='game-dp-meta' />
    </FocusNode>
  );
};

const GameDPRowUpdate = ({ focusId, cardStyle, titleWidth }) => {
  const [focusedTitleIndex, setFocusedTitleIndex] = useState(0);

  const lolomoVariant = useLolomoHorizontalVariant({
    focusedTitleIndex,
    titleWidth: titleWidth,
  });

  return (
    <FocusNode className='row-game-update' focusId={focusId}>
      <motion.div
        className={`focusring abs`}
        style={cardStyle}
        initial='initial'
        animate='animate'
        exit='initial'
      />
      <FocusNode
        className='flex-row'
        elementType={motion.div}
        focusId={`${focusId}-rows`}
        orientation='horizontal'
        defaultFocusChild={focusedTitleIndex}
        onMove={(e) => {
          setFocusedTitleIndex(e.nextChildIndex);
        }}
        animate={'animate'}
        variants={lolomoVariant}
      >
        <FocusNode
          className='row-game-update__item'
          focusId={'row-game-update__img-1'}
          style={cardStyle}
        >
          <img src={`${IMG_PATH}dp-2-0.png`} alt='game-dp-update-1' />
        </FocusNode>
        <FocusNode
          className='row-game-update__item'
          focusId={'row-game-update__img-2'}
          style={cardStyle}
        >
          <img src={`${IMG_PATH}dp-2-1.png`} alt='game-dp-update-2' />
        </FocusNode>
      </FocusNode>
    </FocusNode>
  );
};

const GamesRowAchievements = ({ titleIds, titleWidth, cardStyle, focusId }) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const imgSrc = `${import.meta.env.BASE_URL}images/flows/`;

  return (
    <>
      <div className='row__icon' style={cardStyle}>
        <img
          src={imgSrc + 'dashboard-achievement-tropy.png'}
          alt='dashboard-achievement-tropy'
        />
      </div>
      <FocusNode
        focusId={focusId}
        className='row flex-row'
        orientation={'horizontal'}
        onRight={() => {
          setFocusedIndex(
            focusedIndex < titleIds.length ? focusedIndex + 1 : focusedIndex
          );
        }}
        onLeft={() => {
          setFocusedIndex(focusedIndex > 0 ? focusedIndex - 1 : focusedIndex);
        }}
      >
        <div className='focusring' style={cardStyle} />
        <motion.div
          className='item__row flex-row'
          animate={{
            x: -focusedIndex * titleWidth,
            transition: { ease: 'easeOut' },
          }}
        >
          {titleIds?.length > 0 &&
            titleIds?.map((_id, _idx) => (
              <motion.img
                style={cardStyle}
                animate={{
                  opacity: focusedIndex > _idx ? 0 : 1,
                  transition: { ease: 'easeOut' },
                }}
                key={_id + _idx}
                className='title-card'
                src={`${imgSrc}achievement-card-${_id}.png`}
                alt={`item-${_idx}`}
              />
            ))}
        </motion.div>
      </FocusNode>
    </>
  );
};

const GamesRowSquare = (props) => {
  return (
    <MVPRow {...props}>
      <CardSquare />
    </MVPRow>
  );
};

const CardSquare = ({ titleObj }) => {
  return (
    <>
      <img
        className='bg abs-center'
        src={titleObj?.artwork?.SQUARE_ART?.url}
        alt='bg'
      />
      <div className='infos center'>
        {titleObj?.dynamicEvidence && (
          <div className='callout caption-heavy'>
            <Chip chip={titleObj?.dynamicEvidence?.callout} />
          </div>
        )}
      </div>
    </>
  );
};

const GamesRowM = (props) => {
  return (
    <MVPRow {...props} isGameEd={true}>
      <CardM />
    </MVPRow>
  );
};

const CardM = ({ titleObj }) => {
  return (
    <img
      className='bg abs-center'
      src={titleObj?.artwork?.BOX_ART?.url}
      alt='bg'
    />
  );
};

export const GAME_DP_ROWS = {
  GameDPRowL,
  GameDPRowMeta,
  GameDPRowUpdate,
  GamesRowM,
  GamesRowAchievements,
  GamesRowSquare,
};
