import { useEffect, useState } from 'react';
import { useSettings } from '@netflix-internal/xd-settings';
import { useNavigate } from 'react-router-dom';
import { useUIContext } from '@/contexts/ui';
import Button from '@/tv/common/button';
import { FocusNode } from '@please/lrud';
import { pageIds } from './page-constants';
import { startCase } from 'lodash';

export default function PageGrid() {
  const navigate = useNavigate();
  const [hoveringTitle, setHoverTitle] = useState();
  const { showHelpers } = useSettings();

  const {
    lastGridPosition,
    setLastGridPosition,
    setPageId,
    setCurrentStep,
    setIsToastDismissed,
  } = useUIContext();

  //reset
  useEffect(() => {
    setCurrentStep(1);
    setPageId('home');
    setIsToastDismissed(true);
  }, [setPageId, setCurrentStep]);
  

  return (
    <>
      <FocusNode
        isGrid
        className='grid'
        defaultFocusColumn={lastGridPosition.columnIndex}
        defaultFocusRow={lastGridPosition.rowIndex}
        onGridMove={(e) => {
          setLastGridPosition({
            rowIndex: e.nextRowIndex,
            columnIndex: e.nextColumnIndex,
          });
        }}
      >
        { showHelpers && 
      <p className='grid-title body-standard'>
        {startCase(hoveringTitle).replace(/\bTv\b/g, 'TV')}
      </p>}
        <FocusNode className='row'>
          {['f1', 'f2', 'f3', 'f4'].map((_path, _idx) => (
            <Button
              key={_path}
              className='block'
              type='secondary'
              size='large'
              onSelected={() => navigate(_path)}
              onFocused={() => setHoverTitle(pageIds[_idx])}
            >
              {_idx + 1}
            </Button>
          ))}
        </FocusNode>

        <FocusNode className='row'>
          {['f5', 'f6', 'f7', 'f8'].map((_path, _idx) => (
            <Button
              key={_path}
              className='block'
              type='secondary'
              size='large'
              onSelected={() => navigate(_path)}
              onFocused={() => setHoverTitle(pageIds[_idx + 4])}
            >
              {_idx + 5}
            </Button>
          ))}
        </FocusNode>

        <FocusNode className='row'>
          {['f9', 'f10'].map((_path, _idx) => (
            <Button
              key={_path}
              className='block'
              type='secondary'
              size='large'
              onSelected={() => navigate(_path)}
              onFocused={() => setHoverTitle(pageIds[_idx + 8])}
            >
              {_idx + 9}
            </Button>
          ))}
        </FocusNode>
      </FocusNode>
    </>
  );
}
