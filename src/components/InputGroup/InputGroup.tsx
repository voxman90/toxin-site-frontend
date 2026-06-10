import type { FieldError } from 'react-hook-form';

import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Label from '../Label/Label';

import './InputGroup.scss';

export interface InputGroupProps {
  error?: FieldError;
  showErrors?: boolean;
  labelText?: string;
  labelAppendix?: string;
  children: React.ReactNode;
}

const InputGroup = ({
  error,
  showErrors = true,
  labelText = '',
  labelAppendix = '',
  children,
}: InputGroupProps) => {
  return (
    <div className="input-group">
      <Label text={labelText} appendix={labelAppendix}>
        {children}
      </Label>
      {showErrors && <ErrorMessage message={error?.message} />}
    </div>
  );
};

export default InputGroup;
