import { useEffect, useState } from 'react';

const ScreenWrapper = ({ children, className = '', zIndex = 5 }) => {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [safeAreaInsetTop, setSafeAreaInsetTop] = useState(0);

  useEffect(() => {
    // Retrieve the safe area inset value once the component is mounted
    const safeAreaElement = document.getElementById('safe-area');

    const handleResize = () => {
      // Use visualViewport if available, fallback to innerHeight for older browsers
      const height = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;
      const width = window.visualViewport
        ? window.visualViewport.width
        : window.innerWidth;

      setViewportHeight(height);
      setViewportWidth(width);

      // if (safeAreaElement) {
      //   const computedStyle = window.getComputedStyle(safeAreaElement);
      //   const safeAreaInsetTop = computedStyle.paddingTop;
      //   setSafeAreaInsetTop(safeAreaInsetTop);
      //   console.log('Safe Area Inset Top:', safeAreaInsetTop);
      // }
    };

    // Set initial height
    handleResize();

    // Add event listeners for resize events
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      id="safe-area"
      className={`controller-screen screen-wrapper ${className}`}
      style={{
        '--vh': `${viewportHeight}px`, // Dynamically set the height
        '--vw': `${viewportWidth}px`, // Dynamically set the height
        zIndex: zIndex,
        position: 'fixed',
        paddingTop: 'env(safe-area-inset-top)', // For newer iOS
      }}
    >
      {children}
    </div>
  );
};

export default ScreenWrapper;
