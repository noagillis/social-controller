import { FocusNode } from '@please/lrud';
import { AnimatePresence, motion } from 'framer-motion';
import { Children, cloneElement, useState } from 'react';
import { useDataContext } from '@/contexts/data';
import {
  useFocusedTitle,
  useFocusedTitleControl,
} from '@/tv/hooks/motion/use-in-focus-motion';
import {
  useLolomoHorizontalVariant,
  useTitleCardVariant,
} from '@/tv/hooks/motion/use-mvp-variants';
import MVPRowFocusRing from './focus-ring';

import './row-mvp.scss';

export default function MVPRow({
  focusId,
  isFocusedRow,
  rowTransitionType,
  rowConfig,
  titleWidth,
  titleIds = [],
  cardStyle,
  isGameEd,
  ...props
}) {
  const { gameData } = useDataContext();
  const [focusedTitleIndex, setFocusedTitleIndex] = useState(0);

  const isRowOpen =
    rowTransitionType === 'row1Up' ||
    rowTransitionType === 'row2Up' ||
    rowTransitionType === 'row1Down' ||
    rowTransitionType === 'rowBefore';

  const focusedTitleId = titleIds?.[focusedTitleIndex];
  const focusedTitleObj = gameData?.['gameTitles']?.[focusedTitleId];

  const { localFocusedObj, localHorizontalDirection } = useFocusedTitle({
    focusedTitleIndex,
    focusedTitleObj,
    isFocusedRow,
  });

  const rowVariantH = useLolomoHorizontalVariant({
    focusedTitleIndex,
    titleWidth: titleWidth,
  });

  return (
    <>
      <MVPRowFocusRing
        rowConfig={rowConfig}
        rowTransitionType={rowTransitionType}
        isRowOpen={isRowOpen}
        focusedTitleObj={localFocusedObj}
        focusedTitleIndex={focusedTitleIndex}
        horizontalDirection={localHorizontalDirection.current}
        isFocusedRow={isFocusedRow}
        isGameEd={isGameEd}
      />

      <FocusNode
        elementType={motion.div}
        className='row flex-row'
        focusId={focusId}
        orientation='horizontal'
        defaultFocusChild={focusedTitleIndex}
        onMove={(e) => {
          setFocusedTitleIndex(e.nextChildIndex);
        }}
        variants={rowVariantH}
        initial={'initial'}
        animate={'animate'}
        exit={{ opacity: 0 }}
      >
        {titleIds?.length > 0 &&
          titleIds?.map((_titleId, _idx) => {
            let _titleObj = gameData?.['gameTitles']?.[_titleId];

            return (
              <TitleCard
                key={`${focusId}-${_titleId}`}
                focusId={`${focusId}-${_idx}`}
                titleIndex={_idx}
                focusedTitleIndex={focusedTitleIndex}
                isRowOpen={isRowOpen}
                cardStyle={cardStyle}
                rowTransitionType={rowTransitionType}
                isFocusedRow={isFocusedRow}
                titleObj={_titleObj}
                titleId={_titleId}
                horizontalDirection={localHorizontalDirection.current}
                {...props}
              />
            );
          })}
      </FocusNode>
    </>
  );
}

const TitleCard = ({
  focusId,
  titleIndex,
  cardStyle,
  titleObj,
  titleId,
  focusedTitleIndex,
  children,
  ...props
}) => {
  const cardVariant = useTitleCardVariant({
    cardStyle,
  });

  const controls = useFocusedTitleControl({
    titleIndex,
    focusedTitleIndex,
    ...props,
  });

  const wrapperStyle = {
    ...cardStyle,
    width: cardStyle.width,
  };

  return (
    <AnimatePresence>
      <FocusNode
        elementType={motion.div}
        focusId={focusId}
        className='titlecard__roar'
        variants={cardVariant?.lolomo}
        animate={controls}
        style={wrapperStyle}
      >
        <div className='titlecard' style={cardStyle}>
          {Children.map(children, (child) =>
            cloneElement(child, {
              titleObj: titleObj,
              titleId: titleId,
              cardStyle: cardStyle,
            })
          )}
        </div>
      </FocusNode>
    </AnimatePresence>
  );
};
