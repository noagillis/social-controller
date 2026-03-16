import { FocusNode } from '@please/lrud';
import { useState } from 'react';
import classNames from 'classnames';

import './ssic-grid.css';

/* eslint-disable react/prop-types */
// This function be used to map actions to key presses

export function SSICGrid() {
  const [focusedRow, setFocusedRow] = useState(0);

  return (
    <FocusNode
      className={classNames('ssic-grid flex-col')}
      orientation="vertical"
      defaultFocusChild={focusedRow}
      onMove={(e) => setFocusedRow(e.nextChildIndex)}
      wrapping={true}
    >
      {[...Array(3)].map((_, index) => (
        <Row key={`row-${index}`} />
      ))}
    </FocusNode>
  );
}

function Row() {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <FocusNode
      className="ssic-grid-row"
      defaultFocusChild={focusedIndex}
      orientation="horizontal"
      onMove={(e) => setFocusedIndex(e.nextChildIndex)}
      onBack={() => setSelectedIndex(null)}
      wrapping={true}
    >
      {[...Array(3)].map((_, index) => (
        <FocusNode
          onSelected={() => setSelectedIndex(index)}
          className={classNames(`ssic-grid-row-item`, {
            isSelected: index === selectedIndex,
          })}
          key={`item-${index}`}
        />
      ))}
    </FocusNode>
  );
}
