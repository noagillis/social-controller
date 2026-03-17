import { useEffect, useRef, useState, useCallback } from 'react';
import { useSendMessage } from '../hooks/use-send-message';
import { socket } from '../utils/controller-socket';
import { motion, AnimatePresence } from 'framer-motion';

import './friend-search-overlay.scss';

const MAX_CHARS = 10;

export default function FriendSearchOverlay({ isVisible, onClose }) {
  const inputRef = useRef(null);
  const sendMessage = useSendMessage();
  const [value, setValue] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const updateKeyboardHeight = useCallback(() => {
    const vv = window.visualViewport;
    if (vv) {
      // The difference between full window height and visible viewport = keyboard height
      const kbHeight = window.innerHeight - vv.height;
      setKeyboardHeight(kbHeight > 0 ? kbHeight : 0);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      setValue('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      const vv = window.visualViewport;
      if (vv) {
        vv.addEventListener('resize', updateKeyboardHeight);
        updateKeyboardHeight();
      }
      return () => {
        vv?.removeEventListener('resize', updateKeyboardHeight);
      };
    }
  }, [isVisible, updateKeyboardHeight]);

  // Listen for text updates from TV grid keyboard
  useEffect(() => {
    const handleMessage = (messageBody) => {
      if (messageBody?.type === 'friendSearchText') {
        setValue(messageBody.data?.text || '');
      }
    };
    socket.on('receiveMessage', handleMessage);
    return () => socket.off('receiveMessage', handleMessage);
  }, []);

  const handleChange = (e) => {
    const text = e.target.value.slice(0, MAX_CHARS);
    setValue(text);
    sendMessage('friendSearchText', { text });
  };

  const handleClose = () => {
    sendMessage('friendSearchClose', {});
    onClose();
  };

  // Keep focus on the hidden input when tapping anywhere on the overlay
  const handleTap = () => {
    inputRef.current?.focus();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="friend-search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleTap}
        >
          {/* Background with purple glow */}
          <div className="friend-search-overlay__bg" />
          <div className="friend-search-overlay__glow" />

          {/* Close button (X) — stays at top right */}
          <button className="friend-search-overlay__x" onClick={handleClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M15 5L5 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Toolbar above keyboard: counter + done */}
          <div
            className="friend-search-overlay__toolbar"
            style={{ bottom: keyboardHeight }}
          >
            <div className="friend-search-overlay__counter">
              {value.length}/{MAX_CHARS}
            </div>
            <button className="friend-search-overlay__done" onClick={handleClose}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7L5.5 10.5L12 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Done
            </button>
          </div>

          {/* Centered display text */}
          <div className="friend-search-overlay__display">
            <span className="friend-search-overlay__text">
              {value}
            </span>
            <span className="friend-search-overlay__cursor" />
          </div>

          {/* Hidden input that captures keyboard */}
          <input
            ref={inputRef}
            type="text"
            className="friend-search-overlay__hidden-input"
            value={value}
            onChange={handleChange}
            maxLength={MAX_CHARS}
            enterKeyHint="done"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
