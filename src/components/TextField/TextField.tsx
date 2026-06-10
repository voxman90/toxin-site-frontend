import type { FieldValues } from 'react-hook-form';

import type { InputProps } from '../Input/Input';
import Input from '../Input/Input';
import type { InputGroupProps } from '../InputGroup/InputGroup';
import InputGroup from '../InputGroup/InputGroup';

type TextFieldProps<T extends FieldValues = FieldValues> = Omit<InputGroupProps, 'children'> &
  InputProps<T>;

const TextField = <T extends FieldValues>({
  labelText,
  labelAppendix,
  showErrors,
  error,
  ...rest
}: TextFieldProps<T>) => {
  return (
    <InputGroup
      labelText={labelText}
      labelAppendix={labelAppendix}
      showErrors={showErrors}
      error={error}
    >
      <Input<T> error={error} {...rest} />
    </InputGroup>
  );
};

export default TextField;
