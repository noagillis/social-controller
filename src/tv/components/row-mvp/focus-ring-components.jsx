import { AnimatePresence, motion } from 'framer-motion';
import { RoarVideo } from '@/tv/common/roar-video';
import {
  MetaTags,
  MetaTagsGame,
  MetaTagsGameEd,
  Synopsis,
} from '@/tv/common/metadata';

import {
  Evidence,
  TitleLogo,
  MobileGameLogo,
  GameEdCTA,
  TitleArtwork,
} from '@/tv/components/row-mvp/row-components';

const FocusedImages = ({
  isRowOpen,
  isFocusedRow,
  focusedTitleObj,
  variants,
}) => {
  return (
    <div className='focused__img__wrapper -v abs'>
      <AnimatePresence>
        <motion.div
          key={focusedTitleObj?.videoId}
          className='focused__img__wrapper -h abs'
          variants={variants}
          initial={'initial'}
          animate={'animate'}
          exit={'exit'}
        >
          {isFocusedRow && (
            <RoarVideo trailer={focusedTitleObj?.trailer_lolomo} />
          )}
          <TitleArtwork titleObj={focusedTitleObj} isRowOpen={isRowOpen} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const FocusedEvidences = ({
  focusedTitleObj,
  evidenceVariants,
  size,
  ...props
}) => {
  const titleType = 'is' + focusedTitleObj?.type;

  return (
    <AnimatePresence>
      <motion.div
        key={focusedTitleObj?.videoId}
        className='focused__info__wrapper'
        variants={evidenceVariants}
        initial={'initial'}
        animate={'animate'}
        exit={'exit'}
      >
        <div className={`abs info flex-col ${titleType}`}>
          {titleType === 'isMobileGame' ? (
            <MobileGameLogo titleObj={focusedTitleObj} />
          ) : titleType === 'isGameEd' ? (
            <GameEdCTA />
          ) : (
            <TitleLogo
              titleObj={focusedTitleObj}
              size={size}
              hasGameLogo={titleType === 'isCloudGame'}
            />
          )}
        </div>

        <Evidence titleObj={focusedTitleObj} size={size} {...props} />
      </motion.div>
    </AnimatePresence>
  );
};

const FocusedMeta = ({ focusedTitleObj, metaVariants, isGameEd, style }) => {
  const isGame = focusedTitleObj?.type?.includes('Game');

  return (
    <AnimatePresence>
      <motion.div
        key={focusedTitleObj?.videoId}
        style={style}
        className='info-expanded flex-col abs'
        variants={metaVariants}
        initial={'initial'}
        animate={'animate'}
        exit={'hidden'}
      >
        {isGameEd ? (
          <MetaTagsGameEd titleObj={focusedTitleObj} />
        ) : (
          <>
            {isGame ? (
              <MetaTagsGame titleObj={focusedTitleObj} />
            ) : (
              <MetaTags titleObj={focusedTitleObj} />
            )}
            <Synopsis titleObj={focusedTitleObj} />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export { FocusedImages, FocusedEvidences, FocusedMeta };
