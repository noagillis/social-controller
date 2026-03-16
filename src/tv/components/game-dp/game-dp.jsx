import { useSettings } from '@netflix-internal/xd-settings';
import { FocusNode } from '@please/lrud';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ease } from '@/tv/utils/motion';
import { GAME_DP_LAYOUT } from '@/tv/utils/layout';
import useCalculateY from '@/tv/hooks/motion/use-calculate-y';
import useRowMotion from '@/tv/hooks/motion/use-row-motion';
import { useDataContext } from '@/contexts/data';
import { GAME_DP_ROWS } from './game-dp-rows';

import './game-dp.scss';

export default function GameDP(props) {
  const { rowGap, verticalMoveDuration, verticalMoveEase } = useSettings();

  const [focusedMasterGrid, setFocusedMasterGrid] = useState({
    row: 0,
    col: 0,
  });

  const sectionY = useCalculateY(GAME_DP_LAYOUT, focusedMasterGrid.row, rowGap);

  return (
    <motion.div className={`screen game-dp`}>
      <FocusNode
        elementType={motion.div}
        className='flex-col'
        focusId={'game-dp'}
        style={{ gap: rowGap }}
        orientation='vertical'
        initial={{ y: -sectionY, opacity: 0 }}
        animate={{ y: -sectionY, opacity: 1 }}
        transition={{
          duration: verticalMoveDuration * 0.001,
          ease: ease[verticalMoveEase],
        }}
        defaultFocusChild={focusedMasterGrid.row}
        onMove={(e) => {
          setFocusedMasterGrid({ row: e.nextChildIndex, col: 0 });
        }}
      >
        {GAME_DP_LAYOUT?.map((_row, _idx) => {
          return (
            <GameDPRow
              key={`gamedp-${_idx}`}
              rowConfig={_row}
              focusedRowIndex={focusedMasterGrid.row}
              {...props}
            />
          );
        })}
      </FocusNode>
    </motion.div>
  );
}

const GameDPRow = ({ rowConfig, focusedRowIndex, ...props }) => {
  const { gameData } = useDataContext();

  const { rowIndex, rowId, headingH, rowHeight, cardStyle, rowComponent } =
    rowConfig;

  const _rowHeight = headingH + rowHeight;

  const { rowVariant, rowControl, rowTransitionType } = useRowMotion(
    rowIndex,
    focusedRowIndex,
    _rowHeight
  );

  const rowData = gameData?.['gameLolomos']?.[rowId] || {};
  const DynamicRow = GAME_DP_ROWS?.[rowComponent] || <div>{rowId}</div>;

  return (
    <motion.div
      className={`mvp__row ${rowId}`}
      animate={rowControl}
      variants={rowVariant}
      style={{ height: _rowHeight }}
    >
      {rowData?.title && (
        <p className='mvp__row__heading foreground body-standard-heavy'>
          {rowData?.title}
        </p>
      )}

      {DynamicRow && (
        <DynamicRow
          {...props}
          focusId={rowId}
          titleIds={rowData?.videoIds}
          isFocusedRow={rowIndex === focusedRowIndex}
          rowTransitionType={rowTransitionType}
          rowConfig={rowConfig}
          cardStyle={cardStyle}
          titleWidth={cardStyle?.width + 12}
        />
      )}
    </motion.div>
  );
};
