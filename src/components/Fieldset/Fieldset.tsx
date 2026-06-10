import clsx from 'clsx';
import React from 'react';

import './Fieldset.scss';

type FieldsetProps = {
  name?: string;
  legend?: string;
  indent?: 'xs' | 'sm' | 'md';
  id?: string;
  className?: string;
} & React.ComponentPropsWithoutRef<'fieldset'>;

const Fieldset: React.FC<React.PropsWithChildren<FieldsetProps>> = ({
  children,
  name,
  indent,
  legend,
  id,
  className,
  ...props
}) => {
  return (
    <fieldset {...props} className={clsx('fieldset', className)} name={name} form={id}>
      {legend && (
        <legend
          className={clsx('fieldset__legend', {
            [`fieldset__legend--indent-${indent}`]: indent,
          })}
        >
          {legend}
        </legend>
      )}
      {children}
    </fieldset>
  );
};

export default Fieldset;
