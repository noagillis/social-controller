import { ease } from '@/tv/utils/motion';
import { useSettings } from '@netflix-internal/xd-settings';

const useImgHorizontalVariant = ({ horizontalDirection }) => {
  const {
    horizontalMoveDuration,
    horizontalMoveEase,
    inFocusFadeInX,
    horizontalOpacityDuration,
    horizontalOpacityEase,
    inFocusFadeOutOpacityDuration,
    inFocusFadeOutOpacityEase,
  } = useSettings();

  const startingX = horizontalDirection * inFocusFadeInX;

  return {
    initial: {
      opacity: 1,
      x: startingX,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        x: {
          duration: horizontalMoveDuration * 0.001,
          ease: ease[horizontalMoveEase],
        },
        opacity: {
          duration: horizontalOpacityDuration * 0.001,
          ease: ease[horizontalOpacityEase],
        },
      },
    },

    exit: {
      opacity: 0,
      x: 0,
      transition: {
        duration: inFocusFadeOutOpacityDuration * 0.001,
        ease: ease[inFocusFadeOutOpacityEase],
      },
    },
  };
};

const useTitleCardVariant = ({ cardStyle, top10X = 0 }) => {
  const {
    row2StartingWidth,
    verticalMoveDuration,
    verticalMoveEase,
    horizontalMoveDuration,
    horizontalMoveEase,
    horizontalOpacityDuration,
    horizontalOpacityEase,
  } = useSettings();

  let { width: _width, width_open } = cardStyle;

  let _widthStart = row2StartingWidth * 0.01;

  let _transitionV = {
    duration: verticalMoveDuration * 0.001,
    ease: ease[verticalMoveEase],
  };

  let _transitionH = {
    duration: horizontalMoveDuration * 0.001,
    ease: ease[horizontalMoveEase],
  };

  let _transitionHOpacity = {
    duration: horizontalOpacityDuration * 0.001,
    ease: ease[horizontalOpacityEase],
  };

  let width = _width + top10X;
  let _widthDelta = width_open - _width;

  let transition = _transitionV;

  let transition_H = { opacity: _transitionHOpacity, width: _transitionH };

  const variants = {
    rowInitOpen: {
      width: width_open + top10X,
      justifyContent: 'start',
    },
    rowWidthOpen: {
      width: [width + _widthDelta * _widthStart, width_open + top10X],
      justifyContent: 'start',
      transition,
    },
    rowWidthClose: {
      width: [width + _widthDelta * (1 - _widthStart), width],
      justifyContent: 'start',
      transition,
    },
  };

  return {
    lolomo: {
      rowWidthOpen: {
        opacity: 0.5,
        ...variants.rowWidthOpen,
      },
      rowWidthClose: {
        opacity: 1,
        ...variants.rowWidthClose,
      },
      focusedTitle: {
        opacity: 0.2,
        width: width_open + top10X,
        transition: transition_H,
      },
      beforeFocusedTitle: {
        justifyContent: 'start',
        opacity: 0.5,
        width: width,
        transition: transition_H,
      },
      afterFocusedTitle: {
        justifyContent: 'end',
        width: width,
        opacity: 1,
        transition: transition_H,
      },
    },
    focusRing: {
      ...variants,
      hide: {
        opacity: 0,
        transition: {
          delay: _transitionV.duration,
          ..._transitionV,
        },
      },
      show: {
        opacity: 1,
        transition: { duration: 0 },
      },
    },
  };
};

const useBottomInfoVariant = (config) => {
  const {
    metaOpacityDuration,
    metaOpacityDelay,
    metaOpacityEase,
    metaFadeInOpacityDuration,
    metaFadeInOpacityEase,
    metaFadeInOpacityDelay,
    metaFadeInXDelay,
    metaFadeInXDuration,
    metaFadeInXEase,
    inFocusFadeInX,
  } = useSettings();

  const { horizontalDirection } = config;

  const startingX = horizontalDirection * inFocusFadeInX;

  const _transitionOpacity =
    horizontalDirection === 0
      ? {
          duration: metaOpacityDuration * 0.001,
          ease: ease[metaOpacityEase],
          delay: metaOpacityDelay * 0.001,
        }
      : {
          duration: metaFadeInOpacityDuration * 0.001,
          ease: ease[metaFadeInOpacityEase],
          delay: metaFadeInOpacityDelay * 0.001,
        };

  return {
    initial: { opacity: 0, x: startingX },
    hidden: { opacity: 0 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        opacity: _transitionOpacity,
        x: {
          duration: metaFadeInXDuration * 0.001,
          delay: metaFadeInXDelay * 0.001,
          ease: ease[metaFadeInXEase],
        },
      },
    },
  };
};
const useLolomoHorizontalVariant = ({ focusedTitleIndex, titleWidth }) => {
  const { horizontalMoveDuration, horizontalMoveEase } = useSettings();

  return {
    initial: {
      x: -focusedTitleIndex * titleWidth,
    },
    animate: {
      x: -focusedTitleIndex * titleWidth,
      transition: {
        duration: horizontalMoveDuration * 0.001,
        ease: ease[horizontalMoveEase],
      },
    },
  };
};

const useRowVariant = ({ rowHeight = 300 }) => {
  const {
    row1UpOpacityDuration,
    row2UpOpacityDuration,
    row1UpOpacityEase,
    row2UpOpacityEase,
    row1DownOpacityDuration,
    row1DownOpacityEase,
    row2StartingOpacity,
    verticalMoveDuration,
    verticalMoveEase,
    MRowBottomGap,
    SRowBottomGap,
    centerAlign,
  } = useSettings();

  return {
    exit: {
      opacity: 0,
      transition: {
        duration: row1DownOpacityDuration * 0.001,
        ease: ease[row1DownOpacityEase],
      },
    },
    initial: { opacity: row2StartingOpacity },
    row1Up: {
      opacity: 0,
      transition: {
        duration: row1UpOpacityDuration * 0.001,
        ease: ease[row1UpOpacityEase],
      },
    },
    row2Up: {
      opacity: 1,
      transition: {
        duration: row2UpOpacityDuration * 0.001,
        ease: ease[row2UpOpacityEase],
      },
    },
    row1Down: {
      opacity: 1,
      transition: {
        duration: row1DownOpacityDuration * 0.001,
        ease: ease[row1DownOpacityEase],
      },
    },
    row2Down: { opacity: row2StartingOpacity },
    rowBehind: { opacity: row2StartingOpacity },
    changeOpacity: { opacity: row2StartingOpacity },
    rowAnchorInFocus: {
      height: rowHeight - MRowBottomGap,
      y: centerAlign ? (rowHeight - MRowBottomGap) / 2 - 188 - 43 : 0,
      transition: {
        duration: verticalMoveDuration * 0.001,
        ease: ease[verticalMoveEase],
      },
    },
    rowAnchorInFocusS: {
      height: rowHeight - SRowBottomGap,
      y: centerAlign ? (rowHeight - SRowBottomGap) / 2 - 146 - 43 : 0,
      transition: {
        duration: verticalMoveDuration * 0.001,
        ease: ease[verticalMoveEase],
      },
    },
    rowAnchorOutFocus: {
      height: rowHeight,
      y: 0,
      transition: {
        duration: verticalMoveDuration * 0.001,
        ease: ease[verticalMoveEase],
      },
    },
  };
};

const useEvidenceVariant = ({ horizontalDirection }) => {
  const {
    inFocusFadeOutOpacityDuration,
    inFocusFadeOutOpacityEase,
    evidenceOpacityDuration,
    evidenceOpacityDelay,
    evidenceOpacityEase,
    evidenceFadeInOpacityDuration,
    evidenceFadeInOpacityDelay,
    evidenceFadeInOpacityEase,
    inFocusFadeInX,
    horizontalMoveEase,
    horizontalMoveDuration,
  } = useSettings();

  const startingX = horizontalDirection * inFocusFadeInX;

  const _transitionOpacity =
    horizontalDirection === 0
      ? {
          duration: evidenceOpacityDuration * 0.001,
          delay: evidenceOpacityDelay * 0.001,
          ease: ease[evidenceOpacityEase],
        }
      : {
          duration: evidenceFadeInOpacityDuration * 0.001,
          delay: evidenceFadeInOpacityDelay * 0.001,
          ease: ease[evidenceFadeInOpacityEase],
        };

  return {
    initial: {
      opacity: 0,
      x: startingX,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        x: {
          duration: horizontalMoveDuration * 0.001,
          ease: ease[horizontalMoveEase],
        },
        opacity: _transitionOpacity,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: inFocusFadeOutOpacityDuration * 0.001,
        ease: ease[inFocusFadeOutOpacityEase],
      },
    },
  };
};

const useFocusRingVerticalVariant = ({ isHidden }) => {
  const { verticalMoveDuration, verticalMoveEase } = useSettings();

  return {
    initial: { opacity: 0 },
    animate: {
      opacity: isHidden ? 0 : 1,
      transition: {
        duration: verticalMoveDuration * 0.001,
        ease: ease[verticalMoveEase],
      },
    },
  };
};

const useFocusRingTop10Variant = ({ top10X }) => {
  const { horizontalMoveDuration, horizontalMoveEase } = useSettings();

  return {
    initial: {
      x: top10X,
    },
    animate: {
      x: top10X,
      transition: {
        duration: horizontalMoveDuration * 0.001,
        ease: ease[horizontalMoveEase],
      },
    },
  };
};

export {
  useTitleCardVariant,
  useLolomoHorizontalVariant,
  useRowVariant,
  useBottomInfoVariant,
  useEvidenceVariant,
  useImgHorizontalVariant,
  useFocusRingVerticalVariant,
  useFocusRingTop10Variant,
};
