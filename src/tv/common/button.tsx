import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FocusNode } from '@please/lrud';
import classNames from 'classnames';
import './button.css';

// Note: this button is designed for TV only. Because of that,
// it doesn't have web-specific features like hover or active states.
//

enum ButtonType {
  primary = 'primary',
  secondary = 'secondary',
  tertiary = 'tertiary',
  'game-dp' = 'game-dp',
}

enum ButtonSize {
  standard = 'standard',
  compact = 'compact',
  large = 'large',
}

interface ButtonProps {
  className?: string;
  type?: ButtonType;
  size?: ButtonSize;
  children?: React.ReactNode;
}

const Button = forwardRef(
  (
    {
      children,
      className,
      type = ButtonType.primary,
      size = ButtonSize.standard,
      ...props
    }: ButtonProps,
    ref
  ) => {
    const nodeRef = useRef(null);
    useImperativeHandle(ref, () => nodeRef.current);

    const propsRef = useRef(props);
    useEffect(() => {
      propsRef.current = props;
    }, [props]);

    return (
      <FocusNode
        {...props}
        ref={nodeRef}
        className={classNames(
          'button',
          `button-${size}`,
          `button-${type}`,
          className
        )}
      >
        {children}
      </FocusNode>
    );
  }
);

export default Button;
