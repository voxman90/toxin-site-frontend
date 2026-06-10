import clsx from 'clsx';
import Inputmask from 'inputmask';
import { useRef } from 'react';

import './Input.scss';

export type InputWithMaskProps = {
  mask: string;
  maskOptions?: Record<string, unknown>;
  isInvalid?: boolean;
} & React.ComponentPropsWithRef<'input'>;

const InputmaskConstructor =
  (Inputmask as unknown as { default?: typeof Inputmask }).default || Inputmask;

const InputWithMask = ({
  mask,
  maskOptions,
  isInvalid = false,
  ref,
  ...props
}: InputWithMaskProps) => {
  const maskInstance = useRef<Inputmask.Instance | null>(null);

  return (
    <input
      {...props}
      ref={(node) => {
        if (node && !maskInstance.current) {
          maskInstance.current = new InputmaskConstructor(mask, maskOptions);
          maskInstance.current.mask(node);
        }

        if (!node && maskInstance.current) {
          maskInstance.current.remove();
          maskInstance.current = null;
        }

        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={clsx('input', { 'input--invalid': isInvalid })}
    />
  );
};

export default InputWithMask;
