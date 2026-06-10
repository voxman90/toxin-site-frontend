import clsx from 'clsx';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

import { useMergeRefs } from '../../hooks/useMergeRef';

import './Input.scss';

export type InputProps<T extends FieldValues = FieldValues> = {
  name?: Path<T>;
  register?: UseFormRegister<T>;
  isInvalid?: boolean;
  error?: string;
} & React.ComponentPropsWithRef<'input'>;

const Input = <T extends FieldValues>({
  id,
  name,
  register,
  isInvalid = false,
  error,
  ref,
  ...props
}: InputProps<T>) => {
  const { ref: hookFormRef, ...registrationProps } = register && name ? register(name) : {};
  const mergedRef = useMergeRefs(hookFormRef, ref);
  const inputId = id ?? name;
  const errorId = `${inputId}-error`;

  return (
    <div className="input-wrapper">
      <input
        {...props}
        {...registrationProps}
        ref={mergedRef}
        id={inputId}
        className={clsx('input', {
          'input--invalid': isInvalid || !!error,
          'input--has-error-text': !!error,
        })}
        aria-invalid={isInvalid || !!error}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <span id={errorId} className="input__error-text" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
