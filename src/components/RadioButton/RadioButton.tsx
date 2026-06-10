import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

import './RadioButton.scss';

type RadioButtonProps<T extends FieldValues> = {
  value: string;
  name?: Path<T>;
  register?: UseFormRegister<T>;
  text?: string;
} & React.ComponentPropsWithoutRef<'input'>;

const RadioButton = <T extends FieldValues = FieldValues>({
  value,
  name,
  register,
  text,
  ...props
}: RadioButtonProps<T>) => {
  const registration = register && name ? register(name) : {};

  return (
    <label className="radio-button">
      <input
        {...props}
        {...registration}
        type="radio"
        className="radio-button__input"
        value={value}
      />
      {text && <span className="radio-button__text">{text}</span>}
    </label>
  );
};

export default RadioButton;
