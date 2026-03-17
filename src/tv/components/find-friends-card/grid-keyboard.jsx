import { FocusNode } from '@please/lrud';
import PropTypes from 'prop-types';

const ROWS = [
  [
    { label: '␣', value: ' ', wide: true },
    { label: '⌫', value: 'backspace', wide: true },
  ],
  ['a', 'b', 'c', 'd', 'e', 'f'],
  ['g', 'h', 'i', 'j', 'k', 'l'],
  ['m', 'n', 'o', 'p', 'q', 'r'],
  ['s', 't', 'u', 'v', 'w', 'x'],
  ['y', 'z', '1', '2', '3', '4'],
  ['5', '6', '7', '8', '9', '0'],
];

export default function GridKeyboard({ onKeyPress }) {
  const handleSelect = (value) => {
    if (value === 'backspace') {
      onKeyPress?.({ type: 'backspace' });
    } else {
      onKeyPress?.({ type: 'char', char: value });
    }
  };

  return (
    <FocusNode
      focusId="grid-keyboard"
      className="grid-keyboard"
      isGrid
    >
      {ROWS.map((row, rowIndex) => (
        <FocusNode
          key={rowIndex}
          className="grid-keyboard__row"
        >
          {(Array.isArray(row) && typeof row[0] === 'object' ? row : row.map((ch) => ({ label: ch, value: ch }))).map(
            (key) => (
              <FocusNode
                key={key.value}
                focusId={`grid-key-${key.value}`}
                className={`grid-keyboard__key${key.wide ? ' -wide' : ''}`}
                onSelected={() => handleSelect(key.value)}
              >
                <span>{key.label}</span>
              </FocusNode>
            ),
          )}
        </FocusNode>
      ))}
    </FocusNode>
  );
}

GridKeyboard.propTypes = {
  onKeyPress: PropTypes.func,
};
