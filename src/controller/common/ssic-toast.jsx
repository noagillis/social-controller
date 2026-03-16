import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@netflix-internal/xd-settings';
import ButtonWrapper from './button-wrapper';

import './ssic-toast.scss';

const SSICToast = ({
  children,
  className = '',
  action = 'Toast',
  onClick = () => {},
  onBack = () => {},
  ...props
}) => {
  const [isToastDismissed, setIsToastDismissed] = useState(true);

  const {
    actionableToastDelay,
    actionableToastDuration,
    nonActionableToastDuration,
  } = useSettings();

  // Using refs to store the timeouts
  const toastTimeout = useRef(null);
  const toastDurationTimeout = useRef(null);

  // Memoized toast settings based on the `action` prop
  const toastSettings = useMemo(
    () => ({
      delay: action === 'none' ? 0 : actionableToastDelay,
      duration:
        action === 'none'
          ? nonActionableToastDuration
          : actionableToastDuration,
    }),
    [
      action,
      actionableToastDelay,
      actionableToastDuration,
      nonActionableToastDuration,
    ]
  );

  // Memoized click handler
  const handleClick = useCallback(() => {
    if (action !== 'none') {
      clearTimeout(toastTimeout.current);
      clearTimeout(toastDurationTimeout.current);
      setIsToastDismissed(true);
      onClick();
    }
  }, [action, onClick]);

  // Manage the toast's delay and duration
  useEffect(() => {
    // Show the toast after a delay
    toastTimeout.current = setTimeout(() => {
      setIsToastDismissed(false);

      // Hide the toast after its duration
      toastDurationTimeout.current = setTimeout(() => {
        onBack();
        setIsToastDismissed(true);
      }, toastSettings.duration);
    }, toastSettings.delay);

    // Cleanup timeouts when component unmounts or dependencies change
    return () => {
      clearTimeout(toastTimeout.current);
      clearTimeout(toastDurationTimeout.current);
    };
  }, [toastSettings.delay, toastSettings.duration]);

  return (
    <AnimatePresence>
      {!isToastDismissed && (
        <motion.div
          initial={{ opacity: 0, x: '-50%', y: -10 }}
          animate={{
            opacity: 1,
            x: '-50%',
            y: 0,
            transition: { duration: 0.3, ease: 'easeInOut' },
          }}
          exit={{
            opacity: 0,
            x: '-50%',
            y: -10,
            transition: { duration: 0.3, ease: 'easeInOut' },
          }}
          className={`ssic-toast ${className}`}
        >
          <ButtonWrapper
            {...props}
            className="toast-content flex-center outline-red"
            size="auto"
            action={action}
            onClick={handleClick}
          >
            {children}
          </ButtonWrapper>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { SSICToast };
