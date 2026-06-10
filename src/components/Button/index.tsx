import clsx from 'clsx';

import './Button.scss';

type ButtonSize = 'stretchy' | 'long' | 'short' | 'content';
type ButtonVariant = 'filled' | 'outlined' | 'text';

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  hasPadding?: boolean;
  hasArrow?: boolean;
} & React.ComponentPropsWithRef<'button'>;

const Button = ({
  children,
  type = 'button',
  variant = 'outlined',
  size = 'stretchy',
  hasPadding = false,
  hasArrow = false,
  ref,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={clsx('button', `button--variant-${variant}`, `button--size-${size}`, {
        'button--has-padding': hasPadding,
        'button--has-arrow': hasArrow,
      })}
    >
      <span className="button__text">{children}</span>
    </button>
  );
};

export default Button;
