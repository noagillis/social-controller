const cubicOut = [0.32, 0.94, 0.6, 1];
const quintOut = [0.22, 1, 0.36, 1];
const quadOut = [0.4, 0.8, 0.74, 1];
const quarticOut = [0.26, 1, 0.48, 1];

const ease = {
  cubicOut,
  quintOut,
  quadOut,
  quarticOut,
  linear: 'linear',
};

const variant_opacity = {
  hidden: { opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  visible: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  visible__delay: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut', delay: 0.15 },
  },
  visible__delay__long: {
    opacity: 1,
    transition: { duration: 0.5, ease: cubicOut, delay: 0.2 },
  },
  hidden__delay: {
    opacity: 0,
    transition: { duration: 0.3, delay: 10, ease: 'easeOut' },
  },
};

const motionObj_opacity = {
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  variants: variant_opacity,
};

const uiTransition = {
  duration: 0.25,
  ease: cubicOut,
};

const getTransitionType = (myIndex, currentIdx, targetIndex) => {
  if (myIndex === currentIdx && currentIdx < targetIndex) {
    // console.log(`index ${myIndex} move up --- fade out`)
    return 'row1Up';
  } else if (myIndex > currentIdx && myIndex === targetIndex) {
    // console.log(`index ${myIndex} move up --- fade in`)
    return 'row2Up';
  } else if (myIndex === currentIdx && currentIdx > targetIndex) {
    //console.log(`index ${myIndex} move down --- fade out`)
    return 'row2Down';
  } else if (myIndex < currentIdx && myIndex === targetIndex) {
    //console.log(`index ${myIndex} move down --- fade in`)
    return `row1Down`;
  } else if (myIndex > targetIndex) {
    return 'rowBehind';
  } else if (myIndex < targetIndex) {
    return 'rowBefore';
  } else {
    return 'row2Up';
  }
};

export {
  variant_opacity,
  motionObj_opacity,
  ease,
  uiTransition,
  getTransitionType,
};
