import { FocusNode, useSetFocus } from '@please/lrud';
import { useRef, useMemo, useEffect } from 'react';
import { useSettings } from '@netflix-internal/xd-settings';
import { useUIContext } from '@/contexts/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { useMountAnimationComplete } from '@/tv/hooks/use-mount-animation-complete';

import { uiTransition } from '@/tv/utils/motion';
import ToastAudio from '../../common/audio';

import './toast.scss';

export const ToastMini = ({
  children,
  isActionable = true,
  isToastVisible = false,
  onMounted = () => {},
  onDismissed = () => {},
  onNext = () => {},
}) => {
  const { isToastDismissed, setIsToastDismissed } = useUIContext();
  const {
    actionableToastDelay,
    actionableToastDuration,
    nonActionableToastDuration,
  } = useSettings();

  const toastTimeout = useRef();
  const toastDurationTimeout = useRef();

  const toastSettings = useMemo(
    () => ({
      delay: isActionable ? actionableToastDelay : 0,
      duration: isActionable
        ? actionableToastDuration
        : nonActionableToastDuration,
    }),
    [
      isActionable,
      actionableToastDelay,
      actionableToastDuration,
      nonActionableToastDuration,
    ]
  );

  // Manage the toast delay and duration in a single effect
  useEffect(() => {
    if (isToastVisible) {
      toastTimeout.current = setTimeout(() => {
        setIsToastDismissed(false);

        toastDurationTimeout.current = setTimeout(() => {
          setIsToastDismissed(true);
          onDismissed();
        }, toastSettings.duration);
      }, toastSettings.delay);
    }

    if (!isToastVisible) {
      clearTimeout(toastTimeout.current);
      clearTimeout(toastDurationTimeout.current);
    }

    return () => {
      clearTimeout(toastTimeout.current);
      clearTimeout(toastDurationTimeout.current);
    };
  }, [toastSettings.delay, toastSettings.duration, setIsToastDismissed]);

  const handleAnimationComplete = useMountAnimationComplete(
    isToastVisible,
    () => {
      onMounted();
    }
  );

  return (
    <AnimatePresence>
      {isToastVisible && !isToastDismissed && (
        <FocusNode
          focusId="toast"
          className="screen-toast -mini"
          elementType={motion.div}
          onSelected={onNext}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0, transition: uiTransition }}
          exit={{ opacity: 0, x: 100, transition: uiTransition }}
          onAnimationComplete={handleAnimationComplete}
        >
          {children}
          <ToastAudio />
        </FocusNode>
      )}
    </AnimatePresence>
  );
};

export const ToastExpanded = ({
  children,
  isToastVisible,
  onMounted = () => {},
  ...props
}) => {
  const setFocus = useSetFocus();

  const handleAnimationComplete = useMountAnimationComplete(
    isToastVisible,
    () => {
      setFocus('toast-expanded');
      onMounted();
    }
  );

  return (
    <AnimatePresence>
      {isToastVisible && (
        <FocusNode
          elementType={motion.div}
          defaultFocusChild={1}
          focusId={'toast-expanded'}
          isTrap={true}
          orientation="horizontal"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0, transition: uiTransition }}
          exit={{ opacity: 0, x: 10, transition: uiTransition }}
          className="screen-toast -expanded flex-col-center"
          onAnimationComplete={handleAnimationComplete}
          {...props}
        >
          {children}
        </FocusNode>
      )}
    </AnimatePresence>
  );
};
