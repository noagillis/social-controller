import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { useUIContext } from '@/contexts/ui';
import { useFocusedTitleControl } from '@/tv/hooks/motion/use-in-focus-motion';
import {
  useBottomInfoVariant,
  useEvidenceVariant,
  useFocusRingTop10Variant,
  useFocusRingVerticalVariant,
  useImgHorizontalVariant,
  useTitleCardVariant,
} from '@/tv/hooks/motion/use-mvp-variants';

import {
  FocusedEvidences,
  FocusedImages,
  FocusedMeta,
} from './focus-ring-components';
import './focus-ring.scss';

export default function MVPRowFocusRing({
  rowConfig,
  top10X,
  isRowOpen = true,
  isFocusedRow,
  horizontalDirection,
  focusedTitleObj,
  className = '',
  isGameEd = false,
}) {
  const initialLoad = useRef();
  const { isOnNav } = useUIContext();

  const { headingH = 0, cardStyle, size = 'm' } = rowConfig;

  const focusStyle = {
    ...cardStyle,
    x: 0,
    y: headingH,
  };

  const titleCardVariant = useTitleCardVariant({
    cardStyle,
    top10X: 0,
    isReady: initialLoad.current,
  });
  const titleCardControls = useFocusedTitleControl({
    isRowOpen,
    isFocusedRow,
    isFocusedRing: true,
  });
  const focusedVariants = {
    focusring_v: useFocusRingVerticalVariant({
      isHidden: !isRowOpen || isOnNav,
    }),
    img_h: useImgHorizontalVariant({ horizontalDirection }),
    evidence: useEvidenceVariant({ horizontalDirection }),
    meta: useBottomInfoVariant({ horizontalDirection }),
    focusring_top10: useFocusRingTop10Variant({ top10X }),
  };

  const contentType =
    focusedTitleObj?.['device'] === 'mobile'
      ? 'MobileGame'
      : focusedTitleObj?.['type'];

  useEffect(() => {
    if (!initialLoad.current) {
      initialLoad.current = true;
    }
  }, []);

  return (
    <>
      <motion.div
        className={`mvp__row__focusring`}
        style={cardStyle}
        variants={focusedVariants.focusring_top10}
        initial={'initial'}
        animate={'animate'}
        exit={'initial'}
      >
        <motion.div
          className='mvp__row__focusring'
          variants={titleCardVariant?.focusRing}
          style={focusStyle}
          animate={titleCardControls}
        >
          <motion.div
            className={`focusring abs ${className}`}
            style={{
              borderRadius: cardStyle.borderRadius,
            }}
            variants={focusedVariants.focusring_v}
            initial='initial'
            animate='animate'
            exit='initial'
          />

          <div
            className='mvp__focused__wrapper'
            style={{ borderRadius: cardStyle?.borderRadius }}
          >
            <FocusedImages
              isRowOpen={isRowOpen}
              isFocusedRow={isFocusedRow}
              focusedTitleObj={focusedTitleObj}
              variants={focusedVariants?.img_h}
            />
            {isRowOpen && (
              <>
                <div className='skrim-bottom' />
                <FocusedEvidences
                  focusedTitleObj={focusedTitleObj}
                  evidenceVariants={focusedVariants?.evidence}
                  contentType={contentType}
                  isTop10={top10X > 0}
                  size={size}
                />
              </>
            )}
          </div>
        </motion.div>

        {isRowOpen && (
          <FocusedMeta
            rowConfig={rowConfig}
            focusedTitleObj={focusedTitleObj}
            metaVariants={focusedVariants.meta}
            style={{
              y: focusStyle.y + focusStyle.height,
              width: cardStyle?.width_open,
            }}
            isGameEd={isGameEd}
          />
        )}
      </motion.div>
    </>
  );
}
