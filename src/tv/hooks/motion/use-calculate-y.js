import { useEffect, useState } from 'react';

export const calculateY = (layout, rowIndex, rowGap) => {
  return layout.slice(0, rowIndex).reduce((a, b) => {
    let _height = b.rowHeight;
    return a + _height + b.headingH + rowGap;
  }, 0);
};

const useCalculateY = (layout, rowIndex, rowGap, startTransition = true) => {
  const [sectionY, setSectionY] = useState(0);

  useEffect(() => {
    if (!layout) {
      return;
    }
    const _y = calculateY(layout, rowIndex, rowGap);
    setSectionY(_y);
  }, [rowIndex, layout, rowGap]);

  return startTransition ? sectionY : 0;
};

export default useCalculateY;
