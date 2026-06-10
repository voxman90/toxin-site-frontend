import clsx from 'clsx';
import React from 'react';

import './Field.scss';

type FieldWidth = 'sm' | 'md' | 'lg';

type FieldMargin = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: FieldWidth;
  margin?: FieldMargin;
  zIndex?: number;
}

const Field = ({
  width = 'md',
  margin = 'sm',
  zIndex,
  children,
  ...props
}: React.PropsWithChildren<FieldProps>) => {
  return (
    <div
      {...props}
      className={clsx('field', `field--width-${width}`, `field--margin-${margin}`)}
      style={zIndex === undefined ? {} : { zIndex }}
    >
      {children}
    </div>
  );
};

export default Field;
