import { useState, useEffect } from 'react';

const useBrowserFocus = () => {
  // State to track if the browser is focused
  const [isFocused, setIsFocused] = useState(document.hasFocus());

  useEffect(() => {
    // Handler for focus event
    const handleFocus = () => {
      setIsFocused(true);
    };

    // Handler for blur event
    const handleBlur = () => {
      setIsFocused(false);
    };

    // Add event listeners for focus and blur events
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []); // Empty array ensures the effect only runs on mount and unmount

  return isFocused;
};

export default useBrowserFocus;
