const motionSettings = {
  'Vertical Motion - General': {
    verticalMoveDuration: {
      initial: 1250,
      suffix: 'ms',
    },
    verticalMoveEase: {
      values: ['quintOut', 'quadOut', 'linear', 'cubicOut'],
    },
  },
  'Vertical Motion - Row 1': {
    row1UpOpacityDuration: {
      initial: 500,
      suffix: 'ms',
    },
    row1UpOpacityEase: {
      values: ['quadOut', 'quintOut', 'linear', 'cubicOut'],
    },
    row1DownOpacityDuration: {
      initial: 250,
      suffix: 'ms',
    },
    row1DownOpacityEase: {
      values: ['linear', 'quadOut', 'quintOut', 'cubicOut'],
    },
  },
  'Vertical Motion - Row 2': {
    // row2CollapseOption: {
    //   values: ['deltaReverse', 'trueReverse'],
    // },
    row2StartingWidth: {
      initial: 90,
      suffix: '%',
    },

    row2StartingOpacity: {
      initial: 0.4,
      min: 0,
      max: 1,
    },

    row2UpOpacityDuration: {
      initial: 250,
      suffix: 'ms',
    },

    row2UpOpacityEase: {
      values: ['linear', 'quadOut', 'quintOut', 'cubicOut'],
    },
  },
  'Vertical Motion - Evidence & Meta': {
    evidenceOpacityDuration: {
      initial: 250,
      suffix: 'ms',
    },

    evidenceOpacityDelay: {
      initial: 150,
      suffix: 'ms',
    },

    evidenceOpacityEase: {
      values: ['linear', 'quadOut', 'quintOut', 'cubicOut'],
    },
    metaOpacityDuration: {
      initial: 1000,
      suffix: 'ms',
    },

    metaOpacityEase: {
      values: ['quadOut', 'linear', 'quintOut', 'cubicOut'],
    },

    metaOpacityDelay: {
      initial: 350,
      suffix: 'ms',
    },
  },
  'Horizontal Motion - General': {
    horizontalMoveDuration: {
      initial: 600,
      suffix: 'ms',
    },

    horizontalMoveEase: {
      values: ['cubicOut', 'quintOut', 'quadOut', 'linear'],
    },

    horizontalOpacityDuration: {
      initial: 250,
      suffix: 'ms',
    },

    horizontalOpacityEase: {
      values: ['linear', 'cubicOut', 'quintOut', 'quadOut'],
    },
  },
  'Horizontal Motion  - In Focus': {
    inFocusFadeInX: {
      initial: 30,
      suffix: 'px',
    },

    inFocusFadeOutOpacityDuration: {
      initial: 100,
    },

    inFocusFadeOutOpacityEase: {
      values: ['linear', 'cubicOut', 'quintOut', 'quadOut'],
    },
  },
  'Horizontal Motion - Evidence & Meta': {
    evidenceFadeInOpacityDuration: {
      initial: 250,
      suffix: 'ms',
    },

    evidenceFadeInOpacityDelay: {
      initial: 100,
      suffix: 'ms',
    },

    evidenceFadeInOpacityEase: {
      values: ['linear', 'quarticOut', 'cubicOut', 'quintOut', 'quadOut'],
    },

    metaFadeInXDuration: {
      initial: 700,
      suffix: 'ms',
    },
    metaFadeInXDelay: {
      initial: 150,
      suffix: 'ms',
    },

    metaFadeInXEase: {
      values: ['quarticOut', 'cubicOut', 'linear', 'quintOut', 'quadOut'],
    },

    metaFadeInOpacityDuration: {
      initial: 1000,
      suffix: 'ms',
    },

    metaFadeInOpacityDelay: {
      initial: 300,
      suffix: 'ms',
    },

    metaFadeInOpacityEase: {
      values: ['quadOut', 'linear', 'quintOut', 'cubicOut'],
    },
  },
  Others: {
    resetOnRefresh: {
      initial: false,
    },
    skipIntro: {
      initial: true,
    },
  },
};

const designSettings = {
  'Design Tool': {
    mediumHeight: {
      initial: 376,
      suffix: 'px',
    },
    mediumBorderRadius: {
      initial: 16,
      suffix: 'px',
    },
    mediumIFLogoWidth: {
      initial: 214,
      suffix: 'px',
    },
    mediumIFMaxCharacters: {
      initial: 55,
    },
    rowGap: {
      initial: 36,
      suffix: 'px',
    },
  },
};

const trailerSettings = {
  Trailer: {
    trailerAutoPlay: {
      initial: true,
    },
    trailerDelay: {
      initial: 2000,
      suffix: 'ms',
    },
  },
};

export { motionSettings, designSettings, trailerSettings };
