import { useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { useUIContext } from '@/contexts/ui';

export default function useFocusedTitle({
  focusedTitleIndex,
  focusedTitleObj,
  isFocusedRow,
}) {
  const { setFocusedTitleObj } = useUIContext();
  const [localFocusedObj, setLocalFocusedObj] = useState(focusedTitleObj);
  const localFocusedTitleIndex = useRef(focusedTitleIndex);
  const localHorizontalDirection = useRef(
    localFocusedTitleIndex.current > focusedTitleIndex
      ? -1
      : localFocusedTitleIndex.current < focusedTitleIndex
      ? 1
      : 0
  );

  useEffect(() => {
    localHorizontalDirection.current =
      localFocusedTitleIndex.current > focusedTitleIndex
        ? -1
        : localFocusedTitleIndex.current < focusedTitleIndex
        ? 1
        : 0;
    localFocusedTitleIndex.current = focusedTitleIndex;
    setLocalFocusedObj(focusedTitleObj);
    setFocusedTitleObj(focusedTitleObj);
  }, [focusedTitleIndex, focusedTitleObj]);

  useEffect(() => {
    localHorizontalDirection.current = 0;
  }, [isFocusedRow]);

  return {
    localFocusedObj,
    localHorizontalDirection,
  };
}

const useFocusedTitleControl = ({
  isRowOpen,
  focusedTitleIndex = 0,
  titleIndex = 0,
  isFocusedRow = false,
  isFocusedRing = false,
}) => {
  const controls = useAnimation();
  const isFocusedTitle = titleIndex === focusedTitleIndex;

  // VERTICAL ANIMATION
  const verticalAnimation = () => {
    if (!isFocusedTitle) {
      return;
    }

    if (isRowOpen) {
      controls.start(['rowWidthOpen', 'show']);
    } else {
      controls.start(['rowWidthClose', 'hide']);
    }
  };

  //   HORIZONTAL ANIMATION
  const horizontalAnimation = () => {
    if (titleIndex < focusedTitleIndex) {
      controls.start('beforeFocusedTitle');
    }

    if (titleIndex > focusedTitleIndex) {
      controls.start('afterFocusedTitle');
    }
    if (titleIndex === focusedTitleIndex) {
      controls.start('focusedTitle');
    }
  };

  useEffect(() => {
    verticalAnimation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRowOpen]);

  useEffect(() => {
    if (!isFocusedRow || isFocusedRing) return;

    horizontalAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedTitleIndex]);

  return controls;
};

export { useFocusedTitle, useFocusedTitleControl };
