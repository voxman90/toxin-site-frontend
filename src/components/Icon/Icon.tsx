import clsx from 'clsx';
import React from 'react';

import './Icon.scss';

export type FantasyFont = 'awesome' | 'material';

interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  font?: FantasyFont;
  isSizeLg?: boolean;
  className?: string;
  as?: React.ElementType;
}

const Icon = ({
  name,
  as: Tag = 'i',
  font = 'material',
  isSizeLg = false,
  className,
  ...props
}: IconProps) => {
  const isAwesome = font === 'awesome';

  return (
    <Tag
      {...props}
      className={clsx('icon', `icon--font-${font}`, 'u-non-selectable', className, {
        'icon--size-lg': isSizeLg,
      })}
      {...(isAwesome ? { 'data-icon-name': name } : {})}
    >
      {!isAwesome && name}
    </Tag>
  );
};

export default Icon;
