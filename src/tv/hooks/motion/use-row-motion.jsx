import { useSettings } from '@netflix-internal/xd-settings';
import { useEffect, useRef, useState } from 'react';
import { useAnimation } from 'framer-motion';
import { getTransitionType } from '@/tv/utils/motion';
import { useRowVariant } from '@/tv/hooks/motion/use-mvp-variants';

export default function useRowMotion(rowIndex, focusedRowIndex, rowHeight) {
  const nextFocusedRow = useRef(focusedRowIndex);
  const [rowTransitionType, setRowTransitionType] = useState(() =>
    getTransitionType(rowIndex, nextFocusedRow.current, focusedRowIndex)
  );

  const controls = useAnimation();

  const { row2StartingOpacity } = useSettings();
  const rowVariant = useRowVariant({ rowHeight });

  useEffect(() => {
    //change next focused row index;
    let type = getTransitionType(
      rowIndex,
      nextFocusedRow.current,
      focusedRowIndex
    );

    setRowTransitionType(type);
    nextFocusedRow.current = focusedRowIndex;
  }, [rowIndex, focusedRowIndex]);

  useEffect(() => {
    if (rowIndex - 1 === focusedRowIndex) {
      controls.start('changeOpacity');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row2StartingOpacity]);

  useEffect(() => {
    controls.start(rowTransitionType);
  }, [controls, rowTransitionType]);

  return {
    rowVariant,
    rowControl: controls,
    rowTransitionType,
  };
}
