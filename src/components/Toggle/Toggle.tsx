import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

import './Toggle.scss';

type ToggleProps<T extends FieldValues = FieldValues> = {
  name?: Path<T>;
  register?: UseFormRegister<T>;
  text?: string;
} & React.ComponentPropsWithoutRef<'input'>;

const Toggle = <T extends FieldValues = FieldValues>({
  name,
  text,
  register,
  ...props
}: ToggleProps<T>) => {
  const registration = register && name ? register(name) : {};

  return (
    <label className="toggle">
      <input {...props} {...registration} className="toggle__input" type="checkbox" />
      {text && <span className="toggle__text">{text}</span>}
    </label>
  );
};

export default Toggle;
