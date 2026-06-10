import clsx from 'clsx';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

import Checkbox from '../Checkbox/Checkbox';
import type { CheckboxProps } from '../Checkbox/Checkbox';

import './CheckboxGroup.scss';

export type CheckboxGroupOption<T extends FieldValues> = Omit<
  CheckboxProps<T>,
  'register' | 'name'
>;

type CheckboxGroupProps<T extends FieldValues> = {
  name: Path<T>;
  options: CheckboxGroupOption<T>[];
  register: UseFormRegister<T>;
} & React.ComponentPropsWithoutRef<'ul'>;

const CheckboxGroup = <T extends FieldValues = FieldValues>({
  name,
  options,
  register,
  className,
}: CheckboxGroupProps<T>) => {
  return (
    <ul className={clsx('checkbox-group', className)}>
      {options.map((option) => {
        const { key, ...rest } = option;

        return (
          <li key={key} className="checkbox-group__item">
            <Checkbox name={name} register={register} {...rest} />
          </li>
        );
      })}
    </ul>
  );
};

export default CheckboxGroup;
