import { useSettings } from '@netflix-internal/xd-settings';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import Video from './video';

import './roar-video.scss';

const RoarVideo = ({
  trailer,
  className,
  onEnded = () => {},
  quickStart = false,
  delayOverwrite = -1,
  pauseOverWrite = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isReadytoPlay, setIsReadyToPlay] = useState(false);
  const { trailerAutoPlay, trailerDelay = 0 } = useSettings();
  const $delayStart = useRef();
  const $movie = useRef();
  const $startedInitPlay = useRef();

  const _delay = quickStart
    ? 0
    : delayOverwrite > -1
    ? delayOverwrite
    : trailerDelay;

  useEffect(() => {
    $delayStart.current = setTimeout(() => {
      setIsReadyToPlay(true);
    }, _delay);

    return () => {
      clearTimeout($delayStart.current);
    };
  }, [_delay]);

  useEffect(() => {
    if (isLoaded && isReadytoPlay) {
      $movie?.current?.play();
      $startedInitPlay.current = true;
    }
  }, [isLoaded, delayOverwrite, isReadytoPlay]);

  useEffect(() => {
    if ($startedInitPlay.current) {
      pauseOverWrite ? $movie?.current?.pause() : $movie?.current?.play();
    }
  }, [pauseOverWrite]);

  return (
    <AnimatePresence mode='wait'>
      {trailerAutoPlay && trailer && (
        <motion.div
          key={trailer}
          initial={{ opacity: 0 }}
          animate={{
            opacity: isReadytoPlay ? 1 : 0,
            transition: { duration: 0.3, ease: 'easeOut' },
          }}
          exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
          className={classNames('video__container', className)}
        >
          <Video
            className='video'
            ref={$movie}
            src={trailer}
            isReadytoPlay={isReadytoPlay}
            onLoadedData={() => {
              setIsLoaded(true);
            }}
            onEnded={() => {
              setIsReadyToPlay(false);
              onEnded();
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { RoarVideo };
