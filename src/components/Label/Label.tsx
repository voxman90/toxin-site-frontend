import clsx from 'clsx';
import type { ElementType, ReactNode } from 'react';

import './Label.scss';

type LabelProps<E extends ElementType> = {
  as?: E;
  text?: string;
  appendix?: string;
  hasLargeMargin?: boolean;
  children?: ReactNode;
} & React.ComponentPropsWithoutRef<E>;

const Label = <E extends ElementType = 'label'>({
  as,
  text,
  appendix,
  children,
  hasLargeMargin = false,
  className,
  ...props
}: LabelProps<E>) => {
  const Tag = as || 'label';
  const hasHeader = appendix || text;

  return (
    <Tag {...props} className={clsx('label', className)}>
      {hasHeader && (
        <span
          className={clsx('label__header', {
            'label__header--large-margin': hasLargeMargin,
          })}
        >
          {text && <span className="label__text">{text}</span>}
          {appendix && <span className="label__appendix">{appendix}</span>}
        </span>
      )}
      {children}
    </Tag>
  );
};

export default Label;
