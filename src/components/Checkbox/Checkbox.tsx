import clsx from 'clsx';
import { useId } from 'react';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

import './Checkbox.scss';

export type CheckboxProps<T extends FieldValues> = {
  value: string;
  name?: Path<T>;
  register?: UseFormRegister<T>;
  text?: string;
  description?: string;
  isRich?: boolean;
  isTruncated?: boolean;
} & React.ComponentPropsWithoutRef<'input'>;

const Checkbox = <T extends FieldValues = FieldValues>({
  name,
  value,
  register,
  text = '',
  description = '',
  isRich = false,
  isTruncated = false,
  ...props
}: CheckboxProps<T>) => {
  const registration = register && name ? register(name) : {};
  const textId = useId();
  const descrId = useId();

  return (
    <label className="checkbox">
      <input
        {...props}
        {...registration}
        className="checkbox__input"
        type="checkbox"
        value={value}
        aria-labelledby={textId}
        aria-describedby={isRich && description ? descrId : undefined}
      />
      <div className={clsx('checkbox__container', { 'checkbox__container--rich': isRich })}>
        <span
          id={textId}
          className={clsx('checkbox__text', {
            'checkbox__text--rich': isRich,
            'checkbox__text--truncated': isTruncated,
          })}
        >
          {text}
        </span>
        {isRich && description && (
          <span id={descrId} className="checkbox__description">
            {description}
          </span>
        )}
      </div>
    </label>
  );
};

export default Checkbox;
