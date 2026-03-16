
import { useState, useEffect } from 'react';

export const useMountAnimationComplete = (isVisible, onMountComplete) => {
  const [isMounting, setIsMounting] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsMounting(true);
    }
  }, [isVisible]);

  const handleAnimationComplete = () => {
    if (isMounting) {
      onMountComplete(); // Trigger the callback provided by the component
      setIsMounting(false); // Reset the state after mount animation is complete
    }
  };

  return handleAnimationComplete;
};
