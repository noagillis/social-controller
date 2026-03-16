import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import classNames from 'classnames';
import { useSendMessage } from '../hooks/use-send-message';
import './button-wrapper.scss';

export default function ButtonWrapper({
  className,
  children,
  action,
  onClick,
  scaleAmount = 0.95,
  ...props
}) {
  const [isPressed, setIsPressed] = useState(false);
  const sendMessage = useSendMessage();

  // Memoize the button click handler
  const onClickButton = useCallback(() => {
    if (action !== 'none') {
      console.log(`[Controller] Button pressed: ${action}`);
      sendMessage('buttonPress', { button: action });
      onClick?.();
    }
  }, [action, onClick, sendMessage]);

  // Memoize press handlers to avoid recreation on each render
  const handlePressStart = useCallback(() => setIsPressed(true), []);
  const handlePressEnd = useCallback(() => setIsPressed(false), []);

  return (
    <motion.div
      className={classNames('button-wrapper', className, {
        pressed: action !== 'none' && isPressed,
      })}
      style={{
        '--scale-amount': `${scaleAmount}`,
      }}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onClick={onClickButton}
      {...props}
    >
      {children}
    </motion.div>
  );
}
